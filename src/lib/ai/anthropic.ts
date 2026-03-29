import Anthropic from "@anthropic-ai/sdk";
import { LLMProvider, StructuredOutputProvider, SuggestionProvider } from "@/lib/interfaces/ai";
import { ProviderConfig } from "./config";

export class AnthropicClaudeProvider implements LLMProvider, StructuredOutputProvider, SuggestionProvider {
  private client: Anthropic;
  private model: string;

  constructor(config: ProviderConfig) {
    const apiKey = process.env[config.api_key_env] || "";
    this.client = new Anthropic({ apiKey });
    this.model = config.model;
  }

  async complete(prompt: string): Promise<string> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    // @ts-expect-error - content might be complex but we expect text in index 0
    return response.content[0].text;
  }

  async chat(messages: Array<{ role: 'user' | 'assistant' | 'system', content: string }>): Promise<string> {
    const anthropicMessages = messages.map(m => ({
      role: m.role === 'user' ? 'user' as const : 'assistant' as const,
      content: m.content
    }));

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      messages: anthropicMessages,
    });
    // @ts-expect-error - content might be complex but we expect text in index 0
    return response.content[0].text;
  }

  async generateObject<T>(prompt: string, schema: unknown): Promise<T> {
    const finalPrompt = `${prompt}\n\nIMPORTANT: Return ONLY a raw JSON object matching this schema: ${JSON.stringify(schema)}. No preamble, no markdown formatting.`;
    
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      messages: [{ role: "user", content: finalPrompt }],
    });

    // @ts-expect-error - content might be complex but we expect text in index 0
    let text = response.content[0].text;
    // Basic cleanup in case it wraps in markdown blocks
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text) as T;
  }

  async generateAlternatives(term: string, context: Record<string, unknown>, personalisation?: import("@/lib/interfaces/ai").PersonalisationContext): Promise<Array<{ term: string, reason: string }>> {
    const tone = personalisation?.tone || "creative and professional";
    const constraints = personalisation?.styleConstraints?.join(", ") || "none";
    const diversity = personalisation?.linguisticDiversity || "general";

    const prompt = `
      You are a branding expert. Generate 4 unique and creative alternatives for the coined term "${term}".
      Context: ${JSON.stringify(context)}

      Personalisation Guidelines:
      - Tone: ${tone}
      - Style Constraints: ${constraints}
      - Linguistic Approach: ${diversity}
      - Max Length: ${personalisation?.maxLength || 15} characters
      
      Ensure terms are easily pronounceable.
    `;
    const schema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          term: { type: "string" },
          reason: { type: "string" }
        },
        required: ["term", "reason"]
      }
    };
    return this.generateObject<Array<{ term: string, reason: string }>>(prompt, schema);
  }
}
