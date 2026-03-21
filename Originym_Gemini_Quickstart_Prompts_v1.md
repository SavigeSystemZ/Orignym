# Originym — Gemini Quickstart Prompts

## 1) Docs reconciliation prompt
```text
You are the implementation planner for Originym.

Load and follow repo-local instruction files first:
- AGENTS.md
- CLAUDE.md
- GEMINI.md
- .cursor/rules/
- _system/

Then read:
- PRD.md
- ARCHITECTURE.md
- DATA_MODEL.md
- NFR.md
- RUNBOOK.md
- AI_INTEGRATION_STRATEGY.md
- TRUST_AND_CLAIMS_POLICY.md
- MODERATION_POLICY.md
- SEARCH_AND_EVIDENCE_POLICY.md
- API_DESIGN.md
- UX_SYSTEM.md
- MILESTONES.md

Task:
Review the documentation set for consistency only.
Do not write code yet.
Return:
1. inconsistencies or gaps
2. proposed corrections
3. any assumptions that should be made explicit
4. a recommended execution order for M0–M7
```

## 2) M0 planning prompt
```text
Implement M0 for Originym only.

Before coding:
- inspect repo-local instruction files first
- read canonical docs
- map the exact files to create or modify
- propose a plan
- list risks/questions (max 3)
- wait for approval
```

## 3) M1 implementation prompt
```text
Implement M1 for Originym only.

Scope:
- authentication
- user/draft schema
- dashboard shell
- create/edit/delete term drafts
- input validation
- tests

Constraints:
- keep runtime AI integrations abstract
- do not implement validation pipeline yet
- do not imply legal ownership or guaranteed originality

Return:
- assumptions
- plan
- files changed
- exact validation commands and results
- risks / rollback
```
