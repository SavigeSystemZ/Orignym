# FILE: .cursor/rules/00-global.mdc

---
description: Global Originym project rules
alwaysApply: true
---

# Originym global rules

- Read `PRD.md`, `ARCHITECTURE.md`, `DATA_MODEL.md`, `NFR.md`, `RUNBOOK.md` before major changes.
- Keep work within the requested milestone.
- Keep diffs minimal and avoid unrelated refactors.
- Add/update tests for behavior changes.
- Report exact validation results.
- Never imply legal ownership, guaranteed originality, or trademark clearance.


---

# FILE: .cursor/rules/10-architecture.mdc

---
description: Architecture and AI integration constraints
alwaysApply: true
---

# Architecture constraints

- Use a modular monolith unless explicitly changed.
- Keep runtime AI provider integrations behind stable interfaces.
- Business logic must not be hardwired to one AI vendor SDK.
- Validation should be evidence-first and output typed verdict objects.
- Persist provider/model/prompt metadata for validation runs and suggestions.


---

# FILE: .cursor/rules/20-quality.mdc

---
description: Quality and validation rules
alwaysApply: true
---

# Quality rules

- Prefer TypeScript strictness and explicit error handling.
- Add negative tests for authz/input validation where relevant.
- Run lint, typecheck, tests, and build when practical.
- Report pass/fail honestly.
- Update docs when behavior or architecture changes.


---

# FILE: .cursor/rules/30-security.mdc

---
description: Security and trust language rules
alwaysApply: true
---

# Security and trust rules

- All privileged actions require server-side authorization.
- Rate limit auth, validation, publish, search, and report endpoints.
- Do not expose internal moderation metadata publicly.
- Do not claim legal ownership, exclusive rights, or guaranteed originality.
- Ensure limitations notes are shown wherever verdicts are shown.


---

# FILE: 00_README.md

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


---

# FILE: AGENTS.md

# AGENTS.md — Originym

## Priority
1. Repo-local instruction files
2. Canonical docs
3. Active milestone prompt

## Canonical docs
Read these before substantive work:
- PRD.md
- ARCHITECTURE.md
- DATA_MODEL.md
- NFR.md
- RUNBOOK.md
- AI_INTEGRATION_STRATEGY.md
- TRUST_AND_CLAIMS_POLICY.md

## Rules
- Plan before coding.
- Stay within the requested milestone.
- Keep diffs minimal and targeted.
- Add/update tests for behavior changes.
- Run validation commands and report exact results.
- Do not imply legal ownership or guaranteed originality.
- Keep runtime AI integrations provider-neutral.
- Persist metadata for AI-driven validation runs.

## Required output
1. Assumptions
2. Plan
3. Files touched
4. What changed
5. Validation results
6. Risks / rollback


---

# FILE: AI_INTEGRATION_STRATEGY.md

# AI_INTEGRATION_STRATEGY.md — Originym

## 1. Purpose

Originym uses AI for:
- structured validation assistance
- semantic conflict detection
- alternate coined-term generation
- evidence summarization
- search/query assistance

AI must augment deterministic and evidence-backed workflows, not replace them.

## 2. Provider Strategy

Use a provider-neutral abstraction with support for:
- Google / Gemini
- OpenAI
- Anthropic
- local or alternative providers later

The app should be buildable by one agent/tool while remaining operationally portable.

## 3. Core AI Operations

### Validation assist
Input:
- normalized term package
- definition and domain
- deterministic findings
- retrieved evidence set

Output schema:
- verdict_tier
- confidence_score
- reasons[]
- top_conflicts[]
- evidence_summary[]
- limitations_note
- suggestion_needed(boolean)

### Suggestion generation
Input:
- original term
- meaning/domain/category
- excluded/conflicting terms
- style constraints

Output schema:
- suggestions[]
  - candidate_term
  - rationale
  - novelty_score
  - distinctiveness_score
  - collision_risk_score

## 4. Guardrails

- require structured JSON outputs
- validate outputs against server-side schemas
- reject unsupported verdicts
- reject absolute-ownership language
- store provider/model/prompt version metadata
- provide fallback messaging on provider failure

## 5. Prompting Principles

- concise, typed, and role-consistent prompts
- explicit forbidden claims
- evidence-first prompts
- no “guess if uncertain” behavior
- tell the provider to state limitations

## 6. Recommended Runtime Pattern

1. deterministic preprocessing
2. retrieve evidence
3. feed structured evidence into AI
4. validate structured AI output
5. persist typed result
6. derive UI narrative

## 7. Cost / Performance Strategy

- cache normalized term artifacts
- reuse evidence where safe
- rate limit expensive validation calls
- separate “quick scan” vs “deep scan” later if needed
- log cost metadata per run

