import prisma from "@/lib/prisma";
import { AIProviderFactory } from "../ai/factory";

export class SuggestionService {
  async generateAndPersistSuggestions(claimId: string) {
    const claim = await prisma.coinedTermClaim.findUnique({
      where: { claim_id: claimId },
      include: { verification_runs: { orderBy: { createdAt: 'desc' }, take: 1, include: { evidence_items: true } } }
    });

    if (!claim) throw new Error("Claim not found");

    // Extract conflicts from the latest verification run to avoid them in suggestions
    const latestRun = claim.verification_runs[0];
    const conflicts = latestRun?.evidence_items.map(ei => ei.matched_text_snippet?.toLowerCase()) || [];

    const provider = AIProviderFactory.getSuggestionProvider();
    const context = {
      intended_meaning: claim.intended_meaning,
      domain: claim.domain_category,
      existing_conflicts: conflicts
    };

    const rawSuggestions = await provider.generateAlternatives(claim.proposed_term, context);

    // Filter out obvious collisions with the original term or known conflicts
    const filtered = rawSuggestions.filter(s => {
      const lowerS = s.term.toLowerCase();
      return lowerS !== claim.normalized_term && !conflicts.includes(lowerS);
    });

    // Ranking logic (simple heuristic for MVP: prefer shorter terms or terms that don't just add a suffix)
    const ranked = filtered.map(s => ({
      ...s,
      ranking_score: s.term.length < 10 ? 0.9 : 0.7
    })).sort((a, b) => b.ranking_score - a.ranking_score);

    // Persist to database
    const suggestions = [];
    for (const s of ranked) {
      const suggestion = await prisma.suggestedAlternative.create({
        data: {
          claim_id: claim.claim_id,
          term: s.term,
          reason: s.reason,
          ranking_score: s.ranking_score,
        }
      });
      suggestions.push(suggestion);
    }

    return suggestions;
  }
}
