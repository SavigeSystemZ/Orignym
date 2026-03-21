import prisma from "@/lib/prisma";
import stringSimilarity from "string-similarity";
import { EvidenceItem } from "@/lib/interfaces/verification";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function checkNearMatch(normalizedTerm: string, _domain: string): Promise<Partial<EvidenceItem>[]> {
  const allClaims = await prisma.coinedTermClaim.findMany({
    select: { normalized_term: true, proposed_term: true, domain_category: true },
    take: 1000
  });

  const evidence: Partial<EvidenceItem>[] = [];

  for (const claim of allClaims) {
    if (claim.normalized_term === normalizedTerm) continue;

    const similarity = stringSimilarity.compareTwoStrings(normalizedTerm, claim.normalized_term);
    if (similarity > 0.8) {
      evidence.push({
        sourceType: 'internal_registry',
        sourceLabel: `Near match (${Math.round(similarity * 100)}% similarity)`,
        matchedTextSnippet: claim.proposed_term,
        classification: 'near',
        relevanceScore: similarity,
      });
    }
  }

  return evidence;
}
