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
