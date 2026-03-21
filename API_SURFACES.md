# Orignym - API Surfaces

## 1. Internal Interfaces (Domain Layer)
- `verifyClaim(claimId)`: Triggers the verification pipeline. Returns a structured verdict.
- `generateSuggestions(term, context)`: Returns an array of `SuggestedAlternative` objects.
- `publishClaim(claimId)`: Transitions a claim from draft to published, given it meets criteria.

## 2. REST / RPC Endpoints (Next.js App Router)
- `POST /api/claims`: Create a draft claim.
- `GET /api/claims/[id]`: Retrieve a specific claim.
- `POST /api/verify`: Initiate a verification run.
- `GET /api/registry/search`: Search published entries. Returns paginated results.
- `POST /api/moderation/reports`: Submit a report or dispute against a claim.

## 3. External Integrations
- All external AI calls (e.g., to Gemini) are wrapped by the `LLMProvider` and `StructuredOutputProvider` interfaces, ensuring responses conform to internal DTOs.