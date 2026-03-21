# Copilot Instructions

Before coding, read `AGENTS.md` and the documents listed in its load order.

## Core expectations

- `_system/` is the agent operating layer. Runtime code must not depend on it.
- Multiple agents may work on this repo over time. Leave clean handoff notes in `TODO.md`, `FIXME.md`, and `WHERE_LEFT_OFF.md`.
- Use `PLAN.md`, `TEST_STRATEGY.md`, `DESIGN_NOTES.md`, and `ARCHITECTURE_NOTES.md` when the task touches execution, validation, design, or structure.
- Run the validation commands defined in `_system/PROJECT_PROFILE.md` and `_system/VALIDATION_GATES.md`.
- If repo state or docs appear inconsistent, run `bootstrap/system-doctor.sh`.
- Use MCP servers only within the least-privilege scope defined in `_system/MCP_CONFIG.md`.
- If context is stale, reload the canonical docs before continuing.
- Be aware that other tool-specific entry files exist and may be used before or after your turn.
