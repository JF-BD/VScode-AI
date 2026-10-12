import { logger } from './logger';

export class SecretManager {
  private static instance: SecretManager;
  private inMemorySecrets: Map<string, string> = new Map();

  private constructor() {
    // Initial in-memory secrets from environment if present
    if (typeof process !== 'undefined' && process.env) {
      if (process.env.GEMINI_API_KEY) {
        this.inMemorySecrets.set('geminiApiKey', process.env.GEMINI_API_KEY);
      }
      if (process.env.OPENAI_API_KEY) {
        this.inMemorySecrets.set('cloudApiKey', process.env.OPENAI_API_KEY);
      }
    }
  }

  public static getInstance(): SecretManager {
    if (!SecretManager.instance) {
      SecretManager.instance = new SecretManager();
    }
    return SecretManager.instance;
  }

  public async getSecret(key: string): Promise<string | undefined> {
    // Check in-memory store
    return this.inMemorySecrets.get(key);
  }

  public async storeSecret(key: string, value: string): Promise<void> {
    this.inMemorySecrets.set(key, value);
    logger.info(`Secret stored securely for key: ${key}`);
  }

  public async deleteSecret(key: string): Promise<void> {
    this.inMemorySecrets.delete(key);
    logger.info(`Secret deleted for key: ${key}`);
  }
}

export const secretManager = SecretManager.getInstance();
