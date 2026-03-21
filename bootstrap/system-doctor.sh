#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_TARGET="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
DEFAULT_SOURCE="${DEFAULT_TARGET}"

usage() {
  cat <<'EOF'
Usage: system-doctor.sh [target-repo] [--source <template-root>] [--strict] [--heal]

Run structural, integrity, awareness, runtime-foundation, placeholder, and hallucination-risk checks. In heal mode, attempt safe automatic recovery first.
EOF
}

TARGET_REPO=""
SOURCE="${DEFAULT_SOURCE}"
STRICT=0
HEAL=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --source)
      SOURCE="${2:-}"
      shift 2
      ;;
    --strict)
      STRICT=1
      shift
      ;;
    --heal)
      HEAL=1
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
  TARGET_REPO="${DEFAULT_TARGET}"
fi

if [[ ! -d "${TARGET_REPO}" ]]; then
  echo "Target repo does not exist: ${TARGET_REPO}" >&2
  exit 1
fi

run_check() {
  local label="$1"
  shift
  local output
  if output="$("$@" 2>&1)"; then
    printf '[pass] %s\n' "${label}"
    [[ -n "${output}" ]] && printf '%s\n' "${output}"
    return 0
  fi
  printf '[fail] %s\n' "${label}"
  [[ -n "${output}" ]] && printf '%s\n' "${output}"
  return 1
}

if [[ ${HEAL} -eq 1 ]]; then
  echo "Heal mode: attempting safe repair and awareness refresh before diagnosis..."
  bash "${SCRIPT_DIR}/repair-system.sh" "${TARGET_REPO}" --source "${SOURCE}"
  bash "${SCRIPT_DIR}/generate-system-registry.sh" "${TARGET_REPO}" --write
fi

strict_flag=()
[[ ${STRICT} -eq 1 ]] && strict_flag+=(--strict)

failed=0
warned=0
warning_labels=()

run_check "validate-system" bash "${SCRIPT_DIR}/validate-system.sh" "${TARGET_REPO}" "${strict_flag[@]}" || failed=1
run_check "verify-integrity" bash "${SCRIPT_DIR}/verify-integrity.sh" --check --target "${TARGET_REPO}" || failed=1
run_check "check-system-awareness" bash "${SCRIPT_DIR}/check-system-awareness.sh" "${TARGET_REPO}" || failed=1

if run_check "check-placeholders" bash "${SCRIPT_DIR}/check-placeholders.sh" "${TARGET_REPO}" --summary; then
  true
else
  warned=1
  warning_labels+=("placeholders")
fi

if run_check "check-runtime-foundations" bash "${SCRIPT_DIR}/check-runtime-foundations.sh" "${TARGET_REPO}" "${strict_flag[@]}"; then
  true
else
  if [[ ${STRICT} -eq 1 ]]; then
    failed=1
  else
    warned=1
    warning_labels+=("runtime-foundations")
  fi
fi

if run_check "check-hallucination" bash "${SCRIPT_DIR}/check-hallucination.sh" "${TARGET_REPO}"; then
  true
else
  warned=1
  warning_labels+=("hallucination-risk")
fi

drift_output="$(bash "${SCRIPT_DIR}/detect-drift.sh" "${TARGET_REPO}" --source "${SOURCE}" 2>&1 || true)"
echo "[info] detect-drift"
printf '%s\n' "${drift_output}"
if [[ "${drift_output}" != *"drift_ok"* ]]; then
  warned=1
  warning_labels+=("drift")
fi

if [[ ${failed} -eq 1 ]]; then
  echo "system_doctor_failed"
  exit 1
fi

if [[ ${warned} -eq 1 ]]; then
  if [[ ${#warning_labels[@]} -gt 0 ]]; then
    printf 'system_doctor_warnings=%s\n' "$(IFS=,; echo "${warning_labels[*]}")"
  fi
  echo "system_doctor_warn"
  exit 2
fi

echo "system_doctor_ok"
