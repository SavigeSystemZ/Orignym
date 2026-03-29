export interface PersonalisationContext {
  tone?: string;
  styleConstraints?: string[];
  maxLength?: number;
  linguisticDiversity?: string;
}

export interface LLMProvider {
  complete(prompt: string, context?: Record<string, unknown>): Promise<string>;
  chat(messages: Array<{ role: 'user' | 'assistant' | 'system', content: string }>): Promise<string>;
}

export interface GroundedSearchProvider {
  search(query: string, groundingContext?: Record<string, unknown>): Promise<Array<{ title: string, snippet: string, url?: string }>>;
}

export interface StructuredOutputProvider {
  generateObject<T>(prompt: string, schema: unknown): Promise<T>;
}

export interface SuggestionProvider {
  generateAlternatives(term: string, context: Record<string, unknown>, personalisation?: PersonalisationContext): Promise<Array<{ term: string, reason: string }>>;
}
