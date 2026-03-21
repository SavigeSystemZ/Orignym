# Test Strategy

Use this file to define the confidence model for the repo.

## Confidence targets

- minimum confidence for small fixes:
- minimum confidence for feature work:
- minimum confidence for architecture changes:
- minimum confidence for release claims:

## Validation layers

- formatting and linting:
- type and schema validation:
- unit coverage:
- integration coverage:
- end-to-end or smoke coverage:
- build and packaging checks:
- install or launch verification:

## High-risk areas

- flows that must never silently regress:
- data or state transitions that need proof:
- UI states that need smoke coverage:
- install or environment paths that need verification:

## Gaps

- missing tests:
- flaky tests:
- manual-only coverage:

## Rules

- Keep this aligned with `_system/VALIDATION_GATES.md`.
- Record repo-specific commands in `_system/PROJECT_PROFILE.md`.
- If a touched surface lacks enough coverage, record the gap honestly in `FIXME.md` or `QUALITY_DEBT.md`.
