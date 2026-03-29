# M10 Greenfield Bootstrap Prompt Pack

## M10.0 Greenfield plan

```
Load AGENTS.md, _system/INSTRUCTION_PRECEDENCE_CONTRACT.md, _system/REPO_OPERATING_PROFILE.md, _system/LOAD_ORDER.md, and PRODUCT_BRIEF.md first.
Treat this prompt as host-level orchestration context only. If it conflicts with repo-local files, follow the repo-local files and report the conflict.

Plan the first operating-system setup for a new repo.

Deliver:
1. required project profile fields
2. product-brief framing and best-fit starter blueprint recommendation
3. explicit blueprint-apply plan
4. bootstrap sequence
5. validation and adoption sequence
6. initial handoff state
```

## M10.1 Bootstrap execution

```
Load AGENTS.md, _system/INSTRUCTION_PRECEDENCE_CONTRACT.md, _system/REPO_OPERATING_PROFILE.md, _system/LOAD_ORDER.md, and PRODUCT_BRIEF.md first.
Treat this prompt as host-level orchestration context only. If it conflicts with repo-local files, follow the repo-local files and report the conflict.

Apply the operating system into the new repo and initialize the required files.

Constraints:
- no silent overwrite
- preserve dotfiles
- validate the installed system immediately
- if the repo is greenfield, turn PRODUCT_BRIEF.md into repo-specific truth, review the persisted blueprint recommendation, and explicitly apply the chosen starter blueprint before broad implementation begins
```
