import { LLMProvider, StructuredOutputProvider } from "@/lib/interfaces/ai";

export class MockLLMProvider implements LLMProvider {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async complete(_prompt: string, _context?: Record<string, unknown>): Promise<string> {
    return "[]";
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async chat(_messages: Array<{ role: 'user' | 'assistant' | 'system', content: string }>): Promise<string> {
    return "Mock response";
  }
}

export class MockStructuredOutputProvider implements StructuredOutputProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private evidence: any[]) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async generateObject<T>(_prompt: string, _schema: unknown): Promise<T> {
    const hasStrongConflicts = this.evidence.some(e => e.classification === 'exact' || (e.classification === 'near' && e.relevanceScore > 0.9));
    
    return {
      tier: hasStrongConflicts ? "strong_conflict_detected" : (this.evidence.length > 0 ? "possible_conflict_detected" : "no_strong_conflict_found"),
      confidenceScore: 0.85,
      reasons: `Evaluated ${this.evidence.length} evidence items.`,
      limitationsNote: "This verification does not grant legal ownership, guarantee originality, or provide trademark clearance. It is based solely on the sources checked at this time."
    } as unknown as T;
  }
}

import { SuggestionProvider } from "@/lib/interfaces/ai";

export class MockSuggestionProvider implements SuggestionProvider {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async generateAlternatives(term: string, _context: Record<string, unknown>): Promise<Array<{ term: string, reason: string }>> {
    return [
      { term: `${term}ly`, reason: "Adverbial variant that is often novel." },
      { term: `Neo${term}`, reason: "Prefix addition for modern context." },
      { term: `${term}X`, reason: "Modern tech-centric suffix." },
      { term: `Orignym_${term}`, reason: "Platform-branded variant." },
    ];
  }
}
