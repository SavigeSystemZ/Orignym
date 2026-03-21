# Orignym - Non-Functional Requirements (NFR)

## 1. Performance
- **Search Latency:** Registry searches should return results in under 200ms (P95).
- **Verification Pipeline:** Asynchronous. The user must be notified upon completion. The pipeline should complete within 60 seconds.
- **Page Load:** Public registry pages should be statically generated or cached, achieving LCP < 1.5s.

## 2. Reliability & Availability
- **Uptime:** Target 99.9% uptime for the public registry.
- **Graceful Degradation:** If an AI provider (e.g., Gemini) is unavailable, the system should fall back to a deterministic exact-match search or notify the user of delays without failing the entire platform.

## 3. Scalability
- **Database:** PostgreSQL must handle millions of `EvidenceItem` records. Indexing on `normalized_term` and full-text search vectors is critical.
- **Queues:** Verification, moderation tasks, and suggestion generation must use a robust background queue to prevent blocking the web layer.

## 4. Security & Privacy
- **Audit Trails:** All moderation actions, claim state transitions, and AI provider runs must be logged immutably.
- **Rate Limiting:** Strict rate limits on claim creation, verification runs, and public searches to prevent abuse and manage API costs.
- **Data Retention:** Evidence snapshot retention policies must balance provenance requirements with privacy regulations (e.g., GDPR).

## 5. Portability & Extensibility
- **AI Vendor Lock-in:** Code must not depend on a single AI provider's SDK. Interfaces must be respected.
- **Deployment:** The application must be containerized (Docker) to run on standard cloud platforms (AWS, GCP, Vercel).

*See `SECURITY_MODEL.md` for detailed security guidelines.*