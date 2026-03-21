# Orignym - Runbook & Operations

## 1. Deployment
- **Environment Variables:** Must include database credentials, AI provider API keys, and auth secrets. Never commit `.env` files.
- **Migrations:** Run database migrations before starting the application server. Ensure backward compatibility.
- **Rollback:** If a deployment introduces critical bugs, revert to the previous container image and reverse any destructive database migrations (or rely on backups if destructive).

## 2. Incident Management
- **Verification Pipeline Stalls:** If background jobs are failing, check queue health and AI provider rate limits.
- **High Conflict Rates:** If the suggestion engine loops or fails to generate terms, verify prompt versions and context length limits.
- **Moderation Spikes:** In case of spam attacks, administrators can freeze user accounts or use rate-limiting throttles via the admin panel.

## 3. Observability
- **Logs:** Ensure structured JSON logging. All AI runs must log the `prompt_version`, `model_used`, and execution time.
- **Metrics:** Track `verification_run` durations, error rates by provider, and API response times.

## 4. Audit & Compliance Tasks
- **Routine Checks:** Periodically review `AuditEvent` logs for unexpected moderation actions.
- **Data Cleanup:** Enforce retention policies on orphaned `EvidenceItem` records or rejected draft claims based on privacy policies.

*See `ARCHITECTURE.md` for system overview.*