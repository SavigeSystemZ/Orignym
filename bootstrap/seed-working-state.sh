#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: seed-working-state.sh <target-repo> [--app-name NAME]
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

PROFILE="${TARGET_REPO}/_system/PROJECT_PROFILE.md"

if [[ ! -f "${PROFILE}" ]]; then
  echo "Missing project profile: ${PROFILE}" >&2
  exit 1
fi

if [[ -z "${APP_NAME}" ]]; then
  APP_NAME="$(python3 - <<'PY' "${PROFILE}"
from pathlib import Path
import re
import sys

text = Path(sys.argv[1]).read_text()
match = re.search(r"^- App name:\s*(.+)$", text, re.MULTILINE)
print(match.group(1).strip() if match else "")
PY
)"
fi

if [[ -z "${APP_NAME}" ]]; then
  APP_NAME="$(basename -- "${TARGET_REPO}")"
fi

python3 - <<'PY' "${TARGET_REPO}" "${APP_NAME}"
from pathlib import Path
from datetime import datetime, timezone
import sys

root = Path(sys.argv[1])
app_name = sys.argv[2]
timestamp = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")

updates = {
    root / "TODO.md": {
        "- [ ] Define the single highest-value active milestone or bugfix here": f"- [ ] Establish the first validated baseline for {app_name}",
        "- [ ] Item:\n  Reason:\n  Done when:\n  Validation:": (
            f"- [ ] Finish onboarding and confirm the first working validation path for {app_name}\n"
            "  Reason: The repo-local agent system is installed but still needs repo-specific truth.\n"
            "  Done when: Validation commands, runtime boundaries, and the first milestone are explicit.\n"
            "  Validation: Run the narrowest real build, test, or smoke command that proves the app works."
        ),
        "- [ ] Record the next slice of work that should follow once the immediate queue clears": (
            "- [ ] Begin the first product or platform milestone once onboarding is complete"
        ),
    },
    root / "PLAN.md": {
        "- Current target outcome:": f"- Current target outcome: Establish a clean, validated baseline for {app_name}",
        "- Why it matters now:": "- Why it matters now: The repo needs a truthful operating picture before deeper feature work begins.",
        "- Deadline or forcing function:": "- Deadline or forcing function: Complete onboarding before the first substantial implementation pass.",
        "- User or operator outcome:": "- User or operator outcome: A new agent can enter the repo and immediately see how to build, validate, and continue safely.",
        "- Technical outcome:": "- Technical outcome: Runtime boundaries, validation commands, and current repo structure are documented and verified.",
        "- Design or product-quality outcome:": "- Design or product-quality outcome: The first visible surface should already reflect intentional design and best-practice structure.",
        "- In scope:": "- In scope: profile completion, validation mapping, first smoke check, and working-state initialization.",
        "- Out of scope:": "- Out of scope: broad product expansion before the baseline is proven.",
        "- Dependencies:": "- Dependencies: repo inspection, available toolchain, and at least one real validation command.",
        "- Known unknowns:": "- Known unknowns: framework-specific gaps, deployment assumptions, and missing environment details.",
        "- Commands to run:": "- Commands to run: start with the smallest real build, test, or smoke command for the repo.",
        "- Evidence to capture:": "- Evidence to capture: the first passing validation result and any unresolved onboarding gaps.",
        "- Stop conditions:": "- Stop conditions: missing runtime path understanding, failing baseline validation, or hidden environment blockers.",
        "- Release-blocking checks:": "- Release-blocking checks: baseline validation must be explicit before any release claim exists.",
        "- Risks that could invalidate the plan:": "- Risks that could invalidate the plan: incorrect framework assumptions, hidden dependencies, or stale repo docs.",
        "- Fallback path if the plan fails:": "- Fallback path if the plan fails: reduce scope, document the blocker, and stabilize the repo state before proceeding.",
        "- What has to be true for this plan to be considered complete:": "- What has to be true for this plan to be considered complete: the repo profile is meaningfully filled, the first validation path is proven, and the next milestone is explicit.",
    },
    root / "WHERE_LEFT_OFF.md": {
        "- Current phase:": "- Current phase: Onboarding",
        "- Working branch or lane:": "- Working branch or lane: main or current default branch",
        "- Completion status:": "- Completion status: System installed, repo-specific truth still being established",
        "- Resume confidence:": "- Resume confidence: Medium",
        "- If this is the first session, record the setup action and the first real milestone once known.": (
            f"- Installed the local AI operating system for {app_name} and seeded the first working surfaces."
        ),
        "- Fill in `_system/PROJECT_PROFILE.md`, then establish the first real milestone in `TODO.md`.": (
            "- Finish the remaining repo-specific profile fields, confirm validation commands, and begin the first milestone."
        ),
    },
    root / "_system/context/CURRENT_STATUS.md": {
        "- Active branch or lane:": "- Active branch or lane: main or current default branch",
        "- Current milestone:": "- Current milestone: Baseline onboarding",
        "- Current primary objective:": f"- Current primary objective: Turn {app_name} into a fully understood, validated repo before larger changes land.",
        "- Current plan file or phase:": "- Current plan file or phase: PLAN.md - onboarding baseline",
        "- Current release target:": "- Current release target: internal baseline",
        "- Latest known passing validation:": "- Latest known passing validation: not yet established",
        "- Latest known failing validation:": "- Latest known failing validation: none recorded yet",
        "- Current confidence level:": "- Current confidence level: Partial until repo-specific validation is confirmed",
        "- Last updated:": f"- Last updated: {timestamp}",
        "- Updated by:": "- Updated by: bootstrap/seed-working-state.sh",
    },
    root / "RELEASE_NOTES.md": {
        "- Target label:": "- Target label: baseline-onboarding",
        "- Intended audience:": "- Intended audience: internal engineering and agent operators",
        "- Release goal:": "- Release goal: confirm the repo-local AI operating system is installed cleanly and the first validation path is understood",
        "- Release confidence:": "- Release confidence: not ready until onboarding validation is complete",
    },
}

for path, replacements in updates.items():
    text = path.read_text()
    for old, new in replacements.items():
        text = text.replace(old, new, 1)
    path.write_text(text)

where_left_off = root / "WHERE_LEFT_OFF.md"
text = where_left_off.read_text()
text = text.replace("- Timestamp:", f"- Timestamp: {timestamp}", 1)
where_left_off.write_text(text)
PY

echo "Seeded working state for ${APP_NAME}"
