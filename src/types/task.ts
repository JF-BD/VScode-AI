import { AgentRole } from './agent';
import { ProposedChange } from './edits';

export type TaskStatus = 
  | 'draft'
  | 'queued'
  | 'running'
  | 'paused'
  | 'waiting_for_user'
  | 'validating'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface WorkplanPhase {
  id: string;
  number: number;
  title: string;
  objective: string;
  status: 'pending' | 'active' | 'completed' | 'skipped' | 'failed';
  dependencies?: string[];
  expectedChangesCount?: number;
  gitCheckpointTag?: string;
}

export interface TaskStep {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: number;
  completedAt?: number;
  details?: string;
}

export interface Task {
  id: string;
  title: string;
  userInstruction: string;
  agentRole: AgentRole;
  modelId: string;
  workflowId: string;
  status: TaskStatus;
  currentPhaseNumber: number;
  totalPhases: number;
  phases: WorkplanPhase[];
  steps: TaskStep[];
  activeSkills: string[];
  activeRules: string[];
  proposedChanges: ProposedChange[];
  createdAt: number;
  updatedAt: number;
  currentIteration: number;
  maxIterations: number;
  error?: string;
  gitCheckpoint?: string;
  contextBudgetUsed: number;
  contextBudgetTotal: number;
}
