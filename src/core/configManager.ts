import { ProviderConfig, AIProviderType } from '../types/ai';
import { secretManager } from './secretManager';
import { logger } from './logger';

const DEFAULT_CONFIG: ProviderConfig = {
  cloudEndpoint: 'https://api.openai.com/v1',
  cloudApiKey: '',
  cloudDefaultModel: 'gpt-4o',
  lmStudioEndpoint: 'http://localhost:1234/v1',
  lmStudioDefaultModel: 'qwen2.5-coder-7b-instruct',
  ollamaEndpoint: 'http://localhost:11434',
  ollamaDefaultModel: 'qwen2.5-coder:7b',
  geminiApiKey: '',
  geminiDefaultModel: 'gemini-2.5-flash',
  autoFallbackEnabled: true,
  fallbackOrder: ['cloud', 'lmstudio', 'ollama', 'gemini'],
};

export class ConfigManager {
  private static instance: ConfigManager;
  private config: ProviderConfig;

  private constructor() {
    this.config = { ...DEFAULT_CONFIG };
    this.loadInitialConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private async loadInitialConfig() {
    try {
      const saved = localStorage?.getItem('si_vscode_ai_config');
      if (saved) {
        this.config = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      logger.warn('Could not load config from localStorage', e);
    }
  }

  public getConfig(): ProviderConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<ProviderConfig>): void {
    this.config = { ...this.config, ...newConfig };
    try {
      localStorage?.setItem('si_vscode_ai_config', JSON.stringify(this.config));
    } catch (e) {
      logger.warn('Failed to persist config', e);
    }
    logger.info('Provider configuration updated');
  }
}

export const configManager = ConfigManager.getInstance();
