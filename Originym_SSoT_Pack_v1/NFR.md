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
