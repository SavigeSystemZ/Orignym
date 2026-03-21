#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: configure-project-profile.sh <target-repo> [--app-name NAME]
EOF
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

TARGET_REPO=""
APP_NAME=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --app-name)
      APP_NAME="${2:-}"
      shift 2
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
  usage
  exit 1
fi

if [[ -z "${APP_NAME}" ]]; then
  APP_NAME="$(basename -- "${TARGET_REPO}")"
fi

PROFILE="${TARGET_REPO}/_system/PROJECT_PROFILE.md"

if [[ ! -f "${PROFILE}" ]]; then
  echo "Missing project profile: ${PROFILE}" >&2
  exit 1
fi

python3 - <<'PY' "${PROFILE}" "${APP_NAME}"
from pathlib import Path
import re
import sys

path = Path(sys.argv[1])
app_name = sys.argv[2]
slug = re.sub(r"[^a-z0-9]+", "-", app_name.lower()).strip("-") or "app"
app_id = f"io.aiaast.{slug.replace('-', '.')}"
text = path.read_text()
text = text.replace("- App name:", f"- App name: {app_name}", 1)
text = text.replace("- App id:", f"- App id: {app_id}", 1)
text = text.replace("- Desktop entry id:", f"- Desktop entry id: {app_id}", 1)
text = text.replace("- Android application id:", f"- Android application id: {app_id}", 1)
text = text.replace("- Branch strategy:", "- Branch strategy: main for runtime code, system for copied AIAST updates, optional short-lived feature branches", 1)
text = text.replace("- Packaging manifest paths:", "- Packaging manifest paths: packaging/appimage.yml, packaging/flatpak-manifest.json, packaging/snapcraft.yaml", 1)
text = text.replace("- Installer commands:", "- Installer commands: ops/install/install.sh, ops/install/repair.sh, ops/install/uninstall.sh, ops/install/purge.sh", 1)
text = text.replace("- Android module path:", "- Android module path: mobile/flutter/", 1)
text = text.replace("- LLM config path:", "- LLM config path: ai/llm_config.yaml", 1)
text = text.replace("- Chatbot surfaces:", "- Chatbot surfaces: CLI REPL, REST endpoint, GUI side panel when a UI exists", 1)
text = text.replace("- Signing identity:", "- Signing identity: Savige Systems (SYstemZ) placeholder; replace if the project uses a different release owner", 1)
path.write_text(text)
PY

echo "Configured project profile for ${APP_NAME}"
