# Plugin Contract

Plugins extend AIAST without modifying core files directly.

## Location

- Store plugin assets under `_system/plugins/<plugin-name>/`.
- Each plugin must include `plugin.json` and `README.md`.

## Manifest fields

- `name`
- `version`
- `description`
- `hooks`
- `owned_paths`
- `requires`

## Allowed hook points

- `bootstrap.post_install`
- `validation.preflight`
- `security.scan`
- `packaging.prepare`
- `release.preflight`

## Rules

- Plugins must not mutate runtime code unless explicitly invoked for repo generation.
- Plugin-owned files must be declared in `owned_paths`.
- Plugin files must not bypass integrity, security, or upgrade policy.
- Core AIAST files remain authoritative on conflicts unless the repo explicitly adopts the plugin-owned path.