## 8. Security / Privacy
- no secrets in prompts
- avoid unnecessary PII in provider payloads
- redact where possible
- store minimal raw payloads needed for debugging/audit

## 9. Build-Time vs Run-Time Roles

### Build-time use of AI coding tools
Gemini, Codex, Claude Code, Cursor, and other agents may build the repository.

### Run-time use in the product
Originym should call providers through app-side adapters only.
Do not couple repo instruction files to runtime AI provider choices.


---

# FILE: API_DESIGN.md

# API_DESIGN.md — Originym

## 1. API Style
Use typed JSON APIs with clear versioning. Internal app routes may be served from the main web app.

## 2. Core Endpoints (MVP)

### Auth / Session
- `POST /api/auth/*` (framework-managed)

### Drafts
- `GET /api/terms`
- `POST /api/terms`
- `GET /api/terms/:id`
- `PATCH /api/terms/:id`
- `DELETE /api/terms/:id`

### Validation
- `POST /api/terms/:id/validate`
- `GET /api/validation-runs/:id`

### Suggestions
- suggestions are usually embedded in validation response or fetched via:
- `GET /api/validation-runs/:id/suggestions`

### Publish
- `POST /api/terms/:id/publish`
- `POST /api/published/:id/unpublish` (admin/moderated if needed)

### Registry
- `GET /api/registry/search?q=...`
- `GET /api/registry/:slug`

### Reports
- `POST /api/registry/:id/report`
- `GET /api/admin/report-cases`
- `PATCH /api/admin/report-cases/:id`

### Exports
- `POST /api/terms/:id/export`
- `GET /api/exports/:id`

## 3. Response Shape
Use consistent envelope where useful:
- `data`
- `error`
- `meta`

## 4. Error Shape
```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Human-readable message",
    "details": {}
  }
}
```

## 5. Security
- authenticate non-public endpoints
- authorize admin/moderation endpoints
- validate payloads server-side
- rate limit expensive endpoints


---

# FILE: ARCHITECTURE.md

# ARCHITECTURE.md — Originym

## 1. Architecture Style

Use a **modular monolith** with strict module boundaries and stable interfaces.

Why:
- lower operational complexity than microservices;
- easier to reason about for a greenfield app;
- easier to evolve while preserving clean seams;
- suitable for mixed-agent implementation.

## 2. High-Level Stack

- **Frontend / App Shell:** Next.js + TypeScript + Tailwind
- **Server layer:** Next.js route handlers / server actions or a separate application service layer inside the same repo
- **Database:** PostgreSQL
- **Background jobs:** queue worker for validation/suggestion/indexing/export jobs
- **Search:** PostgreSQL full-text + trigram for MVP; optional vector/search expansion later
- **Storage:** object storage for evidence snapshots / exports
- **Auth:** Auth.js or Clerk (MVP choose one)
- **AI layer:** provider-neutral adapter with pluggable providers
- **Observability:** structured logs + metrics + tracing-ready correlation IDs

## 3. Module Map

### 3.1 `auth`
Responsibilities:
- sign-in/sign-up
- session management
- account lifecycle
- role resolution

### 3.2 `users`
Responsibilities:
- profile
- preferences
- usage stats
- notification settings

### 3.3 `terms`
Responsibilities:
- draft CRUD
- canonical term normalization
- publish/unpublish state management

### 3.4 `validation`
Responsibilities:
- orchestration of scans
- evidence gathering
- verdict composition
- run versioning
- retry/failure handling

### 3.5 `suggestions`
Responsibilities:
- alternate coined-term generation
- scoring/ranking
- exclusion of high-collision outputs

### 3.6 `registry`
Responsibilities:
- public pages
- registry search
- indexing
- canonical URLs / slugs

### 3.7 `evidence`
Responsibilities:
- evidence item storage
- source metadata
- snapshots
- provenance exports

### 3.8 `moderation`
Responsibilities:
- reports/disputes
- review queue
- freeze/remove/annotate actions
- abuse/spam handling

### 3.9 `admin`
Responsibilities:
- privileged dashboards
- moderation analytics
- policy controls
- system health views

### 3.10 `exports`
Responsibilities:
- human-readable export packets
- machine-readable JSON exports
- versioned export templates

### 3.11 `audit`
Responsibilities:
- append-only business events
- actor/action capture
- validation run metadata
- moderation history

## 4. Core Technical Principles

1. **Provider-neutral AI design**
   - no business logic should depend directly on one model SDK;
   - AI operations go through stable interfaces.

2. **Evidence-first validation**
   - verdicts must be based on typed findings;
   - narrative explanations are derived from structured evidence.

3. **Explainability over magic**
   - show what was checked and where the uncertainty is.

4. **Safe trust language**
   - UI and exports must avoid false ownership/clearance claims.

