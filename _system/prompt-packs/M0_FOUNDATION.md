# M0 Foundation Prompt Pack

Use these prompts one at a time. Each prompt assumes the agent must read the canonical docs first.

## M0.0 Planning

```
Read AGENTS.md, _system/PROJECT_PROFILE.md, _system/MASTER_SYSTEM_PROMPT.md, and _system/PROJECT_RULES.md.

Plan the foundation work for this repo.

Deliver:
1. Proposed file tree
2. Tooling and validation plan
3. Risks and assumptions
4. Exact files to create or edit

Constraints:
- minimal diffs
- no secrets
- keep runtime code separate from _system/
```

## M0.1 Implementation

```
Implement only the agreed foundation scope.

Deliver:
1. Files changed
2. Full file contents or exact patches
3. Commands to run validation

Constraints:
- no optional features
- production-grade scaffolding only
- update handoff files before stopping
```

## M0.2 Validation

```
Run the relevant validation commands from _system/PROJECT_PROFILE.md.

Deliver:
1. Commands run
2. Pass/fail results
3. Any remaining gaps
```
