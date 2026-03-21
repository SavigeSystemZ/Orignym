# Template Neutrality Policy

This policy keeps the master operating-system template reusable across many applications.

## Master template rule

Inside the master template source:

- working files may exist in app-shaped form
- section structures, entry formats, and usage rules are expected
- app-specific product facts must not be stored here

## Allowed content in the master template

- generic file structure
- example entry formats
- reusable operating rules
- placeholder headings
- repo-agnostic design, architecture, testing, and risk guidance

## Disallowed content in the master template

- real app names or product domains
- real repository URLs, ports, secrets, or credentials
- app-specific milestone plans
- app-specific design direction
- app-specific architecture or data model facts
- app-specific release notes or risk posture

## After install into a real repo

Once this system is copied into a target repo:

1. Fill in `_system/PROJECT_PROFILE.md`.
2. Replace placeholders with repo-specific truth.
3. Keep the working files current as the repo evolves.
4. Do not sync app-specific content back into the master template source.

## Why this exists

Without this rule, the master template becomes contaminated with one app's reality and stops being a clean operating base for the next app.