5. **Version everything important**
   - prompt versions
   - provider/model metadata
   - validation runs
   - exports
   - moderation decisions

## 5. Logical Data Flow

### Validate term
1. User submits draft for validation.
2. Draft is normalized and tokenized.
3. Validation run record is created.
4. Pipeline executes exact/near/phonetic/semantic checks.
5. Evidence items are persisted.
6. Verdict composer builds structured result.
7. Suggestion engine optionally runs.
8. Result is returned to user and stored for publication/export.

### Publish term
1. User requests publish.
2. System checks current eligibility rules.
3. Public record is created/updated.
4. Search index is updated.
5. Audit event is written.

### Report entry
1. User submits report.
2. Moderation case is created.
3. Moderator reviews.
4. Case action updates public state if needed.
5. Audit event is written.

## 6. AI Provider Abstraction

### 6.1 Required interfaces
- `ValidationProvider`
- `SuggestionProvider`
- `EmbeddingProvider` (optional in MVP)
- `SearchGroundingProvider` (optional in MVP)

### 6.2 Interface contract example
Each provider should support:
- model/provider identifier
- prompt template version
- input payload
- structured output schema
- timeout
- retry policy
- token/usage metadata
- raw response capture policy
- safety/guardrail result capture

### 6.3 Why this matters
- prevents vendor lock-in
- supports mixed-agent development
- allows A/B of providers
- enables later cost/control changes

## 7. Validation Pipeline Design

### Stage 1 — Normalization
- lowercase/case-preserving variants
- punctuation normalization
- Unicode normalization
- token decomposition
- slug/spacing variants

### Stage 2 — Exact checks
- exact term match in registry
- exact normalized match in checked source corpus

### Stage 3 — Near-match checks
- edit distance
- token similarity
- substring collisions
- pluralization/basic morphological variants

### Stage 4 — Phonetic checks
- sound-based comparison
- likely spoken confusion check

### Stage 5 — Semantic/context checks
- same/similar meaning in similar domains
- phrase similarity
- use-context overlap

### Stage 6 — Verdict composition
Output:
- verdict tier
- confidence score
- reasons
- top conflicts
- evidence summary
- limitations note
- publish recommendation
- alternative suggestions trigger flag

## 8. Public Search Design

MVP search should support:
- exact term search
- normalized term search
- fuzzy search
- author/claimant name search
- category/tag filters
- sort by recency/relevance

## 9. Security Architecture

- RBAC with roles: user, moderator, admin
- server-side enforcement for privileged actions
- no direct client trust for publish/moderation
- rate limiting on auth, search, validation, report submission
- audit log for sensitive actions
- file upload restrictions if uploads are later enabled
- safe secret management

## 10. Error Handling

Each module returns typed results:
- success
- validation error
- transient failure
- policy block
- not found
- unauthorized/forbidden

Validation jobs should:
- fail visibly
- persist partial state
- support retry where safe
- never fabricate a clean verdict when evidence collection failed

## 11. Observability

Log:
- request_id
- actor_id
- term_id / validation_run_id / moderation_case_id
- module name
- provider name
- latency
- status

Metrics:
- validation run duration
- queue backlog
- publish success rate
- search latency
- report volume
- moderation SLA

## 12. Deployment Shape

Initial deployment:
- web app service
- worker service
- postgres
- object storage
- optional managed redis/queue
- managed logs/monitoring

## 13. Evolution Path
After MVP:
- private workspaces
- team collaboration
- paid tiers
- richer source connectors
- multilingual support
- richer legal research integrations
- API access


---

# FILE: CLAUDE.md

# CLAUDE.md — Originym

See @PRD.md, @ARCHITECTURE.md, @DATA_MODEL.md, @NFR.md, @RUNBOOK.md, @AI_INTEGRATION_STRATEGY.md, @TRUST_AND_CLAIMS_POLICY.md

## Project rules
- Work milestone-by-milestone.
- Keep changes narrow and reversible.
- Prefer typed schemas and explicit interfaces.
- Never present Originym as granting legal ownership or guaranteed originality.
- Keep AI integrations behind provider-neutral adapters.
- Add tests and report exact command results.


---

# FILE: DATA_MODEL.md

# DATA_MODEL.md — Originym

## 1. Data Modeling Principles

- Normalize business entities, denormalize search views carefully.
- Keep business IDs stable.
- Version validation runs and exports.
- Preserve audit trails.
- Store public-safe content separately from internal-only moderation metadata when useful.

## 2. Core Entities

### 2.1 User
Fields:
- id (uuid)
- email (unique)
- display_name
- handle (unique nullable)
- role (`user|moderator|admin`)
- status (`active|suspended|deleted`)
- created_at
- updated_at
- last_login_at

