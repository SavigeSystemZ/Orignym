# Product Brief

Use this file to capture the product idea, intended user value, and chosen build shape for this repo.

## Product frame

- Product name: Orignym
- Product category: Web3 / Decentralized Identity / Registry
- One-line summary: Decentralized term registry and claim verification platform.
- Why it should exist: capture the user pain, operator leverage, or market opportunity this app resolves
- Primary users: Developers, organizations, and individuals seeking unique, verified identifiers.
- Primary workflows: Claiming a term, verifying a claim via AI/Human consensus, searching the registry.
- Success indicators: Low collision rate, high verification accuracy, easy-to-use search.
- Non-goals: Social networking, general-purpose blockchain.

## Experience bar

- Visual direction: High (Deep Glass)
- Interaction bar: High (Framer Motion / Smooth transitions)
- Performance bar: High
- Reliability bar: clear degraded states, explicit error handling, and no fake capability claims
- Trust and safety bar: security-conscious defaults, honest validation claims, and explicit handling of risky actions

## Build shape

- Recommended starter blueprint: NEXT_JS_FULLSTACK - Next.js Fullstack Blueprint
- Recommendation confidence: high
- Recommendation rationale: Best fit: NEXT_JS_FULLSTACK - Next.js Fullstack Blueprint. Signals: Next.js runtime signals were found in the repo.; Product framing explicitly mentions a Next.js-style fullstack web app.. Top alternatives: BACKGROUND_WORKER (8), GRAPHQL_API (8).
- Selected starter blueprint: not yet selected
- Why this blueprint fits: choose a starter blueprint after the product frame and delivery surfaces are clearer
- Planned repo shape: decide after selecting a starter blueprint
- First milestone: prove one end-to-end user-facing or operator-facing slice with real validation
- Initial validation focus: confirm one real build, launch, test, or smoke path early and keep it passing
- Next decision gates: starter blueprint, persistence model, deployment targets, packaging expectations, and AI scope

## Usage rules

- Keep this aligned with `_system/PROJECT_PROFILE.md`, `PLAN.md`, `ROADMAP.md`, `DESIGN_NOTES.md`, and `ARCHITECTURE_NOTES.md`.
- If the repo is greenfield, use `bootstrap/recommend-starter-blueprint.sh` first, then use `bootstrap/apply-starter-blueprint.sh` to stamp the explicitly chosen starter blueprint into the first operating surfaces.
- Keep this factual and product-specific; do not turn it into vague aspiration or marketing filler.
