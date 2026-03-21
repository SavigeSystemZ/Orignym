#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: check-runtime-foundations.sh [target-repo] [--strict]

Validate generated runtime foundations such as packaging manifests, install scaffolds,
mobile module placeholders, env defaults, and AI configuration examples.
EOF
}

TARGET_REPO=""
STRICT=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --strict)
      STRICT=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      if [[ -z "${TARGET_REPO}" ]]; then
        TARGET_REPO="$1"
        shift
      else
        echo "Unexpected argument: $1" >&2
        exit 1
      fi
      ;;
  esac
done

if [[ -z "${TARGET_REPO}" ]]; then
  TARGET_REPO="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
fi

if [[ ! -d "${TARGET_REPO}" ]]; then
  echo "Target repo does not exist: ${TARGET_REPO}" >&2
  exit 1
fi

python3 - <<'PY' "${TARGET_REPO}" "${STRICT}"
from __future__ import annotations

import json
import re
import stat
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

repo = Path(sys.argv[1]).resolve()
strict = sys.argv[2] == "1"
issues: list[str] = []

profile_path = repo / "_system" / "PROJECT_PROFILE.md"
profile_text = profile_path.read_text() if profile_path.exists() else ""


def field(label: str) -> str:
    match = re.search(rf"^- {re.escape(label)}:[ \t]*(.*)$", profile_text, re.MULTILINE)
    return match.group(1).strip() if match else ""


def split_csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


def ensure_exists(rel: str, kind: str = "file") -> None:
    path = repo / rel
    if kind == "dir":
        ok = path.is_dir()
    else:
        ok = path.is_file()
    if not ok:
        issues.append(f"Expected runtime {kind} missing: {rel}")


expected_files = []
expected_dirs = []

expected_files.extend(split_csv(field("Packaging manifest paths")))
expected_files.extend(split_csv(field("Installer commands")))
llm_config_path = field("LLM config path")
if llm_config_path:
    expected_files.append(llm_config_path)
android_module_path = field("Android module path")
if android_module_path:
    expected_dirs.append(android_module_path.rstrip("/"))

runtime_roots = [name for name in ("packaging", "ops", "mobile", "ai") if (repo / name).exists()]

for rel in expected_files:
    ensure_exists(rel, "file")
for rel in expected_dirs:
    ensure_exists(rel, "dir")

if not runtime_roots and not expected_files and not expected_dirs:
    print("runtime_foundations_absent")
    raise SystemExit(0)

files_to_scan: list[Path] = []
for root_name in runtime_roots:
    root = repo / root_name
    files_to_scan.extend(path for path in root.rglob("*") if path.is_file())
for rel in ("LICENSE", "NOTICE", ".credits-hidden"):
    path = repo / rel
    if path.is_file():
        files_to_scan.append(path)

placeholder_pattern = re.compile(r"__AIAST_[A-Z0-9_]+__")
for path in files_to_scan:
    try:
        text = path.read_text()
    except UnicodeDecodeError:
        continue
    if placeholder_pattern.search(text):
        issues.append(f"Unresolved runtime placeholder in {path.relative_to(repo)}")

env_example = repo / "ops" / "env" / ".env.example"
if env_example.exists():
    env_text = env_example.read_text()

    def env_value(key: str) -> str:
        match = re.search(rf"^{re.escape(key)}=(.*)$", env_text, re.MULTILINE)
        return match.group(1).strip() if match else ""

    bind_address = env_value("APP_BIND_ADDRESS")
    if bind_address in {"0.0.0.0", "::", "localhost"}:
        issues.append("ops/env/.env.example must default to loopback instead of a wildcard or localhost alias")

    start = env_value("APP_PORT_RANGE_START")
    end = env_value("APP_PORT_RANGE_END")
    if not (start.isdigit() and end.isdigit()):
        issues.append("ops/env/.env.example must define numeric APP_PORT_RANGE_START and APP_PORT_RANGE_END")
    elif int(start) >= int(end):
        issues.append("ops/env/.env.example must keep APP_PORT_RANGE_START below APP_PORT_RANGE_END")

installer_commands = split_csv(field("Installer commands"))
for rel in installer_commands:
    path = repo / rel
    if path.exists() and not (stat.S_IMODE(path.stat().st_mode) & 0o111):
        issues.append(f"Installer command is not executable: {rel}")
    if path.exists():
        result = subprocess.run(
            ["bash", str(path), "--help"],
            cwd=repo,
            text=True,
            capture_output=True,
        )
        if result.returncode != 0:
            issues.append(f"Installer command --help failed: {rel}")