### 2.2 TermDraft
Fields:
- id (uuid)
- user_id (fk User)
- term_raw
- term_normalized
- slug_candidate
- definition
- intended_meaning
- intended_domain
- category
- tags (jsonb/text[])
- notes_private
- visibility_preference (`private|public_on_publish`)
- status (`draft|validated|published|archived`)
- latest_validation_run_id (nullable fk ValidationRun)
- created_at
- updated_at

Constraints:
- term_raw length guard
- definition required before validation
- intended_domain required before validation

### 2.3 PublishedTerm
Fields:
- id (uuid)
- draft_id (fk TermDraft unique)
- public_slug (unique)
- display_term
- public_definition
- public_summary
- claimant_display
- first_published_at
- current_state (`public|frozen|hidden|removed`)
- latest_public_validation_run_id
- search_rank
- created_at
- updated_at

### 2.4 ValidationRun
Fields:
- id (uuid)
- draft_id (fk TermDraft)
- run_number
- status (`queued|running|completed|failed|partial`)
- trigger (`manual|republish_check|admin_review`)
- provider_family
- provider_name
- model_name
- prompt_version
- pipeline_version
- verdict_tier (`no_strong_conflict_found|possible_conflict|likely_conflict|high_ambiguity|insufficient_evidence`)
- confidence_score (numeric)
- publish_recommendation (`allow|warn|block|manual_review`)
- reasons_json
- evidence_summary_json
- limitations_note
- started_at
- completed_at
- created_at

Unique:
- (draft_id, run_number)

### 2.5 EvidenceItem
Fields:
- id (uuid)
- validation_run_id (fk ValidationRun)
- source_type (`internal_registry|search_result|manual_reference|dataset|provider_generated`)
- source_name
- source_locator
- source_title
- matched_text_excerpt
- match_type (`exact|near|phonetic|semantic|other`)
- relevance_score
- confidence_score
- conflict_weight
- snapshot_ref
- metadata_json
- created_at

### 2.6 SuggestionSet
Fields:
- id (uuid)
- validation_run_id (fk ValidationRun unique)
- generation_status (`not_needed|generated|failed`)
- provider_name
- model_name
- prompt_version
- created_at

### 2.7 SuggestedTerm
Fields:
- id (uuid)
- suggestion_set_id (fk SuggestionSet)
- candidate_term
- normalized_term
- rationale
- novelty_score
- pronounceability_score
- distinctiveness_score
- collision_risk_score
- rank_order
- created_at

### 2.8 ReportCase
Fields:
- id (uuid)
- published_term_id (fk PublishedTerm)
- reporter_user_id (nullable fk User)
- report_type (`fraud|abuse|impersonation|spam|prior_use_claim|other`)
- description
- evidence_notes
- status (`open|triaged|under_review|resolved|dismissed`)
- resolution_summary
- assigned_to_user_id (nullable fk User)
- created_at
- updated_at
- resolved_at

### 2.9 ModerationAction
Fields:
- id (uuid)
- report_case_id (nullable fk ReportCase)
- published_term_id (fk PublishedTerm)
- actor_user_id (fk User)
- action_type (`freeze|unfreeze|hide|remove|annotate|restore`)
- reason
- details_json
- created_at

### 2.10 ExportRecord
Fields:
- id (uuid)
- draft_id (fk TermDraft)
- validation_run_id (nullable fk ValidationRun)
- published_term_id (nullable fk PublishedTerm)
- export_type (`provenance_summary|evidence_packet|json_bundle`)
- template_version
- file_ref
- created_by_user_id
- created_at

### 2.11 AuditEvent
Fields:
- id (uuid)
- actor_user_id (nullable fk User)
- event_type
- entity_type
- entity_id
- request_id
- payload_json
- created_at

## 3. Relationships (ASCII)

User
 ├──< TermDraft
 ├──< ReportCase
 ├──< ModerationAction
 └──< ExportRecord

TermDraft
 ├──< ValidationRun
 ├──1 PublishedTerm
 └──< ExportRecord

ValidationRun
 ├──< EvidenceItem
 └──1 SuggestionSet
      └──< SuggestedTerm

PublishedTerm
 ├──< ReportCase
 ├──< ModerationAction
 └──< ExportRecord

## 4. Search / Index Considerations

Recommended indexes:
- `termdraft(term_normalized)`
- `publishedterm(public_slug)`
- trigram index on `display_term`
- full-text index on public summary/definition
- composite index on `validationrun(draft_id, created_at desc)`
- composite index on `reportcase(status, created_at)`

## 5. Data Retention

- Keep audit events append-only.
- Preserve validation run metadata even if public record is hidden.
- If user deletion is required, pseudonymize where legally/operationally appropriate while preserving essential audit integrity.

## 6. Migration Strategy

