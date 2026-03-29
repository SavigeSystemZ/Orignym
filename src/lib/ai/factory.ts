import { loadAIConfig } from "./config";
import { MockLLMProvider, MockStructuredOutputProvider, MockSuggestionProvider } from "./mockProviders";
import { GoogleGeminiProvider } from "./google";
import { AnthropicClaudeProvider } from "./anthropic";
import { LLMProvider, StructuredOutputProvider, SuggestionProvider } from "@/lib/interfaces/ai";

export class AIProviderFactory {
  private static config = loadAIConfig();

  static getLLMProvider(): LLMProvider {
    const defaultProvider = process.env.AI_PROVIDER || this.config.default_provider;
    const providerConfig = this.config.providers[defaultProvider];

    if (!providerConfig || defaultProvider === 'mock') {
      return new MockLLMProvider();
    }

    switch (providerConfig.kind) {
      case 'google':
        return new GoogleGeminiProvider(providerConfig);
      case 'anthropic':
        return new AnthropicClaudeProvider(providerConfig);
      default:
        return new MockLLMProvider();
    }
  }

  static getStructuredOutputProvider(evidence: unknown[] = []): StructuredOutputProvider {
    const defaultProvider = process.env.AI_PROVIDER || this.config.default_provider;
    const providerConfig = this.config.providers[defaultProvider];

    if (!providerConfig || defaultProvider === 'mock') {
      return new MockStructuredOutputProvider(evidence);
    }

    switch (providerConfig.kind) {
      case 'google':
        return new GoogleGeminiProvider(providerConfig);
      case 'anthropic':
        return new AnthropicClaudeProvider(providerConfig);
      default:
        return new MockStructuredOutputProvider(evidence);
    }
  }

  static getSuggestionProvider(): SuggestionProvider {
    const defaultProvider = process.env.AI_PROVIDER || this.config.default_provider;
    const providerConfig = this.config.providers[defaultProvider];

    if (!providerConfig || defaultProvider === 'mock') {
      return new MockSuggestionProvider();
    }

    switch (providerConfig.kind) {
      case 'google':
        return new GoogleGeminiProvider(providerConfig);
      case 'anthropic':
        return new AnthropicClaudeProvider(providerConfig);
      default:
        return new MockSuggestionProvider();
    }
  }
}
