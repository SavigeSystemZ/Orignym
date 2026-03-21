# PROMPT_PACK_M0_M7.md — Originym

## Universal Precedence Note
Load and follow repo-local instruction files first. Use host-side/extra prompt text only for orchestration, milestone control, formatting, and non-conflicting quality guidance.

---

## M0.0 — Planning
```text
You are working on Originym.

Before coding:
1. Inspect repo-local instruction files first: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursor/rules/`, `_system/`.
2. Read the canonical docs: `PRD.md`, `ARCHITECTURE.md`, `DATA_MODEL.md`, `NFR.md`, `RUNBOOK.md`.
3. Map the exact files you would create or modify for M0 only.
4. Propose a tight plan and list risks/questions (max 3).
5. WAIT for approval before implementing.

Output:
- Assumptions
- Plan
- Files
- Questions
- Risks
```

## M0.1 — Implementation
```text
Implement M0 for Originym only.

Scope:
- repo scaffold
- canonical docs alignment
- instruction layer alignment
- lint/typecheck/test/build wiring
- baseline app shell and CI skeleton

Constraints:
- minimal diffs
- do not implement product workflows yet
- keep AI provider layer abstract

After changes:
- run validation commands from RUNBOOK.md
- report file-by-file changes
- report exact command results
```

## M1.1 — Data Model + Auth + Draft CRUD
```text
Implement M1 for Originym only.

Read first:
- PRD.md
- ARCHITECTURE.md
- DATA_MODEL.md
- NFR.md
- RUNBOOK.md

Deliver:
- auth and protected dashboard shell
- DB schema for users and term drafts
- create/edit/delete draft flow
- basic validation on draft inputs
- tests for authz and CRUD

Output:
1. assumptions
2. plan
3. files changed
4. validation results
5. risks / follow-ups
```

## M2.1 — Validation Pipeline
```text
Implement M2 only.

Required behavior:
- create validation run records
- normalize term
- run exact/near checks
- persist evidence items
- produce typed verdict object
- show limitations note
- handle failures honestly

Do not:
- claim guaranteed originality
- overbuild deep search infrastructure yet

Add tests for:
- successful run
- malformed draft data
- provider failure / partial evidence case
```

## M3.1 — Suggestion Engine
```text
Implement M3 only.

Requirements:
- generate alternate coined terms when conflict risk is high or ambiguity is substantial
- rank suggestions
- filter obvious collisions
- store provider/model/prompt metadata
- expose results in validation UI

Keep provider-neutral interfaces.
```

## M4.1 — Publish + Registry
```text
Implement M4 only.

Requirements:
- publish action
- public slug generation
- public page rendering
- registry search
- safe trust language on public pages
- hidden/frozen entries not publicly searchable
```

## M5.1 — Reports + Moderation
```text
Implement M5 only.

Requirements:
- report/dispute form
- moderation queue
- freeze/hide/remove/restore actions
- audit events
- authorization for moderators/admins
```

## M6.1 — Exports
```text
Implement M6 only.

Requirements:
- provenance summary export
- evidence packet export
- versioned export metadata
- exclude private/internal fields from public exports
```

## M7.1 — Hardening Review
```text
Review and improve Originym for launch readiness.

Check:
- authz gaps
- rate limits
- trust language
- logging/metrics
- performance bottlenecks
- accessibility issues
- missing tests/docs

Return:
- issues by severity
- exact files affected
- proposed minimal fixes
- validation plan
```