- Use explicit SQL migrations or migration tool with committed files.
- Never hand-edit production schemas without matching migration history.
- Version prompt schemas and verdict schemas separately from DB schema when needed.

## 7. Public vs Internal Data Split

Public-safe:
- term
- definition
- public summary
- claimant display
- publish timestamp
- public evidence summary
- public verdict language

Internal-only:
- moderation notes
- full report evidence
- internal risk flags
- provider raw traces if sensitive
- rate-limit/abuse signals


---

# FILE: GEMINI.md

# GEMINI.md — Originym

## Priority order
1. Repo-local instructions
2. Canonical docs
3. Active task prompt

## Build rules
- Plan before implementation.
- Keep milestone scope tight.
- Use structured outputs and typed schemas.
- Persist provider/model/prompt metadata for AI flows.
- Never encode false trust claims about ownership or guaranteed originality.
- Report file-by-file changes and validation command results.


---

# FILE: MILESTONES.md

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


---

# FILE: MODERATION_POLICY.md

# MODERATION_POLICY.md — Originym

## 1. Goals
- reduce spam, fraud, impersonation, and abuse
- protect public trust in the registry
- preserve good-faith records where possible
- create auditable moderation decisions

## 2. Report Types
- spam
- impersonation
- fraudulent claim
- abusive content
- prior use claim
- copyright/privacy issue
- other

## 3. Moderator Actions
- annotate
- freeze
- hide
- remove
- restore
- dismiss report

## 4. Action Guidance

### Annotate
Use when record remains public but needs context or warning.

### Freeze
Use when dispute is unresolved and trust risk is material.

### Hide
Use when content should not remain publicly searchable during review.

### Remove
Use for clear policy violations, egregious abuse, or legal/safety issues.

### Restore
Use when review clears the record.

## 5. Audit Requirements
Every moderation action must record:
- actor
- action type
- reason
- target entity
- related case if any
- timestamp

## 6. SLA Targets
- first triage within 24h for standard reports
- urgent abuse/safety issues as soon as possible
- full resolution target within 7 days for normal cases where feasible

## 7. Appeals
Allow claimants to submit additional context/evidence for review.


---

# FILE: NFR.md

# NFR.md — Originym

## 1. Security

### Baseline requirements
- server-side authn/authz checks for all non-public actions
- rate limiting on login, validation, publish, search, reporting
- CSRF/session protection appropriate to auth choice
- secrets stored in environment/secret manager only
- structured audit logging for sensitive actions
- secure headers and TLS in deployed environments
- input validation on all user-submitted fields

### Abuse/Trust controls
- anti-spam and anti-bot controls on public submission/report paths
- moderation queue and freeze capability
- safe wording to prevent false assurances
- provider output validation against schemas

## 2. Privacy

- collect only necessary user data
- expose only intended public fields on published records
- separate public claims from private notes
- provide retention/deletion policy
- avoid storing raw provider prompts/responses if not operationally needed, or redact appropriately

## 3. Reliability

Targets for MVP:
- successful page request availability target: 99.5%+
- validation pipeline success target excluding provider outages: 98%+
- export generation success target: 99%+
- graceful degradation if provider unavailable

## 4. Performance

Targets:
- p95 public page load < 2.5s on normal broadband
- p95 registry search < 1.5s for normal queries
- initial validation queue acknowledgement < 2s
- median validation completion target < 60s for MVP where feasible

## 5. Accessibility

- WCAG 2.1 AA-aligned target
- keyboard navigable workflows
- sufficient contrast
- labeled form controls and error states
- no critical interactions that require hover only
- accessible tables/search results

## 6. Observability

Must have:
- structured logs
- request correlation IDs
- business event logging
- metrics for search, validation, publish, moderation
- alertable signals for job failures and queue backlog

## 7. Maintainability

- TypeScript strict mode
- modular boundaries enforced by folder/module conventions
- tests for critical workflows
- schema versioning
- prompt template versioning
- documentation updates required for milestone completion

## 8. Testability

Required test layers:
- unit tests for normalization/scoring logic
- integration tests for validation workflow
- API contract tests
- end-to-end happy path for create → validate → publish → search
- negative tests for authz and malformed inputs

## 9. Operability

- one-command local startup where practical
- worker can be run independently
- seed data path for local testing
- clear deploy and rollback steps
- environment variable manifest documented

## 10. Content Integrity

- published pages must show limitations note
- verdicts must map to evidence objects
- no hidden “clean” score when evidence failed
- moderation actions must be auditable


---

# FILE: PRD.md

# PRD.md — Originym

## 1. Product Summary

**Originym** is a public platform for coined-word creation, evidence-backed validation, provenance recording, and searchable publication.

Users can submit a candidate term, define intended meaning and context, run a structured validation scan, receive alternate suggestions, and publish a timestamped public claim page showing what was checked, what was found, and what remains uncertain.

