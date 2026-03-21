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
