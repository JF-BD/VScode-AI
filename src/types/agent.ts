export type AgentRole = 
  | 'architect'        // Architect / Planner
  | 'coder'            // Coding Agent
  | 'reviewer'         // Code Reviewer
  | 'audit'            // Audit Agent
  | 'fixer'            // Fix Agent
  | 'production';      // Production Reviewer

export interface AgentDefinition {
  id: AgentRole;
  name: string;
  shortDescription: string;
  systemPrompt: string;
  defaultWorkflow: string;
  allowedOperations: string[];
  suggestedModelId: string;
}

export type AgentStatus = 'idle' | 'running' | 'paused' | 'waiting_for_user' | 'completed' | 'failed';

export interface AgentIteration {
  iterationNumber: number;
  timestamp: number;
  action: string;
  operation: string;
  result: string;
  status: 'running' | 'success' | 'warning' | 'error';
  targetPath?: string;
  tokenCount?: number;
}