## 2. Product Vision

Create the most trusted, polished, and explainable public system for:
- recording coined terms,
- attributing first documented platform claims,
- surfacing conflict evidence,
- helping people generate safer alternatives,
- publishing clean public records of term origin stories and intended use.

## 3. Product Positioning

### 3.1 Core value proposition
Originym gives creators, founders, writers, builders, researchers, product teams, and communities a better way to:
- document new terms,
- evaluate risk/conflicts,
- build provenance,
- publish an auditable record.

### 3.2 Product truth
Originym provides:
- timestamped platform records,
- evidence-backed scans,
- explainable confidence tiers,
- public publication and search,
- attribution and provenance exports.

Originym does **not** provide:
- legal ownership rights,
- guaranteed originality,
- guaranteed trademark clearance,
- legal opinions.

## 4. Target Users

### 4.1 Primary users
- startup founders naming products/features
- writers, artists, and creators inventing terminology
- marketing/brand teams inventing campaign language
- researchers and community builders introducing terms
- hobbyists and internet creators coining novel phrases

### 4.2 Secondary users
- moderators reviewing disputes
- readers searching public coined terms
- legal/brand teams using Originym as one research input among many
- journalists/researchers exploring term origin claims

## 5. Jobs to Be Done

1. “Help me check whether this coined term already appears to exist.”
2. “Help me record a public, timestamped claim about a term I created.”
3. “Help me understand the conflict risk before I use this term.”
4. “Help me generate alternatives if my candidate is risky or already used.”
5. “Help me publish a clean record I can cite later.”
6. “Help me export an evidence packet.”

## 6. MVP Scope

### Included in MVP
- account creation and sign-in
- coined-term draft creation
- term metadata entry
- validation run
- evidence summary and structured verdict
- alternate term suggestion engine
- publish public claim page
- public registry search
- dispute/report workflow
- admin moderation queue
- exportable evidence/provenance summary
- audit logging for validation runs

### Explicit non-goals for MVP
- legal filing or legal advice
- direct trademark filing integrations
- full web crawling at internet scale
- multilingual global launch
- paid plans/billing
- enterprise SSO
- collaborative team workspaces
- blockchain or on-chain anchoring
- automated legal demand workflows
- mobile-native apps

## 7. Core User Stories

### US1 — Draft a coined term
As a user, I want to create a term draft with definition, intended use, category, and context so the system can evaluate it properly.

**Acceptance criteria**
- User can create/edit/delete drafts.
- Required fields are validated.
- Autosave or explicit save exists.
- Draft status is visible.

### US2 — Run validation
As a user, I want to run an evidence-backed validation scan so I can see whether the term likely conflicts with existing usage.

**Acceptance criteria**
- Validation run creates a versioned record.
- System shows exact, near, phonetic, and semantic findings.
- Each finding includes source metadata and confidence.
- System shows limitations.

### US3 — Receive alternatives
As a user, I want alternate coined terms when my original term is risky so I can pivot quickly.

**Acceptance criteria**
- Suggestions are generated only when useful.
- Suggestions are ranked.
- Suggestions avoid close collisions with known conflicts.

### US4 — Publish claim page
As a user, I want to publish a public page showing my term, definition, timestamp, and evidence summary.

**Acceptance criteria**
- Published page has canonical public URL.
- Visibility state is tracked.
- Public page uses safe trust language.
- Published records can be reported.

### US5 — Search registry
As a public visitor, I want to search the registry for terms and claims so I can research a word quickly.

**Acceptance criteria**
- Search supports exact and fuzzy matching.
- Results include key metadata.
- Hidden/removed items are not shown publicly.

### US6 — Report or dispute
As a public visitor or claimant, I want to report a claim or open a dispute so the system can review suspicious or harmful entries.

**Acceptance criteria**
- Report form captures type and evidence.
- Admin queue records status transitions.
- Actions are audited.

### US7 — Export evidence
As a user, I want to export a provenance/evidence summary so I can share or archive it.

**Acceptance criteria**
- Export includes metadata, findings, timestamps, and limitations.
- Export excludes secrets/internal-only moderation fields.
- Export version is tracked.

## 8. Primary Workflows

### Workflow A — Validate and publish
1. User signs in.
2. User creates term draft.
3. User enters term, definition, intended domain, category, tags, and optional notes.
4. User runs validation.
5. System collects evidence and returns a structured verdict.
6. User reviews alternatives if needed.
7. User publishes public claim page.
8. System issues timestamped public record.

### Workflow B — Search and inspect
1. Visitor searches a term.
2. Registry returns exact/fuzzy matches.
3. Visitor opens public record.
4. Visitor reads claim details, evidence summary, and limitations.

