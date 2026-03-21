#!/usr/bin/env bash

# Shared helpers for AIAST bootstrap and maintenance scripts.

aiaast_is_stateful_path() {
  case "$1" in
    "TODO.md"|\
    "FIXME.md"|\
    "WHERE_LEFT_OFF.md"|\
    "PLAN.md"|\
    "ROADMAP.md"|\
    "DESIGN_NOTES.md"|\
    "ARCHITECTURE_NOTES.md"|\
    "RESEARCH_NOTES.md"|\
    "TEST_STRATEGY.md"|\
    "RISK_REGISTER.md"|\
    "RELEASE_NOTES.md"|\
    "CHANGELOG.md"|\
    "_system/PROJECT_PROFILE.md"|\
    "_system/context/CURRENT_STATUS.md"|\
    "_system/context/DECISIONS.md"|\
    "_system/context/MEMORY.md"|\
    "_system/context/ARCHITECTURAL_INVARIANTS.md"|\
    "_system/context/ASSUMPTIONS.md"|\
    "_system/context/INTEGRATION_SURFACES.md"|\
    "_system/context/OPEN_QUESTIONS.md"|\
    "_system/context/QUALITY_DEBT.md")
      return 0
      ;;
  esac

  return 1
}

aiaast_is_local_config_path() {
  case "$1" in
    ".cursor/mcp.json"|\
    "_system/.template-install.json"|\
    "_system/SYSTEM_REGISTRY.json"|\
    "AIAST_REMOVED.md")
      return 0
      ;;
  esac

  return 1
}

aiaast_is_manifest_excluded_path() {
  local rel="$1"

  if aiaast_is_stateful_path "${rel}" || aiaast_is_local_config_path "${rel}"; then
    return 0
  fi

  case "${rel}" in
    "README.md"|\
    "_system/INTEGRITY_MANIFEST.sha256"|\
    "claude_diff.patch"|\
    *.swp)
      return 0
      ;;
  esac

  return 1
}

aiaast_is_template_diff_skip_path() {
  local rel="$1"

  if aiaast_is_stateful_path "${rel}" || aiaast_is_local_config_path "${rel}"; then
    return 0
  fi

  case "${rel}" in
    "README.md")
      return 0
      ;;
  esac

  return 1
}

aiaast_template_version() {
  local root="$1"
  local version_file="${root}/_system/.template-version"

  if [[ -f "${version_file}" ]]; then
    tr -d '\n' < "${version_file}"
    return 0
  fi

  echo "unknown"
}

aiaast_install_metadata_path() {
  local repo_root="$1"
  printf '%s\n' "${repo_root}/_system/.template-install.json"
}

aiaast_detect_system_readme_path() {
  local repo_root="$1"
  local metadata_path
  metadata_path="$(aiaast_install_metadata_path "${repo_root}")"

  if [[ -f "${metadata_path}" ]]; then
    python3 - <<'PY' "${metadata_path}"
import json
import sys
from pathlib import Path

path = Path(sys.argv[1])
try:
    data = json.loads(path.read_text())
    value = data.get("system_readme_path")
    if value:
        print(value)
except Exception:
    pass
PY
    return 0
  fi

  if [[ -f "${repo_root}/AI_SYSTEM_README.md" ]]; then
    echo "AI_SYSTEM_README.md"
  else
    echo "README.md"
  fi
}

aiaast_write_install_metadata() {
  local repo_root="$1"
  local source_template="$2"
  local source_version="$3"
  local install_mode="$4"
  local system_readme_path="$5"
  local event="$6"

  local metadata_path
  metadata_path="$(aiaast_install_metadata_path "${repo_root}")"

  python3 - <<'PY' "${metadata_path}" "${source_template}" "${source_version}" "${install_mode}" "${system_readme_path}" "${event}"
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

path = Path(sys.argv[1])
source_template = sys.argv[2]
source_version = sys.argv[3]
install_mode = sys.argv[4]
system_readme_path = sys.argv[5]
event = sys.argv[6]
now = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")

data = {}
if path.exists():
    try:
        data = json.loads(path.read_text())
    except Exception:
        data = {}

installed_at = data.get("installed_at")
if not installed_at or installed_at == "UNSET":
    installed_at = now

data.update(
    {
        "template_name": "AIAST",
        "template_version": source_version,
        "source_template": source_template,
        "install_mode": install_mode,
        "system_readme_path": system_readme_path,
        "installed_at": installed_at,
        "updated_at": now,
        "last_event": event,
    }
)

path.parent.mkdir(parents=True, exist_ok=True)
path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n")
PY
}

aiaast_list_files() {
  local root="$1"
  (cd "${root}" && find . -type f ! -path '*/.git/*' | sort)
}

