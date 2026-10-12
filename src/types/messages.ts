import { AgentRole } from './agent';
import { Task, WorkplanPhase } from './task';
import { ProposedChange } from './edits';
import { AuditReport, AuditIssue, AuditScope } from './audit';
import { ProjectProfile, ProjectEvidenceSummary } from './project';
import { GitStatusInfo, GitCheckpoint } from './git';
import { EffectiveRuleSet } from './rules';
import { SkillDefinition } from './skills';
import { HookExecutionRecord } from './hooks';
import { AIModel, ProviderConfig, StageModelAssignment } from './ai';

export type WebviewToExtensionMessage =
  | { type: 'ready' }
  | { type: 'importFolder'; payload: { folderName: string; filesCount: number } }
  | { type: 'importArchive'; payload: { archiveName: string; sizeBytes: number; fileData?: string } }
  | { type: 'importFiles'; payload: { fileNames: string[] } }
  | { type: 'retryEvidence'; payload: { evidenceId?: string } }
  | { type: 'viewEvidence'; payload: { evidenceId: string } }
  | { type: 'refreshProfile' }
  | { type: 'setAgent'; payload: { role: AgentRole } }
  | { type: 'setWorkflow'; payload: { workflowId: string } }
  | { type: 'setModel'; payload: { modelId: string } }
  | { type: 'switchModel'; payload: { newModelId: string } }
  | { type: 'updateStageModels'; payload: { assignments: Partial<StageModelAssignment> } }
  | { type: 'testConnection'; payload: { modelId: string } }
  | { type: 'createTask'; payload: { title: string; instruction: string; agentRole: AgentRole; modelId: string; workflowId: string } }
  | { type: 'startTask'; payload?: { taskId?: string } }
  | { type: 'pauseTask'; payload?: { taskId?: string } }
  | { type: 'resumeTask'; payload?: { taskId?: string } }
  | { type: 'cancelTask'; payload?: { taskId?: string } }
  | { type: 'inspectContext' }
  | { type: 'refreshRules' }
  | { type: 'setSkills'; payload: { activeSkillIds: string[] } }
  | { type: 'auditFile'; payload: { filePath: string } }
  | { type: 'auditSelection'; payload: { filePaths: string[] } }
  | { type: 'auditWorkspace'; payload: { scope: AuditScope } }
  | { type: 'assignFixer'; payload: { issueId: string; modelId?: string; isManual?: boolean } }
  | { type: 'startFix'; payload: { issueId: string } }
  | { type: 'openDiff'; payload: { changeId: string } }
  | { type: 'applyEdits'; payload: { changeIds: string[] } }
  | { type: 'rejectEdits'; payload: { changeIds: string[] } }
  | { type: 'runValidation'; payload?: { changeId?: string } }
  | { type: 'gitStatus' }
  | { type: 'gitCheckpoint'; payload: { message: string; tag?: string } }
  | { type: 'gitStage'; payload?: { filePaths?: string[] } }
  | { type: 'gitCommit'; payload: { message: string } }
  | { type: 'gitPush'; payload?: Record<string, never> }
  | { type: 'saveConfig'; payload: { config: Partial<ProviderConfig> } };

export type ExtensionToWebviewMessage =
  | { type: 'stateUpdate'; payload: ExtensionStateSnapshot }
  | { type: 'taskEvent'; payload: { event: string; taskId: string; details?: any } }
  | { type: 'executionStep'; payload: { iteration: number; action: string; operation: string; result: string; status: 'running' | 'success' | 'warning' | 'error' } }
  | { type: 'evidenceUpdate'; payload: ProjectEvidenceSummary }
  | { type: 'auditUpdate'; payload: AuditReport }
  | { type: 'gitUpdate'; payload: GitStatusInfo }
  | { type: 'errorNotification'; payload: { title: string; message: string; code?: string; recoverable: boolean } }
  | { type: 'notification'; payload: { message: string; type?: 'info' | 'success' | 'warning' | 'error' } };

export interface ContextPackageDetail {
  projectProfile: ProjectProfile;
  activePhase?: WorkplanPhase;
  includedFiles: Array<{ path: string; tokenCount: number; reason: string }>;
  excludedFiles: Array<{ path: string; reason: string }>;
  effectiveRulesCount: number;
  activeSkillsCount: number;
  diagnosticsCount: number;
  gitChangesCount: number;
  totalTokensUsed: number;
  totalTokensBudget: number;
}

export interface ExtensionStateSnapshot {
  projectProfile: ProjectProfile;
  evidenceSummary: ProjectEvidenceSummary;
  selectedAgentRole: AgentRole;
  selectedModelId: string;
  stageModelAssignments: StageModelAssignment;
  availableModels: AIModel[];
  currentTask: Task | null;
  taskHistory: Task[];
  effectiveRules: EffectiveRuleSet;
  skills: SkillDefinition[];
  hookRecords: HookExecutionRecord[];
  auditReport: AuditReport;
  gitStatus: GitStatusInfo;
  gitCheckpoints: GitCheckpoint[];
  contextPackage: ContextPackageDetail;
  config: ProviderConfig;
  activeDiffChange: ProposedChange | null;
  activeEditorFile: { path: string; content: string; language: string } | null;
  isExecuting: boolean;
}
