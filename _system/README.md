# System Directory

`_system/` is the local agent operating system for the repository.

It exists to keep repo governance, prompting, agent workflow, MCP policy, validation, and continuity separate from runtime application code.

## What belongs here

- system prompts
- repo operating rules
- execution, debug, review, and checkpoint playbooks
- versioning, upgrade, drift, integrity, packaging, and CI scaffolds
- system registry, self-awareness, hallucination defense, and doctor flows
- MCP guidance and config examples
- prompt templates and prompt packs
- durable context state
- security, redaction, provenance, and audit rules
- observability, systemd, and plugin-extension contracts
- installation, packaging, mobile, and chatbot expansion guides
- working-file guidance and template-neutrality rules

## What does not belong here

- runtime source code
- production assets the app needs to execute
- secrets or user-level tokens
- machine-local settings files

## Design objective

Every project should have a project-local agent operating system that can be copied, evolved, and versioned with the project itself without coupling the app runtime to the system files.

The master template remains generic. Once copied into a real repo, these files become repo-local operating surfaces and should then be populated with app-specific truth.

## First read inside `_system/`

1. `PROJECT_PROFILE.md`
2. `CONTEXT_INDEX.md`
3. `LOAD_ORDER.md`
4. `WORKING_FILES_GUIDE.md`
5. `TEMPLATE_NEUTRALITY_POLICY.md`
6. `MASTER_SYSTEM_PROMPT.md`
7. `PROJECT_RULES.md`
8. `AGENT_DISCOVERY_MATRIX.md`
9. `UPGRADE_AND_DRIFT_POLICY.md`
10. `OBSERVABILITY_STANDARDS.md`
11. `SYSTEM_AWARENESS_PROTOCOL.md`
12. `HALLUCINATION_DEFENSE_PROTOCOL.md`
