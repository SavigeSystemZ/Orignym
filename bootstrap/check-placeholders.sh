#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: check-placeholders.sh [target-repo] [--all] [--summary]
EOF
}

TARGET="."
SCAN_ALL=0
SUMMARY_ONLY=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --all)
      SCAN_ALL=1
      shift
      ;;
    --summary)
      SUMMARY_ONLY=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      TARGET="$1"
      shift
      ;;
  esac
done

placeholder_pattern='^- [A-Za-z0-9 /_-]+:\s*$'
absolute_path_pattern='/ABSOLUTE/PATH/TO/PROJECT'
hits=0
placeholder_count=0
absolute_path_count=0

critical_files=(
  "_system/PROJECT_PROFILE.md"
  "TODO.md"
  "FIXME.md"
  "WHERE_LEFT_OFF.md"
  "PLAN.md"
  "ROADMAP.md"
  "TEST_STRATEGY.md"
  "RISK_REGISTER.md"
  "RELEASE_NOTES.md"
  "_system/context/CURRENT_STATUS.md"
  "_system/context/DECISIONS.md"
  "_system/context/ASSUMPTIONS.md"
  "_system/context/OPEN_QUESTIONS.md"
  "_system/mcp/MCP_SERVER_CATALOG.md"
)

optional_files=(
  "DESIGN_NOTES.md"
  "ARCHITECTURE_NOTES.md"
  "RESEARCH_NOTES.md"
  "_system/context/INTEGRATION_SURFACES.md"
  "_system/context/QUALITY_DEBT.md"
)

scan_list=("${critical_files[@]}")
if [[ ${SCAN_ALL} -eq 1 ]]; then
  scan_list+=("${optional_files[@]}")
fi

for rel in "${scan_list[@]}"; do
  path="${TARGET}/${rel}"
  if [[ -f "${path}" ]]; then
    if matches="$(rg -n --with-filename "${placeholder_pattern}" "${path}" || true)" && [[ -n "${matches}" ]]; then
      count="$(printf '%s\n' "${matches}" | wc -l | tr -d ' ')"
      placeholder_count=$((placeholder_count + count))
      hits=1
      if [[ ${SUMMARY_ONLY} -eq 0 ]]; then
        printf '%s\n' "${matches}"
      fi
    fi
    if matches="$(rg -n --with-filename "${absolute_path_pattern}" "${path}" || true)" && [[ -n "${matches}" ]]; then
      count="$(printf '%s\n' "${matches}" | wc -l | tr -d ' ')"
      absolute_path_count=$((absolute_path_count + count))
      hits=1
      if [[ ${SUMMARY_ONLY} -eq 0 ]]; then
        printf '%s\n' "${matches}"
      fi
    fi
  fi
done

if [[ ${hits} -eq 1 ]]; then
  if [[ ${SUMMARY_ONLY} -eq 1 ]]; then
    echo "placeholder_hits_detected placeholders=${placeholder_count} absolute_paths=${absolute_path_count}" >&2
  else
    echo "placeholder_hits_detected" >&2
  fi
  exit 1
fi

echo "no_placeholder_hits"
