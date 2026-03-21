# Originym — Canonical SSoT Pack

This bundle contains the canonical source-of-truth documents, repo-local instruction layer, and initial multi-agent prompt pack for **Originym**.

## What Originym is
Originym is a public coined-word recording, generation, validation, publication, and provenance platform.

It helps users:
- create candidate coined terms;
- validate them against evidence sources;
- publish timestamped public claim pages;
- generate alternatives when conflict risk is high;
- export provenance and evidence packets;
- search a public registry of submitted coined terms.

## What Originym is not
Originym is **not** a legal authority, a trademark office, or a guarantee of ownership/originality.
It is an evidence-backed provenance and publication platform.

## Canonical docs
- `PRD.md`
- `ARCHITECTURE.md`
- `DATA_MODEL.md`
- `NFR.md`
- `RUNBOOK.md`

## Extended docs
- `AI_INTEGRATION_STRATEGY.md`
- `TRUST_AND_CLAIMS_POLICY.md`
- `MODERATION_POLICY.md`
- `SEARCH_AND_EVIDENCE_POLICY.md`
- `API_DESIGN.md`
- `UX_SYSTEM.md`
- `MILESTONES.md`
- `PROMPT_PACK_M0_M7.md`

## Repo-local instruction layer
- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`
- `.cursor/rules/*.mdc`
- `_system/precedence.manifest.json`
- `_system/repo-operating-profile.md`

## Recommended first sequence
1. Review the canonical docs.
2. Let your coding agent generate or reconcile repo-local instruction files if needed.
3. Execute M0 first, then proceed milestone by milestone.
4. Run the review prompt after each milestone.
