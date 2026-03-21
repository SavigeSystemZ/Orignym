# Orignym - Search and Evidence Policy

## 1. Verification Pipeline
The verification process is a staged, evidence-first pipeline to identify conflicts.

### Stage A: Normalization
- Lowercase, punctuation, and spacing normalization.
- Unicode normalization.
- Plural/singular handling.
- Pronunciation / phonetic approximation.

### Stage B: Exact Conflict Checks
- Exact string matches.
- Exact normalized-string matches.
- Obvious variant matches.

### Stage C: Near-Match Checks
- Edit-distance checks.
- Prefix/suffix and compound-word overlaps.

### Stage D: Phonetic Checks
- Phonetic similarity and dictation collisions.

### Stage E: Semantic/Context Checks
- Intended meaning similarity.
- Category/domain overlap.

### Stage F: Evidence Synthesis
- Collect `EvidenceItem` objects.
- Rank conflicts and filter noisy results.
- Produce a structured verdict and limitations note.

## 2. Verdict Tiers
- `no_strong_conflict_found`
- `possible_conflict_detected`
- `strong_conflict_detected`
- `insufficient_evidence`
- `needs_human_review`