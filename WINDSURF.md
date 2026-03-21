# WINDSURF.md

Load `AGENTS.md` first, then:

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

## Rules

- Respect the single-writer model.
- Keep agent governance in `_system/` and runtime code elsewhere.
- Run the project validation gates before handoff.
- If the operating picture looks inconsistent, run `bootstrap/system-doctor.sh`.
- Record exact files changed, commands run, and blockers for the next tool.
- Be aware that other agent adapters exist and share the same core contract.
- Load the domain-specific working files when design, architecture, release, or research work is in scope.
