import prisma from "@/lib/prisma";
import { getPhoneticCodes } from "@/lib/utils/matching";
import { EvidenceItem } from "@/lib/interfaces/verification";

export async function checkPhoneticMatch(primaryMetaphone: string, secondaryMetaphone: string | null): Promise<Partial<EvidenceItem>[]> {
  const allClaims = await prisma.coinedTermClaim.findMany({
    select: { normalized_term: true, proposed_term: true },
    take: 1000
  });

  const evidence: Partial<EvidenceItem>[] = [];

  for (const claim of allClaims) {
    const claimCodes = getPhoneticCodes(claim.normalized_term);
    
    if (primaryMetaphone === claimCodes.primary || (secondaryMetaphone && claimCodes.secondary && secondaryMetaphone === claimCodes.secondary)) {
      evidence.push({
        sourceType: 'internal_registry',
        sourceLabel: 'Phonetic match',
        matchedTextSnippet: claim.proposed_term,
        classification: 'phonetic',
        relevanceScore: 0.9,
      });
    }
  }

  return evidence;
}
