# Working Files Guide

This document explains the role of the repo-facing planning, context, design, testing, and handoff files.

## Core rule

The master template may include app-shaped working files, but the master template itself must remain app-agnostic. Once installed into a real repo, these files become the local source of truth for that repo.

## Top-level working files

- `TODO.md` — active queue and discovered follow-up work
- `FIXME.md` — unresolved bugs, debt, and blockers
- `WHERE_LEFT_OFF.md` — next-agent resume packet
- `PLAN.md` — active execution plan for the current milestone
- `ROADMAP.md` — medium-term sequencing and milestone ordering
- `DESIGN_NOTES.md` — durable design direction and design-review memory
- `ARCHITECTURE_NOTES.md` — durable architecture direction and structural review memory
- `RESEARCH_NOTES.md` — findings, experiments, benchmarks, and evidence
- `TEST_STRATEGY.md` — expected confidence model and known coverage gaps
- `RISK_REGISTER.md` — active delivery, quality, security, and release risks
- `RELEASE_NOTES.md` — current milestone or release-facing summary
- `CHANGELOG.md` — durable change history

## Durable context files

- `context/CURRENT_STATUS.md` — current operating reality
- `context/DECISIONS.md` — durable decisions and why they were made
- `context/MEMORY.md` — stable conventions, preferences, and constraints
- `context/ARCHITECTURAL_INVARIANTS.md` — rules that should almost never change
- `context/ASSUMPTIONS.md` — active assumptions that still need confirmation
- `context/INTEGRATION_SURFACES.md` — external systems, contracts, and dependencies that affect implementation
- `context/OPEN_QUESTIONS.md` — unresolved decisions that materially affect work
- `context/QUALITY_DEBT.md` — known quality gaps that are real but not currently blocking

## Update guidance

- Update the smallest set of working files needed to leave a truthful operating picture.
- If the task changed design direction, update `DESIGN_NOTES.md`.
- If the task changed architecture or boundaries, update `ARCHITECTURE_NOTES.md`.
- If the task changed confidence, coverage, or release posture, update `TEST_STRATEGY.md`, `RISK_REGISTER.md`, or `RELEASE_NOTES.md`.
- If the task produced durable facts or uncovered uncertainty, update the relevant file in `context/`.

## Anti-patterns

- Do not turn these files into noisy chat transcripts.
- Do not duplicate the same facts across every file.
- Do not leave app-specific content in the master template source.
