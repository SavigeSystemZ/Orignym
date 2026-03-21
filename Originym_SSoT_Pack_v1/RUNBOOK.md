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
