# DATA_MODEL.md — Originym

## 1. Data Modeling Principles

- Normalize business entities, denormalize search views carefully.
- Keep business IDs stable.
- Version validation runs and exports.
- Preserve audit trails.
- Store public-safe content separately from internal-only moderation metadata when useful.

## 2. Core Entities

### 2.1 User
Fields:
- id (uuid)
- email (unique)
- display_name
- handle (unique nullable)
- role (`user|moderator|admin`)
- status (`active|suspended|deleted`)
- created_at
- updated_at
- last_login_at

### 2.2 TermDraft
Fields:
- id (uuid)
- user_id (fk User)
- term_raw
- term_normalized
- slug_candidate
- definition
- intended_meaning
- intended_domain
- category
- tags (jsonb/text[])
- notes_private
- visibility_preference (`private|public_on_publish`)
- status (`draft|validated|published|archived`)
- latest_validation_run_id (nullable fk ValidationRun)
- created_at
- updated_at

Constraints:
- term_raw length guard
- definition required before validation
- intended_domain required before validation

### 2.3 PublishedTerm
Fields:
- id (uuid)
- draft_id (fk TermDraft unique)
- public_slug (unique)
- display_term
- public_definition
- public_summary
- claimant_display
- first_published_at
- current_state (`public|frozen|hidden|removed`)
- latest_public_validation_run_id
- search_rank
- created_at
- updated_at

### 2.4 ValidationRun
Fields:
- id (uuid)
- draft_id (fk TermDraft)
- run_number
- status (`queued|running|completed|failed|partial`)
- trigger (`manual|republish_check|admin_review`)
- provider_family
- provider_name
- model_name
- prompt_version
- pipeline_version
- verdict_tier (`no_strong_conflict_found|possible_conflict|likely_conflict|high_ambiguity|insufficient_evidence`)
- confidence_score (numeric)
- publish_recommendation (`allow|warn|block|manual_review`)
- reasons_json
- evidence_summary_json
- limitations_note
- started_at
- completed_at
- created_at

Unique:
- (draft_id, run_number)

### 2.5 EvidenceItem
Fields:
- id (uuid)
- validation_run_id (fk ValidationRun)
- source_type (`internal_registry|search_result|manual_reference|dataset|provider_generated`)
- source_name
- source_locator
- source_title
- matched_text_excerpt
- match_type (`exact|near|phonetic|semantic|other`)
- relevance_score
- confidence_score
- conflict_weight
- snapshot_ref
- metadata_json
- created_at

### 2.6 SuggestionSet
Fields:
- id (uuid)
- validation_run_id (fk ValidationRun unique)
- generation_status (`not_needed|generated|failed`)
- provider_name
- model_name
- prompt_version
- created_at

### 2.7 SuggestedTerm
Fields:
- id (uuid)
- suggestion_set_id (fk SuggestionSet)
- candidate_term
- normalized_term
- rationale
- novelty_score
- pronounceability_score
- distinctiveness_score
- collision_risk_score
- rank_order
- created_at

### 2.8 ReportCase
Fields:
- id (uuid)
- published_term_id (fk PublishedTerm)
- reporter_user_id (nullable fk User)
- report_type (`fraud|abuse|impersonation|spam|prior_use_claim|other`)
- description
- evidence_notes
- status (`open|triaged|under_review|resolved|dismissed`)
- resolution_summary
- assigned_to_user_id (nullable fk User)
- created_at
- updated_at
- resolved_at

### 2.9 ModerationAction
Fields:
- id (uuid)
- report_case_id (nullable fk ReportCase)
- published_term_id (fk PublishedTerm)
- actor_user_id (fk User)
- action_type (`freeze|unfreeze|hide|remove|annotate|restore`)
- reason
- details_json
- created_at

### 2.10 ExportRecord
Fields:
- id (uuid)
- draft_id (fk TermDraft)
- validation_run_id (nullable fk ValidationRun)
- published_term_id (nullable fk PublishedTerm)
- export_type (`provenance_summary|evidence_packet|json_bundle`)
- template_version
- file_ref
- created_by_user_id
- created_at

### 2.11 AuditEvent
Fields:
- id (uuid)
- actor_user_id (nullable fk User)
- event_type
- entity_type
- entity_id
- request_id
- payload_json
- created_at

## 3. Relationships (ASCII)

User
 ├──< TermDraft
 ├──< ReportCase
 ├──< ModerationAction
 └──< ExportRecord

TermDraft
 ├──< ValidationRun
 ├──1 PublishedTerm
 └──< ExportRecord

ValidationRun
 ├──< EvidenceItem
 └──1 SuggestionSet
      └──< SuggestedTerm

PublishedTerm
 ├──< ReportCase
 ├──< ModerationAction
 └──< ExportRecord

## 4. Search / Index Considerations

Recommended indexes:
- `termdraft(term_normalized)`
- `publishedterm(public_slug)`
- trigram index on `display_term`
- full-text index on public summary/definition
- composite index on `validationrun(draft_id, created_at desc)`
- composite index on `reportcase(status, created_at)`

## 5. Data Retention

- Keep audit events append-only.
- Preserve validation run metadata even if public record is hidden.
- If user deletion is required, pseudonymize where legally/operationally appropriate while preserving essential audit integrity.

## 6. Migration Strategy

- Use explicit SQL migrations or migration tool with committed files.
- Never hand-edit production schemas without matching migration history.
- Version prompt schemas and verdict schemas separately from DB schema when needed.

## 7. Public vs Internal Data Split

Public-safe:
- term
- definition
- public summary
- claimant display
- publish timestamp
- public evidence summary
- public verdict language

Internal-only:
- moderation notes
- full report evidence
- internal risk flags
- provider raw traces if sensitive
- rate-limit/abuse signals
