# Orignym - Architecture Blueprint

## 1. Core Principles
- **Provider-Neutral AI:** All AI functionality must be implemented behind internal abstractions (`LLMProvider`, `GroundedSearchProvider`, `StructuredOutputProvider`, `SuggestionProvider`). Business logic must never depend directly on a single vendor SDK (e.g., Gemini).
- **Evidence-First:** The verification engine must produce structured evidence objects, not just prose.
- **Modular Monolith:** Core modules are logically separated but can be deployed together.

## 2. Recommended Stack
- **Frontend:** Next.js + TypeScript + Tailwind CSS.
- **Backend:** Next.js server routes or route handlers.
- **Database:** PostgreSQL.
- **Jobs:** Background queue for verification, indexing, suggestions, and moderation tasks.
- **Storage:** Object storage for evidence snapshots, exported reports, and audit artifacts.
- **Search:** PostgreSQL full-text search initially, with an abstraction layer for later extension to vector or hybrid retrieval.
- **Auth:** Auth.js, Clerk, or equivalent.
- **Observability:** Structured logs, metrics, error tracing, and audit trails.

## 3. Core Modules
- **auth:** Identity and access management.
- **users:** Profiles and settings.
- **claims:** Drafts and lifecycle management of coined-word claims.
- **verification:** Staged evidence-first pipeline.
- **evidence:** Capturing and classifying conflict signals.
- **suggestions:** Generating context-aware alternate words.
- **registry:** Public database of published entries.
- **public_pages:** View layer for claims and search.
- **search:** Discovery of claims and terms.
- **moderation:** Admin tools for fraud and abuse.
- **disputes:** Workflows for challenging claims.
- **exports:** Provenance and evidence artifact generation.
- **admin:** System configuration and analytics.
- **audit:** Immutable logs of system and moderation events.

## 4. Acceptance Criteria
- AI providers can be swapped by implementing the appropriate provider interface.
- Core modules interact via defined internal APIs, avoiding circular dependencies.

*See `AI_INTEGRATION_STRATEGY.md` for AI specifics, `DATA_MODEL.md` for schema details.*