# Orignym - AI Integration Strategy

## 1. Provider-Neutral Architecture
Orignym is designed to be AI-provider agnostic. While Gemini may be used as the initial lead provider due to its large context window and structured output capabilities, the system must not be locked into its specific SDK.

### Required Interfaces
All business logic must depend on internal interfaces:
- `LLMProvider`: Standard text completion and chat.
- `GroundedSearchProvider`: Search with contextual grounding.
- `StructuredOutputProvider`: Enforces JSON schema returns.
- `SuggestionProvider`: Specialized interface for generating alternate terms.

## 2. AI Tasks & Constraints
### Runtime Tasks
- Coined-word suggestion generation.
- Verification synthesis and conflict explanation.
- Evidence summarization.
- Publication page copy assistance.
- Moderation triage assistance.

### Strict Constraints
- **No Model-Only Originality:** The AI must base verdicts on evidence items, not internal model knowledge alone.
- **Evidence Object Outputs:** Responses must be structured evidence objects, not just prose.
- **Auditability:** Record the model name, version, prompt version, and timestamps for every run (`AIProviderRun`).
- **Deterministic Fallbacks:** Implement deterministic checks (exact/near match) before relying on LLM-based semantic checks.

## 3. Verification Pipeline Integration
AI is utilized heavily in Stages E (Semantic/Context checks) and F (Evidence Synthesis) of the verification pipeline to analyze intended meanings and rank conflicts, producing a structured verdict and limitations note.

*See `SEARCH_AND_EVIDENCE_POLICY.md` for verification stages.*