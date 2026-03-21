# Context Index

This file is the map of the local agent operating system.

## Core contract

- `PROJECT_PROFILE.md` — app-specific truth
- `LOAD_ORDER.md` — what to read and in what order
- `WORKING_FILES_GUIDE.md` — what each planning and continuity file is for
- `TEMPLATE_NEUTRALITY_POLICY.md` — how the master template stays reusable
- `MASTER_SYSTEM_PROMPT.md` — central operating prompt
- `PROJECT_RULES.md` — repo-wide non-negotiable rules
- `MEMORY_RULES.md` — what belongs in durable memory
- `EXECUTION_PROTOCOL.md` — how work should be done
- `AGENT_DISCOVERY_MATRIX.md` — which tools load which files
- `DESIGN_EXCELLENCE_FRAMEWORK.md` — product and interface quality rules
- `SYSTEM_AWARENESS_PROTOCOL.md` — how the operating system tracks its own managed surfaces
- `HALLUCINATION_DEFENSE_PROTOCOL.md` — how to detect and recover from ungrounded claims
- `SYSTEM_REGISTRY.json` — machine-readable registry of AIAST-managed files
- `../bootstrap/check-runtime-foundations.sh` — runtime scaffold validation for generated packaging, install, mobile, and AI assets

## Quality standards

- `CODING_STANDARDS.md` — naming, error handling, resource management, type safety, anti-patterns
- `PERFORMANCE_BUDGET.md` — performance budgets, optimization patterns, monitoring
- `ACCESSIBILITY_STANDARDS.md` — WCAG compliance, keyboard access, ARIA, contrast
- `API_DESIGN_STANDARDS.md` — REST conventions, error responses, versioning, rate limiting
- `DEPENDENCY_GOVERNANCE.md` — supply chain security, license compliance, size hygiene
- `MODERN_UI_PATTERNS.md` — component architecture, responsive design, color, typography, motion
- `OBSERVABILITY_STANDARDS.md` — logging, metrics, tracing, profiling, retention
- `INSTALLATION_GUIDE.md` — generated installer flows and Linux runtime scaffolds
- `PACKAGING_GUIDE.md` — universal packaging guidance and release signing notes
- `MOBILE_GUIDE.md` — Flutter-first Android delivery guide
- `CHATBOT_GUIDE.md` — pluggable LLM and chatbot/action-bus guidance
- `llm_config.yaml.example` — provider configuration schema example

## Coordination and continuity

- `MULTI_AGENT_COORDINATION.md` — turn-taking and handoff rules
- `CHECKPOINT_PROTOCOL.md` — milestone checkpoint flow
- `VALIDATION_GATES.md` — required validation rules
- `DEBUG_REPAIR_PLAYBOOK.md` — failure triage and repair
- `PROVENANCE_AND_EVIDENCE.md` — audit and lineage rules
- `RELEASE_READINESS_PROTOCOL.md` — readiness and signoff rules
- `FAILURE_MODES_AND_RECOVERY.md` — operating-system failure recovery
- `SYSTEM_EVOLUTION_POLICY.md` — how the operating system itself evolves

## Security and tooling

- `MCP_CONFIG.md` — MCP model and policy
- `SECURITY_REDACTION_AND_AUDIT.md` — secrets, export, and audit rules
- `SECURITY_HARDENING_CONTRACT.md` — runtime and service hardening baseline
- `THREAT_MODEL_TEMPLATE.md` — project threat-model starting point
- `REPO_BOUNDARY_AND_BACKUP.md` — separation between runtime, system, and backups
- `PLUGIN_CONTRACT.md` — contract for optional AIAST extensions
- `ci/README.md` — CI template overview
- `packaging/README.md` — packaging and distribution guide
- `packaging/templates/appimage.yml.example` — AppImage packaging example
- `packaging/templates/flatpak-manifest.json.example` — Flatpak packaging example
- `systemd/README.md` — hardened unit generation and examples
- `mcp/MCP_SERVER_CATALOG.md` — actual MCP inventory
- `mcp/MCP_SELECTION_POLICY.md` — how to choose MCP servers
- `mcp/MCP_FAILURE_FALLBACKS.md` — what to do when MCP fails

