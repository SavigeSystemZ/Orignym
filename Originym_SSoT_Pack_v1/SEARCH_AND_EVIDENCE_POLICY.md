# SEARCH_AND_EVIDENCE_POLICY.md — Originym

## 1. Goal
Make validation results explainable by preserving what sources were checked, how matches were categorized, and where uncertainty remains.

## 2. MVP Source Categories
- internal registry entries
- curated search results / search-grounded evidence
- manually supplied references by users or moderators
- provider-generated semantic analysis based on retrieved evidence

## 3. Evidence Item Requirements
Each evidence item should capture:
- source type
- source name/title
- locator/URL/reference
- match type
- excerpt or summary
- relevance/confidence
- snapshot or retrieval timestamp where possible

## 4. Match Types
- exact
- near
- phonetic
- semantic
- contextual

## 5. Result Presentation
UI should prioritize:
1. strongest conflicts
2. highest-confidence corroborating findings
3. limitations
4. next actions

## 6. Limitations
Originym should always disclose:
- checked sources are limited
- internet/common-law use may be broader than scanned evidence
- search/index timing can affect findings
- meanings and domains may overlap unpredictably

## 7. Source Reliability
Prefer:
- primary/public sources
- internally published Originym records
- stable references with titles and locators

Be cautious with:
- low-quality spam pages
- pages lacking attribution/context
- transient or obviously low-trust sources