aiaast_list_manifest_files() {
  local root="$1"

  (
    cd "${root}"
    while IFS= read -r rel; do
      rel="${rel#./}"
      if aiaast_is_manifest_excluded_path "${rel}"; then
        continue
      fi
      printf './%s\n' "${rel}"
    done < <(find . -type f ! -path '*/.git/*' | sort)
  )
}

aiaast_copy_rel_file() {
  local source_root="$1"
  local source_rel="$2"
  local target_root="$3"
  local target_rel="$4"

  mkdir -p "$(dirname "${target_root}/${target_rel}")"
  cp -p "${source_root}/${source_rel}" "${target_root}/${target_rel}"
}

aiaast_print_managed_files() {
  local repo_root="$1"
  local readme_path
  readme_path="$(aiaast_detect_system_readme_path "${repo_root}")"

  local root_files=(
    "AGENTS.md"
    "CLAUDE.md"
    "GEMINI.md"
    "CODEX.md"
    "WINDSURF.md"
    ".cursorrules"
    ".windsurfrules"
    "AIAST_VERSION.md"
    "AIAST_CHANGELOG.md"
    "TODO.md"
    "FIXME.md"
    "WHERE_LEFT_OFF.md"
    "CHANGELOG.md"
    "PLAN.md"
    "ROADMAP.md"
    "DESIGN_NOTES.md"
    "ARCHITECTURE_NOTES.md"
    "RESEARCH_NOTES.md"
    "TEST_STRATEGY.md"
    "RISK_REGISTER.md"
    "RELEASE_NOTES.md"
    "${readme_path}"
  )
  local rel
  for rel in "${root_files[@]}"; do
    [[ -f "${repo_root}/${rel}" ]] && printf '%s\n' "${rel}"
  done

  local managed_dirs=(
    "bootstrap"
    "_system"
    ".cursor"
    ".github"
  )
  local dir
  for dir in "${managed_dirs[@]}"; do
    if [[ -d "${repo_root}/${dir}" ]]; then
      (
        cd "${repo_root}"
        find "${dir}" -type f | sort
      )
    fi
  done | awk '!seen[$0]++'
}

aiaast_path_category() {
  local rel="$1"

  case "${rel}" in
    "AGENTS.md"|"CLAUDE.md"|"GEMINI.md"|"CODEX.md"|"WINDSURF.md"|".cursorrules"|".windsurfrules"|".github/copilot-instructions.md")
      printf '%s\n' "entrypoint"
      ;;
    "README.md"|"AI_SYSTEM_README.md"|"AIAST_VERSION.md"|"AIAST_CHANGELOG.md")
      printf '%s\n' "system-metadata"
      ;;
    "TODO.md"|"FIXME.md"|"WHERE_LEFT_OFF.md"|"CHANGELOG.md"|"PLAN.md"|"ROADMAP.md"|"DESIGN_NOTES.md"|"ARCHITECTURE_NOTES.md"|"RESEARCH_NOTES.md"|"TEST_STRATEGY.md"|"RISK_REGISTER.md"|"RELEASE_NOTES.md")
      printf '%s\n' "working-state"
      ;;
    bootstrap/*)
      printf '%s\n' "bootstrap"
      ;;
    _system/context/*)
      printf '%s\n' "system-context"
      ;;
    _system/review-playbooks/*)
      printf '%s\n' "review-playbook"
      ;;
    _system/prompt-packs/*|_system/prompt-templates/*)
      printf '%s\n' "prompting"
      ;;
    _system/starter-blueprints/*)
      printf '%s\n' "starter-blueprint"
      ;;
    _system/mcp/*)
      printf '%s\n' "mcp"
      ;;
    _system/ci/*)
      printf '%s\n' "ci"
      ;;
    _system/packaging/*)
      printf '%s\n' "packaging"
      ;;
    _system/plugins/*)
      printf '%s\n' "plugin"
      ;;
    _system/systemd/*)
      printf '%s\n' "systemd"
      ;;
    _system/*)
      printf '%s\n' "system-core"
      ;;
    .cursor/agents/*)
      printf '%s\n' "cursor-agent"
      ;;
    .cursor/commands/*)
      printf '%s\n' "cursor-command"
      ;;
    .cursor/rules/*)
      printf '%s\n' "cursor-rule"
      ;;
    .cursor/skills/*)
      printf '%s\n' "cursor-skill"
      ;;
    .cursor/*)
      printf '%s\n' "cursor-overlay"
      ;;
    .github/*)
      printf '%s\n' "copilot-overlay"
      ;;
    *)
      printf '%s\n' "unclassified"
      ;;
  esac
}
