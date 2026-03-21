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
