# AIAST Changelog

## 1.2.0 - 2026-03-20

### Added

- Runtime-foundation validation via `bootstrap/check-runtime-foundations.sh`
- Starter blueprints for Flutter Android clients and universal multi-surface app platforms
- Runtime scaffold checks for install scripts, env defaults, AI config, mobile manifest, and packaging manifests

### Changed

- `system-doctor.sh` now inspects generated runtime foundations in addition to system integrity
- Bootstrap and context docs now expose the new runtime checker and expanded blueprint layer

## 1.1.0 - 2026-03-20

### Added

- Runtime foundation generator for packaging, install, mobile, logging, and AI scaffolds
- Installation, packaging, mobile, and chatbot guides plus provider-config example
- Flutter-first Android starter files and packaging/signing templates
- Linux packaging manifests for AppImage, Flatpak, and Snap in generated repos
- CI examples for packaging and Android build surfaces

### Changed

- `init-project.sh` now generates project-owned runtime foundations automatically
- Project profile defaults now stamp app ids, installer paths, mobile paths, and branch-strategy guidance
- Security and observability guidance now cover installer separation, service accounts, JSON logging fields, and `logcat`

## 1.0.0 - 2026-03-19

### Added

- First-class AIAST version metadata and installed-repo metadata
- Upgrade and uninstall lifecycle scripts
- Integrity-aware drift detection and manifest policy
- Expanded project profile schema and broader repo detection
- Security scan and hardened systemd unit generation tooling
- CI, packaging, observability, and plugin-contract scaffolds

### Changed

- Bootstrap lifecycle now records install source, timestamps, and README placement
- Drift and upgrade policy now use explicit template version markers instead of commit-message convention
- Integrity manifests exclude app-owned state and project-local config surfaces
