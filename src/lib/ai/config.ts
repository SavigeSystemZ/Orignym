import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface ProviderConfig {
  kind: string;
  model: string;
  base_url: string;
  api_key_env: string;
  temperature: number;
  top_p: number;
  timeout_seconds: number;
  retry_attempts: number;
}

export interface AIConfig {
  default_provider: string;
  providers: Record<string, ProviderConfig>;
}

export function loadAIConfig(): AIConfig {
  const configPath = path.join(process.cwd(), 'ai', 'llm_config.yaml');
  try {
    const fileContents = fs.readFileSync(configPath, 'utf8');
    return yaml.load(fileContents) as AIConfig;
  } catch (e) {
    console.error(`Failed to load AI config from ${configPath}:`, e);
    return {
      default_provider: 'mock',
      providers: {}
    };
  }
}
