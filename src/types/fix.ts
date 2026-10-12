import { AuditIssue } from './audit';
import { ProposedChange } from './edits';

export interface FixAssignment {
  issueId: string;
  assignedModelId?: string;
  isManual: boolean;
  assignedAt: number;
}

export interface FixTaskState {
  issueId: string;
  issue: AuditIssue;
  modelId: string;
  status: 'pending' | 'in_progress' | 'diff_ready' | 'validated' | 'applied' | 'failed';
  proposedChange?: ProposedChange;
  iteration: number;
  log: string[];
}
