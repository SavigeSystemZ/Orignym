import { GoogleGenerativeAI } from "@google/generative-ai";
import { LLMProvider, StructuredOutputProvider, SuggestionProvider } from "@/lib/interfaces/ai";
import { ProviderConfig } from "./config";

export class GoogleGeminiProvider implements LLMProvider, StructuredOutputProvider, SuggestionProvider {
  private genAI: GoogleGenerativeAI;
  private model: string;

  constructor(config: ProviderConfig) {
    const apiKey = process.env[config.api_key_env] || "";
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = config.model;
  }

  async complete(prompt: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: this.model });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  async chat(messages: Array<{ role: 'user' | 'assistant' | 'system', content: string }>): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: this.model });
    // Convert to Gemini format
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));
    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    return result.response.text();
  }

  async generateObject<T>(prompt: string, schema: unknown): Promise<T> {
    const model = this.genAI.getGenerativeModel({ 
      model: this.model,
      generationConfig: {
        responseMimeType: "application/json",
        // We'll trust Gemini's ability to match the JSON schema without explicit translation for now
        // or we can translate the JSON schema to Gemini's format if needed.
      }
    });
    
    const finalPrompt = `${prompt}\n\nPlease return the response in JSON format matching this schema: ${JSON.stringify(schema)}`;
    const result = await model.generateContent(finalPrompt);
    const text = result.response.text();
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
      
      Ensure terms are easily pronounceable (maintain a good vowel-consonant ratio).
      Return as a JSON array of objects with "term" and "reason" properties.
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
