import { EvidenceItem } from "@/lib/interfaces/verification";

/**
 * Mock provider for Trademark database queries (USPTO/WIPO).
 * In a real application, this would connect to an official IP database.
 */
export async function checkTrademarkDatabase(term: string, domainCategory: string): Promise<Partial<EvidenceItem>[]> {
  const evidence: Partial<EvidenceItem>[] = [];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock logic: introduce a fake hit for specific categories to demonstrate the UI
  if (domainCategory.toLowerCase() === 'technology' && term.toLowerCase().startsWith('tech')) {
    evidence.push({
      sourceType: 'external_trademark',
      sourceLabel: 'USPTO Database Mock',
      matchedTextSnippet: `A live trademark exists for "${term}" in international class 009.`,
      classification: 'exact',
      relevanceScore: 0.95,
    });
  }

  return evidence;
}
