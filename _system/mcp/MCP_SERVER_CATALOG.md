# MCP Server Catalog

Use this file to record actual servers approved for the project.

## Entry template

- Name:
- Purpose:
- Command or URL:
- Environment schema:
- Baseline scopes:
- Elevated scopes:
- Risk rating:
- Audit expectations:
- Failure fallback:

## Starter baseline

### project-filesystem

- Name: project-filesystem
- Purpose: scoped project file access
- Command or URL: local filesystem server
- Environment schema: none
- Baseline scopes: project root read or read/write as project policy allows
- Elevated scopes: none beyond repo scope
- Risk rating: medium
- Audit expectations: note if write access is enabled
- Failure fallback: shell or native file tooling inside the repo

### doc-lookup

- Name: doc-lookup
- Purpose: fetch official documentation or library references
- Command or URL: user-level or hosted MCP
- Environment schema: token if required, not stored here
- Baseline scopes: read-only
- Elevated scopes: none
- Risk rating: low
- Audit expectations: none beyond usage note
- Failure fallback: repo docs and primary-source web browsing when allowed
