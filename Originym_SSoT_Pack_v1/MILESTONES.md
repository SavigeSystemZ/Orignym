# MILESTONES.md — Originym

## M0 — Foundation / Canonical Layer
**Objective**
Create canonical docs, repo instruction layer, baseline scaffold, and validation/testing conventions.

**Inputs**
- PRD.md
- ARCHITECTURE.md
- DATA_MODEL.md
- NFR.md
- RUNBOOK.md

**Tasks**
- create repo docs and instruction files
- set project structure
- choose auth and DB tooling
- create CI/lint/typecheck/test skeleton

**Deliverables**
- docs
- instruction files
- initial app scaffold
- baseline CI

**Validation**
- docs reviewed
- project boots
- lint/typecheck/test/build commands wired

**Rollback**
- revert scaffold commits
- no destructive data changes

## M1 — Data Model + Auth + Draft CRUD
**Objective**
Implement users, drafts, auth, and dashboard shell.

**Validation**
- sign in/out works
- create/edit/delete draft works
- authz enforced

## M2 — Validation Pipeline V1
**Objective**
Implement normalization, exact/near checks, run records, evidence items, and verdict schema.

**Validation**
- validation run persisted
- result screen displays findings and limitations
- failure states handled

## M3 — Suggestion Engine V1
**Objective**
Generate alternate coined terms when conflict risk justifies it.

**Validation**
- suggestions generated and ranked
- obvious near-collisions filtered

## M4 — Publish + Public Registry
**Objective**
Publish records publicly and support search.

**Validation**
- publish flow works
- public page renders correctly
- search returns expected records

## M5 — Reports + Moderation
**Objective**
Implement dispute/report flow and admin queue.

**Validation**
- report submission works
- moderator actions change public state
- audit events recorded

## M6 — Exports + Evidence Packets
**Objective**
Generate provenance/evidence exports.

**Validation**
- export files generate and download
- exported content excludes private/internal-only data

## M7 — Hardening + Launch Readiness
**Objective**
Security, observability, accessibility, reliability, and polish.

**Validation**
- rate limits and logs present
- core E2E path passes
- trust language review complete