port_allocator = repo / "ops" / "install" / "lib" / "port_allocator.py"
if port_allocator.exists():
    result = subprocess.run(
        [sys.executable, str(port_allocator), "--help"],
        cwd=repo,
        text=True,
        capture_output=True,
    )
    if result.returncode != 0:
        issues.append("ops/install/lib/port_allocator.py --help failed")

flatpak_manifest = repo / "packaging" / "flatpak-manifest.json"
if flatpak_manifest.exists():
    try:
        manifest = json.loads(flatpak_manifest.read_text())
    except Exception as exc:  # noqa: BLE001
        issues.append(f"Invalid JSON in packaging/flatpak-manifest.json: {exc}")
    else:
        if not manifest.get("app-id"):
            issues.append("packaging/flatpak-manifest.json is missing app-id")
        if not manifest.get("command"):
            issues.append("packaging/flatpak-manifest.json is missing command")

appimage_manifest = repo / "packaging" / "appimage.yml"
if appimage_manifest.exists():
    appimage_text = appimage_manifest.read_text()
    for needle in ("version:", "AppDir:", "app_info:", "exec:"):
        if needle not in appimage_text:
            issues.append(f"packaging/appimage.yml is missing required key: {needle}")

snapcraft_manifest = repo / "packaging" / "snapcraft.yaml"
if snapcraft_manifest.exists():
    snap_text = snapcraft_manifest.read_text()
    for needle in ("name:", "version:", "apps:", "parts:"):
        if needle not in snap_text:
            issues.append(f"packaging/snapcraft.yaml is missing required key: {needle}")

llm_config = repo / (llm_config_path or "ai/llm_config.yaml")
if llm_config.exists():
    llm_text = llm_config.read_text()
    if "default_provider:" not in llm_text or "providers:" not in llm_text or "chatbot:" not in llm_text:
        issues.append(f"{llm_config.relative_to(repo)} is missing required top-level sections")
    else:
        default_provider_match = re.search(r"^default_provider:\s*(\S+)\s*$", llm_text, re.MULTILINE)
        provider_names: list[str] = []
        in_providers = False
        for raw_line in llm_text.splitlines():
            line = raw_line.rstrip()
            if re.match(r"^[A-Za-z0-9_-]+:", line):
                in_providers = line.startswith("providers:")
                continue
            if in_providers and re.match(r"^  [A-Za-z0-9_-]+:\s*$", line):
                provider_names.append(line.strip().rstrip(":"))
            elif in_providers and re.match(r"^[^ ]", line):
                in_providers = False
        if default_provider_match:
            default_provider = default_provider_match.group(1)
            if default_provider not in provider_names:
                issues.append(f"{llm_config.relative_to(repo)} default_provider is not defined under providers")

android_manifest = repo / "mobile" / "flutter" / "android" / "app" / "src" / "main" / "AndroidManifest.xml"
if android_manifest.exists():
    try:
        root = ET.fromstring(android_manifest.read_text())
    except Exception as exc:  # noqa: BLE001
        issues.append(f"Invalid XML in {android_manifest.relative_to(repo)}: {exc}")
    else:
        package_name = root.attrib.get("package", "").strip()
        if not package_name:
            issues.append(f"{android_manifest.relative_to(repo)} is missing a package attribute")

pubspec_path = repo / "mobile" / "flutter" / "pubspec.yaml"
if pubspec_path.exists():
    pubspec_text = pubspec_path.read_text()
    for needle in ("name:", "environment:", "dependencies:"):
        if needle not in pubspec_text:
            issues.append(f"mobile/flutter/pubspec.yaml is missing required key: {needle}")

hidden_name = "Michael Todd Spaulding"
leak_roots = [repo / name for name in ("README.md", "AI_SYSTEM_README.md", "packaging", "mobile", "ai", "_system")]
for root in leak_roots:
    if not root.exists():
        continue
    targets = [root] if root.is_file() else [path for path in root.rglob("*") if path.is_file()]
    for path in targets:
        if path.name == ".credits-hidden":
            continue
        try:
            text = path.read_text()
        except UnicodeDecodeError:
            continue
        if hidden_name in text:
            issues.append(f"Hidden author name leaked outside .credits-hidden: {path.relative_to(repo)}")

if issues:
    print("runtime_foundations_issues_detected")
    for issue in issues:
        print(f"- {issue}")
    raise SystemExit(1 if strict else 1)

print("runtime_foundations_ok")
PY
