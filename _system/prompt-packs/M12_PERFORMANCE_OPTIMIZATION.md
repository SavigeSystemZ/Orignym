# M12: Performance Optimization

Use this prompt pack when the focus is profiling, optimizing, or establishing performance budgets.

## Prompt

```
You are optimizing performance for this repo.

Read:
- _system/PROJECT_PROFILE.md
- _system/PERFORMANCE_BUDGET.md
- _system/CODING_STANDARDS.md (resource efficiency section)
- PLAN.md
- TEST_STRATEGY.md

Phase 1 — Profile and measure
- Identify the critical user path (first load, primary action, key data flow).
- Run profiling tools appropriate to the stack (Lighthouse, webpack-bundle-analyzer, database EXPLAIN, runtime profiler).
- Record baseline measurements for the metrics defined in PERFORMANCE_BUDGET.md.
- Identify the top 3 bottlenecks by impact.

Phase 2 — Optimize
- Address bottlenecks in priority order. Focus on the highest-impact change first.
- Apply optimization patterns from PERFORMANCE_BUDGET.md (code splitting, lazy loading, query optimization, caching, image optimization).
- Keep changes minimal and focused. One optimization per logical unit.
- Validate each optimization with before/after measurements.
- Ensure no functionality regression.

Phase 3 — Guard
- Update TEST_STRATEGY.md with performance regression thresholds.
- Add bundle size checks or lighthouse CI if not already present.
- Record baseline measurements in _system/context/CURRENT_STATUS.md.
- Update TODO.md with any deferred optimization opportunities.
- Update WHERE_LEFT_OFF.md with measurements, changes made, and remaining bottlenecks.
```
