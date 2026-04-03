# Cursor Overlays

This directory contains repo-local Cursor overlays for commands, rules, skills,
agents, and MCP configuration.

Use these files as a thin IDE host layer only. The authoritative operating
contract still lives in `AGENTS.md`, `_system/INSTRUCTION_PRECEDENCE_CONTRACT.md`,
and `_system/REPO_OPERATING_PROFILE.md`.

If the repo is used from multiple IDE hosts or orchestrators, also read
`_system/CURSOR_AND_MULTI_HOST.md` before changing Cursor-specific behavior.

Do not put product truth, secrets, or app runtime logic in this directory.