## Working state

- `../TODO.md`
- `../FIXME.md`
- `../WHERE_LEFT_OFF.md`
- `../CHANGELOG.md`
- `../PLAN.md`
- `../ROADMAP.md`
- `../DESIGN_NOTES.md`
- `../ARCHITECTURE_NOTES.md`
- `../RESEARCH_NOTES.md`
- `../TEST_STRATEGY.md`
- `../RISK_REGISTER.md`
- `../RELEASE_NOTES.md`
- `context/CURRENT_STATUS.md`
- `context/DECISIONS.md`
- `context/MEMORY.md`
- `context/ARCHITECTURAL_INVARIANTS.md`
- `context/ASSUMPTIONS.md`
- `context/INTEGRATION_SURFACES.md`
- `context/OPEN_QUESTIONS.md`
- `context/QUALITY_DEBT.md`

## Prompting

- `PROMPTS_INDEX.md`
- `prompt-templates/`
- `prompt-packs/`

## Bootstrap

- `../bootstrap/init-project.sh`
- `../bootstrap/update-template.sh`
- `../bootstrap/repair-system.sh`
- `../bootstrap/uninstall-system.sh`
- `../bootstrap/configure-project-profile.sh`
- `../bootstrap/validate-system.sh`
- `../bootstrap/detect-drift.sh`
- `../bootstrap/verify-integrity.sh`
- `../bootstrap/generate-system-registry.sh`
- `../bootstrap/check-system-awareness.sh`
- `../bootstrap/check-hallucination.sh`
- `../bootstrap/system-doctor.sh`
- `../bootstrap/heal-system.sh`
- `../bootstrap/scan-security.sh`
- `../bootstrap/generate-systemd-unit.sh`
- `../bootstrap/generate-runtime-foundations.sh`

## Structured reviews

- `review-playbooks/ARCHITECTURE_REVIEW_PLAYBOOK.md`
- `review-playbooks/UI_UX_REVIEW_PLAYBOOK.md`
- `review-playbooks/PERFORMANCE_REVIEW_PLAYBOOK.md`
- `review-playbooks/SECURITY_REVIEW_PLAYBOOK.md`
- `review-playbooks/ACCESSIBILITY_REVIEW_PLAYBOOK.md`
- `review-playbooks/DEPENDENCY_REVIEW_PLAYBOOK.md`
- `review-playbooks/CODE_QUALITY_REVIEW_PLAYBOOK.md`

## Starter blueprints

- `starter-blueprints/README.md`
- `starter-blueprints/REACT_VITE_TYPESCRIPT.md`
- `starter-blueprints/FASTAPI_API.md`
- `starter-blueprints/STATIC_FRONTEND.md`
- `starter-blueprints/NEXT_JS_FULLSTACK.md`
- `starter-blueprints/PYTHON_CLI_TOOL.md`
- `starter-blueprints/RUST_CLI_TOOL.md`
- `starter-blueprints/GO_SERVICE.md`
- `starter-blueprints/GRAPHQL_API.md`
- `starter-blueprints/GRPC_SERVICE.md`
- `starter-blueprints/BACKGROUND_WORKER.md`
- `starter-blueprints/DATABASE_MIGRATIONS.md`
- `starter-blueprints/TAURI_DESKTOP.md`
- `starter-blueprints/FLUTTER_ANDROID_CLIENT.md`
- `starter-blueprints/UNIVERSAL_APP_PLATFORM.md`

## Tool overlays

- `../.cursorrules`
- `../.cursor/`
- `../CLAUDE.md`
- `../GEMINI.md`
- `../CODEX.md`
- `../WINDSURF.md`
- `../.github/copilot-instructions.md`
