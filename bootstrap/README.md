# Bootstrap

Use this directory to install, upgrade, verify, repair, and remove AIAST in a target repo.

## Scripts

- `init-project.sh` — copy and initialize the system into a target repo
- `install-missing-files.sh` — add newly introduced template files into an existing installed repo without overwriting existing repo state
- `update-template.sh` — compare an installed repo with a newer template source and apply additive updates; optionally refresh template-managed drift
- `repair-system.sh` — restore missing or drifted template-managed files while preserving app-owned state
- `uninstall-system.sh` — remove the operating layer cleanly while leaving runtime app code intact
- `configure-project-profile.sh` — stamp initial profile values
- `suggest-project-profile.sh` — inspect the target repo and infer safe baseline values for structure, languages, packaging, components, and validation commands
- `seed-working-state.sh` — prefill the first plan, status, and handoff surfaces for a newly installed repo
- `validate-system.sh` — verify required files, config syntax, and portability
- `verify-integrity.sh` — generate or verify hashes for template-managed files only
- `detect-drift.sh` — report missing files, template drift, integrity failures, version skew, and stale context
- `generate-system-registry.sh` — rebuild the machine-readable registry of AIAST-managed files
- `check-system-awareness.sh` — verify registry coverage and path references in core docs
- `check-hallucination.sh` — detect claim-evidence mismatches and suspicious confidence drift
- `system-doctor.sh` — run the full awareness, integrity, drift, and hallucination check suite
- `heal-system.sh` — run the doctor in auto-heal mode using safe repair and registry refresh
- `scan-security.sh` — run applicable dependency and container scanners and persist a machine-readable report
- `generate-systemd-unit.sh` — create hardened service and timer unit files
- `print-agent-map.sh` — print the agent discovery matrix
- `check-placeholders.sh` — find unresolved actionable blanks in repo-owned operating files
- `check-runtime-foundations.sh` — validate generated packaging, install, mobile, env, and AI runtime scaffolds
- `generate-runtime-foundations.sh` — generate project-owned packaging, install, mobile, logging, and AI scaffolds in a cloned repo

## Recommended flow

1. `init-project.sh <target-repo> --app-name <name> --strict`
2. Review the generated runtime scaffolds under the project root packaging, ops, mobile, and ai directories
3. Review the inferred `_system/PROJECT_PROFILE.md` values and correct the fields the auto-pass could not know
4. Fill in the repo-facing working files that matter first: `PLAN.md`, `TODO.md`, `TEST_STRATEGY.md`, and `WHERE_LEFT_OFF.md`
5. Re-run `validate-system.sh <target-repo> --strict`
6. Use `check-placeholders.sh <target-repo>` for onboarding blanks and `detect-drift.sh <target-repo> --source <template-root>` for lifecycle drift checks
7. Use `system-doctor.sh <target-repo> --source <template-root>` when the operating picture feels inconsistent, runtime scaffolds may be drifted, or an agent may be building on stale assumptions
8. Use `update-template.sh <target-repo> --source <template-root> --dry-run` when a newer AIAST release is available
9. Use `repair-system.sh <target-repo> --source <template-root> --dry-run` or `heal-system.sh <target-repo> --source <template-root>` when integrity, awareness, or drift checks fail

## Existing installed repos

Installed repos carry:

- `_system/.template-version` — installed AIAST version marker
- `_system/.template-install.json` — install source, timestamps, mode, and README placement

If the target repo already has a `README.md`, the template overview is installed as `AI_SYSTEM_README.md` instead of overwriting the app README, and that placement is tracked in install metadata.
