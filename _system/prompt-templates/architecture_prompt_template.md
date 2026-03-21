# Architecture Prompt Template

## Goal

- Problem to solve:
- Why architecture change is needed:
- What outcome looks like:

## Current state

- Existing boundaries and module structure:
- Data flow direction:
- Public contracts (APIs, schemas, exports) affected:
- Dependencies that would change:

## Constraints

- Existing boundaries to preserve:
- Compatibility requirements (backward compat, API versioning):
- Performance or latency constraints:
- Validation expectations:

## Risk assessment

Classify the proposed change:

- **Low risk**: config change, additive API field, new leaf module — rollback is trivial.
- **Medium risk**: refactored internals, changed data flow, new required dependency — rollback requires coordination.
- **High risk**: data migration, schema change, auth model change, removed public API — rollback may lose data or break clients.

For medium and high risk, provide:

- Rollback plan:
- Migration steps:
- Affected consumers and their update plan:

## Deliverables

- proposed architecture change with clear boundary diagram or description
- affected interfaces or contracts with before/after comparison
- migration or rollout plan (for medium and high risk)
- validation plan (commands to run, evidence to capture)
- updated ARCHITECTURE_NOTES.md with decision rationale
