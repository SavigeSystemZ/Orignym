import prisma from "@/lib/prisma";
import { EvidenceItem } from "@/lib/interfaces/verification";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function checkExactMatch(normalizedTerm: string, _domain: string): Promise<Partial<EvidenceItem>[]> {
  const matches = await prisma.coinedTermClaim.findMany({
    where: {
      normalized_term: normalizedTerm,
    },
    take: 5
  });

  return matches.map(match => ({
    sourceType: 'internal_registry',
    sourceLabel: 'Exact Match found in Claims',
    matchedTextSnippet: match.proposed_term,
    classification: 'exact',
    relevanceScore: 1.0,
  }));
}
