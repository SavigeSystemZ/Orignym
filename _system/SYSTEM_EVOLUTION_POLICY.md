# System Evolution Policy

This operating system should evolve without collapsing into duplication or drift.

## Adding new tools

- add the adapter file
- update `AGENT_DISCOVERY_MATRIX.md`
- update `CONTEXT_INDEX.md` if load order changes
- ensure the adapter does not contradict `AGENTS.md`

## Adding new subsystems

- prefer one authoritative doc per subsystem
- link it from `CONTEXT_INDEX.md`
- add it to `LOAD_ORDER.md` only if it is routinely required

## Deprecating files

- mark the replacement in the deprecated file
- update indexes and adapters
- remove the old file only after the replacement is fully live

## Versioning the operating system

- update `CHANGELOG.md`
- update `_TEMPLATE_FACTORY/BUILD_REPORT.md` in the master repo when the canonical template meaningfully changes
- keep `_TEMPLATE_FACTORY/SOURCE_LIBRARY/` as the provenance base for future merge work
- use `bootstrap/install-missing-files.sh` to seed newly added files into existing installed repos without overwriting repo-owned state
