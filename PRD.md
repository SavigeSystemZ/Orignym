# Orignym - Product Requirements Document (PRD)

## 1. Product Truth & Category
**Product Name:** Orignym  
**Product Category:** Public coined-word provenance, validation, suggestion, publication, and registry platform.

**Product Truth:** Orignym is a platform where users can record, claim, timestamp, and publish evidence-backed coined words. It provides low-conflict findings and prior-use signals. It runs verification and publishes a claim page.

**Boundary/Guardrails:** Orignym must *never* claim it grants legal ownership of a word, guarantees originality, provides trademark clearance, or grants exclusive rights. It does not certify a word as globally unique.

## 2. Core User Workflows
Users can:
- Invent or propose a coined word.
- Run an evidence-backed novelty/conflict scan.
- Receive alternate coined-word suggestions if conflicts are found.
- Record and publish a timestamped public claim.
- Search a public repository of coined terms and related evidence.
- Export provenance and evidence records.
- Challenge or dispute a published entry.

## 3. Scope & MVP Priorities
Orignym will be rolled out in milestones:
- **M1 - Foundation:** App scaffold, auth, database schema, dashboard shell, and coined-word claim draft CRUD.
- **M2 - Verification Engine v1:** Staged evidence-first verification pipeline (normalization, exact/near/phonetic/semantic checks) yielding structured outputs and limitations notes.
- **M3 - Suggestion Engine v1:** Context-aware alternate term generation to avoid collisions.
- **M4 - Public Registry:** Publish flow, public claim page, and registry search.
- **M5 - Moderation & Disputes:** Admin queues, freeze/unpublish actions, and user reporting.
- **M6 - Exports & Hardening:** Provenance/evidence exports, observability, and rate-limiting.

## 4. Acceptance Criteria
- All public-facing language strictly adheres to the product truth (no legal ownership claims).
- Verification outputs include explicit "limitations notes" and structured verdict tiers.
- A functional, provider-neutral architecture allows swapping AI models without changing business logic.
- Full auditability for AI runs and moderation actions.

*See `ARCHITECTURE.md` for technical design, `TRUST_AND_CLAIMS_POLICY.md` for legal guardrails.*