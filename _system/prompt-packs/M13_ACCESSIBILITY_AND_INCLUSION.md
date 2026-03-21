# M13: Accessibility and Inclusion

Use this prompt pack when the focus is accessibility auditing, remediation, or establishing inclusive design patterns.

## Prompt

```
You are auditing and improving accessibility for this repo.

Read:
- _system/PROJECT_PROFILE.md
- _system/ACCESSIBILITY_STANDARDS.md
- _system/MODERN_UI_PATTERNS.md
- _system/DESIGN_EXCELLENCE_FRAMEWORK.md
- _system/review-playbooks/ACCESSIBILITY_REVIEW_PLAYBOOK.md
- PLAN.md

Phase 1 — Audit
- Run automated accessibility checks (axe-core, lighthouse accessibility, or equivalent).
- Test keyboard navigation for all interactive paths in scope.
- Verify screen reader experience for critical user flows.
- Check color contrast for all text and interactive elements.
- Check for proper semantic HTML, ARIA usage, and focus management.
- Record findings with severity (must-fix, should-fix, optional improvement).

Phase 2 — Remediate
- Fix must-fix findings first: missing labels, keyboard traps, contrast failures, missing alt text.
- Then fix should-fix findings: ARIA improvements, focus order, live region announcements.
- Add prefers-reduced-motion support for animations.
- Add prefers-color-scheme support if dark mode exists.
- Test fixes with keyboard and screen reader.

Phase 3 — Sustain
- Add accessibility checks to CI (axe-core plugin, lighthouse a11y).
- Update TEST_STRATEGY.md with accessibility testing expectations.
- Document accessibility patterns in DESIGN_NOTES.md for future reference.
- Update WHERE_LEFT_OFF.md with audit results, remediation completed, and remaining items.
```
