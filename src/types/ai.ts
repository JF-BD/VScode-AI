export type AIProviderType = 'cloud' | 'lmstudio' | 'ollama' | 'gemini';

export interface ModelCapability {
  text: boolean;
  vision: boolean;
  contextWindow: number; // in tokens, e.g. 128000
  local: boolean;
  streaming: boolean;
  costPer1k?: number;
}

export interface AIModel {
  id: string;
  name: string;
  provider: AIProviderType;
  endpoint?: string;
  contextWindow: number;
  capabilities: ModelCapability;
  isAvailable: boolean;
  latencyMs?: number;
}

export interface StageModelAssignment {
  plannerModelId: string;
  coderModelId: string;
  reviewerModelId: string;
  fixerModelId: string;
  productionModelId: string;
}

export interface AIRequestOptions {
  modelId: string;
  systemPrompt?: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  contextFiles?: Array<{ path: string; content: string }>;
  rules?: string[];
  skills?: string[];
  responseFormat?: 'json' | 'text' | 'diff';
}

export interface NormalizedAIResponse {
  rawText: string;
  parsedOperations?: Array<{
    operation: 'readFile' | 'editFile' | 'createFile' | 'deleteFile' | 'command' | 'plan';
    path?: string;
    content?: string;
    diff?: string;
    reasoning?: string;
  }>;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  durationMs: number;
  modelUsed: string;
}

export interface ProviderConfig {
  cloudEndpoint: string;
  cloudApiKey: string;
  cloudDefaultModel: string;
  lmStudioEndpoint: string;
  lmStudioDefaultModel: string;
  ollamaEndpoint: string;
  ollamaDefaultModel: string;
  geminiApiKey: string;
  geminiDefaultModel: string;
  autoFallbackEnabled: boolean;
  fallbackOrder: AIProviderType[];
}
