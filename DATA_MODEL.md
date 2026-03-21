# Orignym - Data Model

## 1. Core Entities

### User & Profile
- **User:** Authentication identity.
- **Profile:** Public or internal display details.

### CoinedTermClaim
- `claim_id` (UUID)
- `user_id` (FK)
- `proposed_term` (String)
- `normalized_term` (String)
- `pronunciation_hint` (String, optional)
- `language_locale` (String)
- `intended_meaning` (Text)
- `domain_category` (String)
- `description_use_context` (Text)
- `claimed_first_use_date` (Date, user-supplied)
- `visibility_state` (Enum)
- `publication_state` (Enum)
- `created_at` / `updated_at` (Timestamp)

### VerificationRun
- `run_id` (UUID)
- `claim_id` (FK)
- `provider_used` (String)
- `model_used` (String)
- `prompt_version` (String)
- `search_strategy_version` (String)
- `verdict_tier` (Enum: `no_strong_conflict_found`, `possible_conflict_detected`, `strong_conflict_detected`, `insufficient_evidence`, `needs_human_review`)
- `confidence_score` (Float)
- `summary_reasons` (Text)
- `limitations_note` (Text)
- `status` (Enum)
- `created_at` / `completed_at` (Timestamp)

### EvidenceItem
- `evidence_id` (UUID)
- `verification_run_id` (FK)
- `source_type` (String)
- `source_label` (String)
- `source_url_identifier` (String)
- `matched_text_snippet` (Text)
- `classification` (Enum: `exact`, `near`, `phonetic`, `semantic`)
- `relevance_score` (Float)
- `captured_at` (Timestamp)

### System Entities
- **ConflictSignal:** Aggregation of evidence items.
- **SuggestedAlternative:** AI-generated suggestions linked to a claim.
- **PublishedEntry:** The public projection of an approved claim.
- **Dispute & ModerationAction:** Tracking challenges and admin actions.
- **ExportArtifact:** Snapshots of provenance and evidence.
- **AuditEvent:** Immutable log of system changes.
- **AIProviderRun:** Metadata for each AI invocation.

*See `SEARCH_AND_EVIDENCE_POLICY.md` for verification states, `MODERATION_POLICY.md` for dispute schemas.*