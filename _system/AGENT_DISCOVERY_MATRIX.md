# Agent Discovery Matrix

This file tells each supported tool which files it should load first, which adapter file belongs to it, which other adapter files exist, and what shared rules are authoritative.

## Shared truth for every tool

Every tool must treat these as canonical:

- `AGENTS.md`
- `_system/PROJECT_PROFILE.md`
- `_system/CONTEXT_INDEX.md`
- `_system/WORKING_FILES_GUIDE.md`
- `_system/TEMPLATE_NEUTRALITY_POLICY.md`
- `_system/MASTER_SYSTEM_PROMPT.md`
- `_system/PROJECT_RULES.md`
- `_system/EXECUTION_PROTOCOL.md`
- `_system/MULTI_AGENT_COORDINATION.md`
- `TODO.md`
- `FIXME.md`
- `WHERE_LEFT_OFF.md`

## Shared working surfaces

Load these when the task touches their domain:

- `PLAN.md`
- `ROADMAP.md`
- `DESIGN_NOTES.md`
- `ARCHITECTURE_NOTES.md`
- `RESEARCH_NOTES.md`
- `TEST_STRATEGY.md`
- `RISK_REGISTER.md`
- `RELEASE_NOTES.md`
- `_system/context/ASSUMPTIONS.md`
- `_system/context/INTEGRATION_SURFACES.md`

## Codex

- Primary adapter: `CODEX.md`
- Shared repo contract: `AGENTS.md`
- Tool-specific overlay: none beyond `CODEX.md`
- Must know these also exist: `CLAUDE.md`, `GEMINI.md`, `WINDSURF.md`, `.cursorrules`, `.github/copilot-instructions.md`
- Best use: precise implementation, repair, review, diff-heavy work

## Cursor

- Primary adapter: `.cursorrules`
- Secondary adapter surface: `.cursor/`
- Shared repo contract: `AGENTS.md`
- Must know these also exist: `CODEX.md`, `CLAUDE.md`, `GEMINI.md`, `WINDSURF.md`, `.github/copilot-instructions.md`
- Best use: file-aware navigation, command-driven workflows, skills, reusable rules

## Claude

- Primary adapter: `CLAUDE.md`
- Shared repo contract: `AGENTS.md`
- Must know these also exist: `CODEX.md`, `GEMINI.md`, `WINDSURF.md`, `.cursorrules`, `.github/copilot-instructions.md`
- Best use: architecture, design reasoning, policy review, long-context synthesis

## Gemini

- Primary adapter: `GEMINI.md`
- Shared repo contract: `AGENTS.md`
- Must know these also exist: `CODEX.md`, `CLAUDE.md`, `WINDSURF.md`, `.cursorrules`, `.github/copilot-instructions.md`
- Best use: broad synthesis, alternatives, design critique, planning

## Windsurf

- Primary adapter: `WINDSURF.md`
- Secondary adapter: `.windsurfrules`
- Shared repo contract: `AGENTS.md`
- Must know these also exist: `CODEX.md`, `CLAUDE.md`, `GEMINI.md`, `.cursorrules`, `.github/copilot-instructions.md`
- Best use: IDE-based implementation and repo navigation under the shared rules

## Copilot

- Primary adapter: `.github/copilot-instructions.md`
- Shared repo contract: `AGENTS.md`
- Must know these also exist: `CODEX.md`, `CLAUDE.md`, `GEMINI.md`, `WINDSURF.md`, `.cursorrules`
- Best use: inline assistance under the same operating rules

## Unknown or future agent

- Fallback load path:
  1. `AGENTS.md`
  2. `_system/CONTEXT_INDEX.md`
  3. `_system/LOAD_ORDER.md`
  4. `_system/WORKING_FILES_GUIDE.md`
  5. `_system/MASTER_SYSTEM_PROMPT.md`
  6. `TODO.md`
  7. `FIXME.md`
  8. `WHERE_LEFT_OFF.md`

## Coexistence rule

No adapter may contradict the shared core. If an adapter needs a different emphasis, it may add tool-specific handling only on top of the shared rules.
