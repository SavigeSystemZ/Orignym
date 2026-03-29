import { EvidenceItem } from "@/lib/interfaces/verification";

export interface WikipediaSearchResult {
  title: string;
  snippet: string;
  pageid: number;
}

/**
 * Searches the English Wikipedia API for terms that might conflict with the proposed claim.
 */
export async function checkWikipedia(term: string): Promise<Partial<EvidenceItem>[]> {
  const evidence: Partial<EvidenceItem>[] = [];
  
  try {
    const url = new URL("https://en.wikipedia.org/w/api.php");
    url.searchParams.append("action", "query");
    url.searchParams.append("list", "search");
    url.searchParams.append("srsearch", term);
    url.searchParams.append("format", "json");
    url.searchParams.append("origin", "*");

    const res = await fetch(url.toString());
    const data = await res.json();

    if (data.query && data.query.search) {
      const results: WikipediaSearchResult[] = data.query.search;
      
      for (const result of results.slice(0, 3)) { // Take top 3 results
        // Strip HTML tags from snippet
        const cleanSnippet = result.snippet.replace(/<\/?[^>]+(>|$)/g, "");
        
        evidence.push({
          sourceType: 'external_wikipedia',
          sourceLabel: `Wikipedia: ${result.title}`,
          sourceUrlIdentifier: `https://en.wikipedia.org/?curid=${result.pageid}`,
          matchedTextSnippet: cleanSnippet,
          classification: 'semantic', // Treat external text hits as semantic context checks
          relevanceScore: 0.85, // Heuristic default for top wiki hits
        });
      }
    }
  } catch (error) {
    console.error("Failed to fetch from Wikipedia API:", error);
    // Non-fatal error; pipeline should continue
  }

  return evidence;
}
