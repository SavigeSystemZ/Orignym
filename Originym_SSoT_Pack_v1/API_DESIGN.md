# API_DESIGN.md — Originym

## 1. API Style
Use typed JSON APIs with clear versioning. Internal app routes may be served from the main web app.

## 2. Core Endpoints (MVP)

### Auth / Session
- `POST /api/auth/*` (framework-managed)

### Drafts
- `GET /api/terms`
- `POST /api/terms`
- `GET /api/terms/:id`
- `PATCH /api/terms/:id`
- `DELETE /api/terms/:id`

### Validation
- `POST /api/terms/:id/validate`
- `GET /api/validation-runs/:id`

### Suggestions
- suggestions are usually embedded in validation response or fetched via:
- `GET /api/validation-runs/:id/suggestions`

### Publish
- `POST /api/terms/:id/publish`
- `POST /api/published/:id/unpublish` (admin/moderated if needed)

### Registry
- `GET /api/registry/search?q=...`
- `GET /api/registry/:slug`

### Reports
- `POST /api/registry/:id/report`
- `GET /api/admin/report-cases`
- `PATCH /api/admin/report-cases/:id`

### Exports
- `POST /api/terms/:id/export`
- `GET /api/exports/:id`

## 3. Response Shape
Use consistent envelope where useful:
- `data`
- `error`
- `meta`

## 4. Error Shape
```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Human-readable message",
    "details": {}
  }
}
```

## 5. Security
- authenticate non-public endpoints
- authorize admin/moderation endpoints
- validate payloads server-side
- rate limit expensive endpoints
