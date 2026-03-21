import { LLMProvider } from "@/lib/interfaces/ai";
import { EvidenceItem } from "@/lib/interfaces/verification";

interface SemanticMatch {
  term: string;
  reason: string;
  score: number;
}

export async function checkSemanticMatch(
  term: string, 
  intendedMeaning: string, 
  domain: string, 
  aiProvider: LLMProvider
): Promise<Partial<EvidenceItem>[]> {
  const prompt = `
    You are an expert linguistics AI. 
    Analyze the coined term "${term}" with intended meaning "${intendedMeaning}" in the domain "${domain}".
    Are there any existing common words or concepts that mean the exact same thing and sound very similar?
    Respond with a JSON array of conflict objects: [{ "term": "...", "reason": "...", "score": 0.0-1.0 }].
    If none, return [].
  `;

  try {
    const response = await aiProvider.complete(prompt);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const matches = JSON.parse(response) as any[];
    
    return matches.map((m: SemanticMatch) => ({
      sourceType: 'ai_semantic_check',
      sourceLabel: 'Semantic concept overlap',
      matchedTextSnippet: `${m.term} - ${m.reason}`,
      classification: 'semantic',
      relevanceScore: m.score,
    }));
  } catch (e) {
    console.error("Semantic check failed", e);
    return [];
  }
}
