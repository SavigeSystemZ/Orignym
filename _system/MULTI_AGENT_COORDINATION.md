# Multi-Agent Coordination

This repo is designed to survive tool changes, interrupted sessions, and handoff between multiple agents and humans.

## Supported tools

- Codex
- Cursor
- Claude
- Gemini
- Windsurf
- Copilot
- Other compatible agents

## Required operating model

1. Single active writer at a time.
2. Shared governance lives in repo files, not tool-local memory.
3. Handoff files are mandatory:
   - `TODO.md`
   - `FIXME.md`
   - `WHERE_LEFT_OFF.md`
4. Supporting working files should be updated when the task touches their domain:
   - `PLAN.md`
   - `DESIGN_NOTES.md`
   - `ARCHITECTURE_NOTES.md`
   - `RESEARCH_NOTES.md`
   - `TEST_STRATEGY.md`
   - `RISK_REGISTER.md`
   - `RELEASE_NOTES.md`
5. Tool-specific helpers may extend behavior but must not contradict `AGENTS.md` or `_system/`.

## Start-of-turn checklist

- Load the canonical docs.
- Read `WHERE_LEFT_OFF.md`.
- Read `TODO.md` and `FIXME.md`.
- Read additional working files that match the task domain.
- Review current repo state before editing.
- Confirm whether another tool's unfinished work is present.

## End-of-turn checklist

- Update handoff files.
- Record validation results.
- Note blockers and risk honestly.
- Leave the next best step explicit.
- Run checkpoint flow if the work crossed a milestone or risky boundary.

## Takeover protocol

When taking over work started by another tool:

1. Read the handoff packet and current working files.
2. Verify the repo state matches the claimed state before building on it.
3. If the previous work looks incomplete or risky, stabilize and document before broadening scope.
4. If you must redirect the approach, explain why in the relevant working files.

## Handoff packet format

Each meaningful handoff should include:

- objective worked on
- completion status
- exact files changed
- commands run and pass/fail result
- blockers and risks
- next best step

## Conflict policy

- Do not overwrite unresolved work from another agent without documenting why.
- Prefer additive follow-up patches over silent rewrites.
- If overlapping work is unavoidable, reduce the scope and stabilize the handoff first.
- If a previous agent updated design or architecture direction, load those files before changing course.

## Recommended specialization

- Cursor / Windsurf: file-aware implementation and refactoring
- Codex: precise patching, review, and repair
- Claude / Gemini: architecture, alternatives, threat modeling, prompt/system quality
- Copilot: inline assistance under the same repo rules

These are suggestions, not ownership boundaries.