### Workflow C — Report/dispute
1. Visitor or claimant submits report/dispute.
2. Moderator reviews evidence.
3. Moderator freezes, annotates, or restores entry.
4. Action is logged.

## 9. Trust Model

Originym should use verdict language such as:
- no strong conflict found in checked sources
- prior use detected
- likely conflict
- high ambiguity
- insufficient evidence

Originym must not use language such as:
- guaranteed original
- verified as first-ever use
- legally protected
- exclusive ownership granted

## 10. Revenue Options (post-MVP)
- premium validation tiers
- private workspace mode
- team/enterprise research workspaces
- API for registry lookup
- export/certification packages
- brand naming workflow suite

## 11. Success Metrics

### Product metrics
- draft-to-validation conversion rate
- validation-to-publish conversion rate
- registry search success rate
- dispute rate per published record
- median validation duration
- evidence completeness score

### Quality metrics
- false reassurance incidents
- moderation turnaround time
- export generation success rate
- validation pipeline failure rate
- abuse/spam rate

## 12. Definition of Done for MVP
MVP is done when:
- users can create drafts, run validation, publish records, search the registry, and export evidence;
- moderation/reporting works end-to-end;
- trust language is consistent;
- validation runs are auditable;
- core security, logging, and reliability gates pass.


---

# FILE: PROMPT_PACK_M0_M7.md

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


---

# FILE: RUNBOOK.md

# RUNBOOK.md — Originym

## 1. Repo Assumptions
Default stack assumption:
- Next.js + TypeScript + Tailwind
- PostgreSQL
- background worker
- npm/pnpm
- Vitest and Playwright or equivalent

Adjust commands once the repo is real.

## 2. Local Development

### Environment
Expected env vars (example set):
- `DATABASE_URL`
- `AUTH_SECRET`
- `APP_URL`
- `AI_PROVIDER_DEFAULT`
- `AI_PROVIDER_API_KEY_*`
- `OBJECT_STORAGE_*`
- `QUEUE_URL` or equivalent

### Startup sequence
1. Install dependencies.
2. Start Postgres and any queue/storage dependencies.
3. Apply migrations.
4. Seed dev data if needed.
5. Start app server.
6. Start worker.

## 3. Suggested Commands (to reconcile with actual repo)

```bash
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
pnpm worker:dev
```

## 4. Validation Commands (target shape)

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

## 5. Milestone Completion Standard

A milestone is not complete until:
- scoped features are implemented;
- tests are added/updated;
- lint/typecheck/build are addressed;
- relevant docs are updated;
- manual verification steps are documented.

## 6. Manual Verification Templates

### Create / validate / publish
1. Sign in.
2. Create a new term draft.
3. Enter definition/domain/category.
4. Run validation.
5. Confirm evidence and limitations display.
6. Publish.
7. Open public page.
8. Search for the published term.

### Report flow
1. Open public term page.
2. Submit report.
3. Confirm moderation case created.
4. Moderator resolves case.
5. Confirm public state updates correctly.

## 7. Rollback

### Application rollback
- revert offending commit(s)
- redeploy previous image/build
- verify public routes and worker health

### Database rollback
- only via explicit reverse migration or restore plan
- do not rely on ad hoc schema edits

### Content rollback
- unpublish/freeze specific records if public data is problematic
- retain audit trail

## 8. Incident Response

### Provider outage
- surface degraded mode
- disable validation initiation if necessary
- keep search/public records available if possible

### Abuse wave
- tighten rate limits
- require additional anti-bot checks
- bulk freeze/flag if needed
- review moderation dashboard

## 9. Release Checklist
- migrations reviewed
- env vars documented
- smoke tests passed
- security-sensitive changes reviewed
- trust language reviewed
- rollback path confirmed


---

# FILE: SEARCH_AND_EVIDENCE_POLICY.md

# SEARCH_AND_EVIDENCE_POLICY.md — Originym

## 1. Goal
Make validation results explainable by preserving what sources were checked, how matches were categorized, and where uncertainty remains.

## 2. MVP Source Categories
- internal registry entries
- curated search results / search-grounded evidence
- manually supplied references by users or moderators
- provider-generated semantic analysis based on retrieved evidence

## 3. Evidence Item Requirements
Each evidence item should capture:
- source type
- source name/title
- locator/URL/reference
- match type
- excerpt or summary
- relevance/confidence
- snapshot or retrieval timestamp where possible

## 4. Match Types
- exact
- near
- phonetic
- semantic
- contextual

## 5. Result Presentation
UI should prioritize:
1. strongest conflicts
2. highest-confidence corroborating findings
3. limitations
4. next actions

## 6. Limitations
Originym should always disclose:
- checked sources are limited
- internet/common-law use may be broader than scanned evidence
- search/index timing can affect findings
- meanings and domains may overlap unpredictably

