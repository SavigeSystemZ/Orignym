# PRD.md — Originym

## 1. Product Summary

**Originym** is a public platform for coined-word creation, evidence-backed validation, provenance recording, and searchable publication.

Users can submit a candidate term, define intended meaning and context, run a structured validation scan, receive alternate suggestions, and publish a timestamped public claim page showing what was checked, what was found, and what remains uncertain.

## 2. Product Vision

Create the most trusted, polished, and explainable public system for:
- recording coined terms,
- attributing first documented platform claims,
- surfacing conflict evidence,
- helping people generate safer alternatives,
- publishing clean public records of term origin stories and intended use.

## 3. Product Positioning

### 3.1 Core value proposition
Originym gives creators, founders, writers, builders, researchers, product teams, and communities a better way to:
- document new terms,
- evaluate risk/conflicts,
- build provenance,
- publish an auditable record.

### 3.2 Product truth
Originym provides:
- timestamped platform records,
- evidence-backed scans,
- explainable confidence tiers,
- public publication and search,
- attribution and provenance exports.

Originym does **not** provide:
- legal ownership rights,
- guaranteed originality,
- guaranteed trademark clearance,
- legal opinions.

## 4. Target Users

### 4.1 Primary users
- startup founders naming products/features
- writers, artists, and creators inventing terminology
- marketing/brand teams inventing campaign language
- researchers and community builders introducing terms
- hobbyists and internet creators coining novel phrases

### 4.2 Secondary users
- moderators reviewing disputes
- readers searching public coined terms
- legal/brand teams using Originym as one research input among many
- journalists/researchers exploring term origin claims

## 5. Jobs to Be Done

1. “Help me check whether this coined term already appears to exist.”
2. “Help me record a public, timestamped claim about a term I created.”
3. “Help me understand the conflict risk before I use this term.”
4. “Help me generate alternatives if my candidate is risky or already used.”
5. “Help me publish a clean record I can cite later.”
6. “Help me export an evidence packet.”

## 6. MVP Scope

### Included in MVP
- account creation and sign-in
- coined-term draft creation
- term metadata entry
- validation run
- evidence summary and structured verdict
- alternate term suggestion engine
- publish public claim page
- public registry search
- dispute/report workflow
- admin moderation queue
- exportable evidence/provenance summary
- audit logging for validation runs

### Explicit non-goals for MVP
- legal filing or legal advice
- direct trademark filing integrations
- full web crawling at internet scale
- multilingual global launch
- paid plans/billing
- enterprise SSO
- collaborative team workspaces
- blockchain or on-chain anchoring
- automated legal demand workflows
- mobile-native apps

## 7. Core User Stories

### US1 — Draft a coined term
As a user, I want to create a term draft with definition, intended use, category, and context so the system can evaluate it properly.

**Acceptance criteria**
- User can create/edit/delete drafts.
- Required fields are validated.
- Autosave or explicit save exists.
- Draft status is visible.

### US2 — Run validation
As a user, I want to run an evidence-backed validation scan so I can see whether the term likely conflicts with existing usage.

**Acceptance criteria**
- Validation run creates a versioned record.
- System shows exact, near, phonetic, and semantic findings.
- Each finding includes source metadata and confidence.
- System shows limitations.

### US3 — Receive alternatives
As a user, I want alternate coined terms when my original term is risky so I can pivot quickly.

**Acceptance criteria**
- Suggestions are generated only when useful.
- Suggestions are ranked.
- Suggestions avoid close collisions with known conflicts.

### US4 — Publish claim page
As a user, I want to publish a public page showing my term, definition, timestamp, and evidence summary.

**Acceptance criteria**
- Published page has canonical public URL.
- Visibility state is tracked.
- Public page uses safe trust language.
- Published records can be reported.

### US5 — Search registry
As a public visitor, I want to search the registry for terms and claims so I can research a word quickly.

**Acceptance criteria**
- Search supports exact and fuzzy matching.
- Results include key metadata.
- Hidden/removed items are not shown publicly.

### US6 — Report or dispute
As a public visitor or claimant, I want to report a claim or open a dispute so the system can review suspicious or harmful entries.

**Acceptance criteria**
- Report form captures type and evidence.
- Admin queue records status transitions.
- Actions are audited.

### US7 — Export evidence
As a user, I want to export a provenance/evidence summary so I can share or archive it.

**Acceptance criteria**
- Export includes metadata, findings, timestamps, and limitations.
- Export excludes secrets/internal-only moderation fields.
- Export version is tracked.

## 8. Primary Workflows

### Workflow A — Validate and publish
1. User signs in.
2. User creates term draft.
3. User enters term, definition, intended domain, category, tags, and optional notes.
4. User runs validation.
5. System collects evidence and returns a structured verdict.
6. User reviews alternatives if needed.
7. User publishes public claim page.
8. System issues timestamped public record.

### Workflow B — Search and inspect
1. Visitor searches a term.
2. Registry returns exact/fuzzy matches.
3. Visitor opens public record.
4. Visitor reads claim details, evidence summary, and limitations.

### Workflow C — Report/dispute
1. Visitor or claimant submits report/dispute.
2. Moderator reviews evidence.
3. Moderator freezes, annotates, or restores entry.
4. Action is logged.

## 9. Trust Model

Originym should use verdict language such as:
- no strong conflict found in checked sources
- prior use detected
- likely conflict
- high ambiguity
- insufficient evidence

Originym must not use language such as:
- guaranteed original
- verified as first-ever use
- legally protected
- exclusive ownership granted

## 10. Revenue Options (post-MVP)
- premium validation tiers
- private workspace mode
- team/enterprise research workspaces
- API for registry lookup
- export/certification packages
- brand naming workflow suite

## 11. Success Metrics

### Product metrics
- draft-to-validation conversion rate
- validation-to-publish conversion rate
- registry search success rate
- dispute rate per published record
- median validation duration
- evidence completeness score

### Quality metrics
- false reassurance incidents
- moderation turnaround time
- export generation success rate
- validation pipeline failure rate
- abuse/spam rate

## 12. Definition of Done for MVP
MVP is done when:
- users can create drafts, run validation, publish records, search the registry, and export evidence;
- moderation/reporting works end-to-end;
- trust language is consistent;
- validation runs are auditable;
- core security, logging, and reliability gates pass.
