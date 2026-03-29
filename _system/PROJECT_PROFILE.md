# Project Profile

Fill this file in immediately after copying the operating system into a real repo. The stronger and more specific this file is, the better every agent will perform.

## Completion status

- [x] Identity filled
- [x] Runtime boundaries filled
- [x] Stack filled
- [x] Components filled
- [ ] Build, packaging, and install filled
- [ ] Mobile and AI filled
- [x] Validation commands filled
- [ ] Operations and deployment filled
- [ ] Security and compliance filled
- [ ] Observability filled
- [ ] Constraints filled
- [ ] MCP plan filled
- [x] Canonical docs filled
- [ ] Experience targets filled
- [ ] Release model filled

## Identity

- App name: Orignym
- App id: io.aiaast.orignym
- Desktop entry id: io.aiaast.orignym
- Android application id: io.aiaast.orignym
- Repo purpose: Decentralized term registry and claim verification platform.
- Product category: Web3 / Decentralized Identity / Registry
- Primary users: Developers, organizations, and individuals seeking unique, verified identifiers.
- Main workflows: Claiming a term, verifying a claim via AI/Human consensus, searching the registry.
- Primary success criteria: Low collision rate, high verification accuracy, easy-to-use search.
- Non-goals: Social networking, general-purpose blockchain.

## Runtime boundaries

- Runtime code roots: src/
- Test roots: tests/
- Scripts / tooling roots: scripts/
- Packaging / deploy roots: ops/, packaging/, mobile/, ai/
- Infrastructure roots: prisma/
- Agent-system root: `_system/`
- No-touch zones: `.git/`, `node_modules/`

## Stack

- Primary languages: TypeScript, SQL (Prisma)
- Primary frameworks: Next.js (App Router), React, Tailwind CSS
- Components: mobile (Flutter/Android), backend (Next.js APIs)
- Datastores: PostgreSQL (Production), SQLite (Local development)
- Package managers: npm
- Build tools: Next.js Build, TypeScript compiler
- Runtime environments: Node.js, Vercel/Self-hosted
- Supported environments: Linux, Android, Web
- Deployment targets: Docker, Vercel

## Build and packaging

- Packaging targets: AppImage, Flatpak, Snap, APK
- Native package targets: deb, rpm
- Universal package targets: AppImage
- Packaging manifest paths: packaging/appimage.yml, packaging/flatpak-manifest.json, packaging/snapcraft.yaml
- Installer commands: scripts/install.sh
- Signing identity: Release owner placeholder
- Minimum runtime versions: Node.js 18+
- System dependencies: Docker, PostgreSQL
- Build entrypoints: npm run build
- Release artifacts: Android APK, AppImage

## Validation commands

- Format: npm run lint
- Lint: npm run lint
- Typecheck: npx tsc --noEmit
- Unit tests: npx vitest run
- Integration tests: npx vitest run tests/verification.test.ts
- End-to-end or smoke: npm run build
- Build: npm run build
- Install / launch verification: scripts/start-app.sh
- Packaging verification:
- Visual regression or design smoke:
- Security or policy checks: bootstrap/scan-security.sh .

## Mobile and AI

- Mobile targets: Android
- Android module path: mobile/flutter/
- Mobile release artifacts: APK
- Mobile build flavors: debug, release
- LLM config path: ai/llm_config.yaml
- Default LLM provider: Mock (Current), Gemini/Claude (Planned)
- Chatbot surfaces: Web GUI
- Command bus or action registry:
- Local documentation sources: AGENTS.md, ARCHITECTURE.md, PRD.md

## Operations and deployment

- Default ports: 3000 (Next.js), Random High Range (Installer)
- Default port range: 10000-60000 (scripts/install.sh)
- Bind model: bind to 127.0.0.1 by default
- Required background services: PostgreSQL
- Service model: Next.js Fullstack
- Migration model: Prisma
- Database mode: Relational
- Container runtime preference: Docker Compose
- Service account model:
- Required env vars: DATABASE_URL, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- Optional providers: Gemini API Key, Anthropic API Key
- Known degraded modes: Mock AI mode when keys are missing.
- Backup location:
- Filesystem layout: Standard Next.js
- Environment files: .env, .env.local
- Reverse proxy or ingress: Nginx (Production)

## Security and compliance

- Safety / compliance:
- Security: NextAuth.js
- Secret handling: .env (ignored by git)
- Data classification:
- Audit or retention requirements:
- Threat model doc: SECURITY_MODEL.md

## Observability

- Structured logging surface: Console (Next.js)
- Metrics surface:
- Health or readiness surface:
- Tracing or profiling surface:
- Alerting or dashboards:

## Constraints

- Performance: Snappy UI, < 2s AI response (mock)
- UI / design: Deep Glass aesthetic
- Accessibility expectations: WCAG 2.1 AA
- Data integrity: Strong Prisma schema constraints
- Release / packaging: Must support Linux and Android
- Repo workflow: Trunk-based development
- Compatibility requirements:

## MCP plan

- Project-scoped servers:
- User-level shared servers:
- Read-only defaults:
- Elevation rules:
- Servers to avoid:

## Canonical docs

- Product spec: PRD.md
- Architecture: ARCHITECTURE.md
- Data model: DATA_MODEL.md
- Runbook: RUNBOOK.md
- Standards: _system/CODING_STANDARDS.md
- Threat model: SECURITY_MODEL.md
- Additional design docs: DESIGN_NOTES.md, UI_SURFACES.md

## Experience targets

- Visual quality bar: High (Deep Glass)
- Interaction quality bar: High (Framer Motion / Smooth transitions)
- Performance quality bar: High
- Accessibility expectations: High
- Device targets: Desktop Web, Android Mobile
- Brand or tone constraints: Professional, Trustworthy, Modern

## Release model

- Environments: dev, prod
- Branch strategy: main
- Rollout method: Docker Compose / Vercel
- Backout method: Git revert / Container rollback
- Release signoff:
- Post-release verification:

## High-value conventions

- Naming conventions: CamelCase for components, camelCase for variables
- Module boundary rules:
- Logging rules:
- Testing rules: Vitest for logic, Playwright (planned) for E2E
- Handoff expectations: Updated WHERE_LEFT_OFF.md
- Documentation update expectations: Keep canonical docs in sync with code