## 7. Source Reliability
Prefer:
- primary/public sources
- internally published Originym records
- stable references with titles and locators

Be cautious with:
- low-quality spam pages
- pages lacking attribution/context
- transient or obviously low-trust sources


---

# FILE: TRUST_AND_CLAIMS_POLICY.md

# TRUST_AND_CLAIMS_POLICY.md — Originym

## 1. Purpose

This document defines what Originym may and may not claim in product copy, UI labels, exports, and AI-generated outputs.

## 2. Allowed Claims

Originym may say:
- recorded on Originym
- published on Originym
- timestamped public claim
- evidence-backed scan
- no strong conflict found in checked sources
- possible conflict found
- likely conflict found
- limitations apply
- further research recommended

## 3. Forbidden Claims

Originym must not say:
- legally owned
- guaranteed original
- globally first-ever use
- trademark cleared
- exclusive rights granted
- officially accredited ownership
- conflict-free everywhere

## 4. Verdict Tier Language

### `no_strong_conflict_found`
Suggested UI copy:
“No strong conflict was found in the checked sources. This is not a guarantee of originality or legal clearance.”

### `possible_conflict`
Suggested UI copy:
“The scan found possible conflicts or similar usages that may require further review.”

### `likely_conflict`
Suggested UI copy:
“The scan found likely conflicts with existing or similar usage.”

### `high_ambiguity`
Suggested UI copy:
“The term appears ambiguous or difficult to evaluate confidently with the available evidence.”

### `insufficient_evidence`
Suggested UI copy:
“The scan could not collect enough reliable evidence to support a confident result.”

## 5. Publication Language

Public pages should display:
- timestamp
- claimant attribution
- term definition
- evidence summary
- limitations note
- report link

Public pages should not imply:
- legal rights issuance
- certification by a government or court
- universal novelty

## 6. AI Output Review
Any AI-generated text presented to users must be derived from approved verdict tiers and reviewed against this policy by code, template, or tests.


---

# FILE: UX_SYSTEM.md

# UX_SYSTEM.md — Originym

## 1. Product Feel
- modern
- clean
- crisp
- premium
- trustworthy
- enterprise-ready without feeling sterile

## 2. Visual Direction
- restrained color system
- generous whitespace
- high legibility
- card-and-panel layout
- evidence/result modules that read clearly

## 3. Key Screens
- landing page
- dashboard
- new term flow
- validation results
- published term page
- registry search
- report/dispute form
- moderation queue

## 4. UX Principles
- make uncertainty explicit
- show strongest findings first
- avoid walls of text
- provide next actions
- separate public-safe content from private workspaces

## 5. Result Screen Requirements
Must show:
- term
- definition/domain
- verdict badge
- confidence score or confidence tier
- top conflicts
- evidence list
- limitations
- suggestion panel if needed
- publish CTA if allowed

## 6. Public Page Requirements
Must show:
- term
- public definition
- claimant
- timestamp
- evidence summary
- limitations note
- report link

Must not show:
- raw private notes
- internal moderation metadata
- internal-only provider traces


---

# FILE: _system/precedence.manifest.json

{
  "version": "1.0.0",
  "app": "Originym",
  "instruction_precedence": [
    "repo-local instruction files",
    "canonical SSoT docs",
    "active milestone prompt",
    "external host/orchestration prompts"
  ],
  "repo_instruction_files": [
    "AGENTS.md",
    "CLAUDE.md",
    "GEMINI.md",
    ".cursor/rules/*.mdc",
    "_system/repo-operating-profile.md"
  ],
  "canonical_docs": [
    "PRD.md",
    "ARCHITECTURE.md",
    "DATA_MODEL.md",
    "NFR.md",
    "RUNBOOK.md",
    "AI_INTEGRATION_STRATEGY.md",
    "TRUST_AND_CLAIMS_POLICY.md"
  ],
  "critical_rules": [
    "Do not imply legal ownership or guaranteed originality",
    "Keep AI integrations provider-neutral",
    "Stay within milestone scope",
    "Report exact validation results"
  ]
}


---

# FILE: _system/repo-operating-profile.md

# Repo Operating Profile — Originym

## App family
AI-assisted public registry / provenance / validation platform

## Preferred architecture
Modular monolith

## Preferred stack
- Next.js
- TypeScript
- Tailwind
- PostgreSQL
- Background worker

## Special product constraints
- Originym must never imply legal ownership or guaranteed originality.
- Validation must be explainable and evidence-backed.
- AI integrations must stay provider-neutral.
- Moderation and auditability are first-class, not bolt-ons.

## Expected validation surfaces
- lint
- typecheck
- unit tests
- integration tests
- end-to-end path for create → validate → publish → search


---

