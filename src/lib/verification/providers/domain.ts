import { EvidenceItem } from "@/lib/interfaces/verification";

/**
 * Mock provider for Domain Name availability checks.
 * In a real application, this would call a WHOIS or DNS API.
 */
export async function checkDomainAvailability(term: string): Promise<Partial<EvidenceItem>[]> {
  const evidence: Partial<EvidenceItem>[] = [];
  const normalized = term.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Mock logic: assume common terms are taken
  const isTaken = normalized.length < 8;

  if (isTaken) {
    evidence.push({
      sourceType: 'external_domain',
      sourceLabel: `Domain Registry: ${normalized}.com`,
      sourceUrlIdentifier: `https://whois.domaintools.com/${normalized}.com`,
      matchedTextSnippet: `The domain ${normalized}.com is currently registered.`,
      classification: 'exact',
      relevanceScore: 1.0,
    });
  }

  return evidence;
}
