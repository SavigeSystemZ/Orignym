# Plan

Use this file as the current implementation plan for the active milestone or problem set.

## Objective

- Current target outcome: Complete Milestone M12 (Machine Learning, Legal Integration & Community).
- Why it matters now: Integrating external legal/domain checks and enabling community interaction transforms Orignym from a utility into a comprehensive, sticky platform for linguistic research and provenance.

## Plan

1.  **Legal & Domain Integration (Data Layer)**
    *   Implement an external API provider for Domain Name availability (mock provider for MVP).
    *   Implement an external API provider for basic Trademark queries (mock provider for MVP).
    *   Integrate these checks into the Verification Pipeline.
2.  **Community Engagement (Social Layer)**
    *   Update `prisma/schema.prisma` to include a `Comment` model linked to `CoinedTermClaim`.
    *   Implement a public comment thread on the Registry detail page.
3.  **Analytics & Insights (Reporting Layer)**
    *   Create a `ClaimAnalytics` tracking model in Prisma.
    *   Build out the "Search Insights" teaser on the `ClaimDetail` page to show impression data.

## Strategic Decisions Made

1.  **Legal Advice Disclaimer:** All trademark and domain data will be wrapped in a prominent UI disclaimer emphasizing that Orignym is a research tool, not legal counsel.
2.  **Community Moderation:** Comments will default to "Public" but can be flagged by users, feeding into the existing `Report` moderation queue.

## Files to touch:

- `prisma/schema.prisma` (Modified)
- `src/lib/verification/providers/domain.ts` (New)
- `src/lib/verification/providers/trademark.ts` (New)
- `src/lib/verification/pipeline.ts` (Modified)
- `src/app/(public)/registry/[id]/page.tsx` (Modified)
- `src/app/(dashboard)/claims/[id]/page.tsx` (Modified)
- `src/components/registry/CommentThread.tsx` (New)