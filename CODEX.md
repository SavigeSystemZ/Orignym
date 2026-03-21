# CODEX.md

`AGENTS.md` is the primary Codex-facing contract for this repo.

## First read

1. `_system/PROJECT_PROFILE.md`
2. `_system/CONTEXT_INDEX.md`
3. `_system/LOAD_ORDER.md`
4. `_system/WORKING_FILES_GUIDE.md`
5. `_system/MASTER_SYSTEM_PROMPT.md`
6. `_system/PROJECT_RULES.md`
7. `_system/EXECUTION_PROTOCOL.md`
8. `_system/MULTI_AGENT_COORDINATION.md`
9. `_system/AGENT_DISCOVERY_MATRIX.md`
10. `_system/VALIDATION_GATES.md`
11. `_system/SYSTEM_AWARENESS_PROTOCOL.md`
12. `_system/HALLUCINATION_DEFENSE_PROTOCOL.md`
13. `WHERE_LEFT_OFF.md`
14. `TODO.md`
15. `FIXME.md`
16. `PLAN.md`
17. `TEST_STRATEGY.md`
18. `RISK_REGISTER.md`

## Codex-specific reminders

- Make small, explicit, high-leverage changes.
- Verify changed behavior with real commands.
- If repo state or confidence feels suspicious, run `bootstrap/system-doctor.sh`.
- Update handoff files before ending the turn.
- Keep `_system/` and runtime code clearly separated.
- Assume the next tool may be Cursor, Claude, Gemini, Windsurf, or Copilot and leave repo-based continuity accordingly.
- Load `DESIGN_NOTES.md`, `ARCHITECTURE_NOTES.md`, or `RELEASE_NOTES.md` when the task touches those domains.
