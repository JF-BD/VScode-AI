import { AgentDefinition, AgentRole } from '../types/agent';
import { StageModelAssignment } from '../types/ai';
import { logger } from './logger';

export class AgentManager {
  private static instance: AgentManager;

  private stageModels: StageModelAssignment = {
    plannerModelId: 'cloud-gpt4o',
    coderModelId: 'cloud-claude35',
    reviewerModelId: 'cloud-gemini25',
    fixerModelId: 'lmstudio-qwen',
    productionModelId: 'ollama-codellama',
  };

  private agentDefinitions: Record<AgentRole, AgentDefinition> = {
    architect: {
      id: 'architect',
      name: 'Architect / Planner',
      shortDescription: 'Reviews blueprints, extracts project evidence, formulates multi-phase workplan.',
      systemPrompt: 'You are the Architect & Planner agent. Examine requirements, enforce architectural boundaries, check rules and evidence completeness.',
      defaultWorkflow: 'planning',
      allowedOperations: ['readFile', 'searchWorkspace', 'getDiagnostics', 'planPhase'],
      suggestedModelId: 'cloud-gpt4o',
    },
    coder: {
      id: 'coder',
      name: 'Coding Agent',
      shortDescription: 'Executes workplan phases, proposes structured WorkspaceEdits, tests diffs.',
      systemPrompt: 'You are the primary Coding Agent. Propose atomic, syntax-checked modifications adhering to project rules and active skills.',
      defaultWorkflow: 'coding',
      allowedOperations: ['readFile', 'readDirectory', 'searchWorkspace', 'getDiagnostics', 'proposeEdit', 'validateEdit', 'openDiff'],
      suggestedModelId: 'cloud-claude35',
    },
    reviewer: {
      id: 'reviewer',
      name: 'Code Reviewer',
      shortDescription: 'Performs deep code reviews on workplan compliance, security, and test boundaries.',
      systemPrompt: 'You are the Code Reviewer agent. Scrutinize proposed changes against effective rules, OWASP security baselines, and test criteria.',
      defaultWorkflow: 'review',
      allowedOperations: ['readFile', 'searchWorkspace', 'getDiagnostics', 'runValidation'],
      suggestedModelId: 'cloud-gemini25',
    },
    audit: {
      id: 'audit',
      name: 'Audit Agent',
      shortDescription: 'Discovers issues across files or workspace batches into persistent Fixation Reports.',
      systemPrompt: 'You are the Audit Agent. Scan codebases in batches, detect vulnerabilities/bugs/style regressions, and record persistent issues.',
      defaultWorkflow: 'audit',
      allowedOperations: ['readFile', 'readDirectory', 'searchWorkspace', 'getDiagnostics'],
      suggestedModelId: 'cloud-claude35',
    },
    fixer: {
      id: 'fixer',
      name: 'Fix Agent',
      shortDescription: 'Consumes assigned issues from Fix Queue and generates targeted validated corrections.',
      systemPrompt: 'You are the Fix Agent. Take specific audit findings and generate minimal, verified fixes with regression protection.',
      defaultWorkflow: 'fix',
      allowedOperations: ['readFile', 'proposeEdit', 'validateEdit', 'openDiff', 'applyEdit'],
      suggestedModelId: 'lmstudio-qwen',
    },
    production: {
      id: 'production',
      name: 'Production Reviewer',
      shortDescription: 'Performs final release gate validation across all criteria before deployment.',
      systemPrompt: 'You are the Production Reviewer. Run comprehensive sanity checks, verify git safety checkpoints, and assess release readiness.',
      defaultWorkflow: 'production',
      allowedOperations: ['readFile', 'getDiagnostics', 'getGitStatus', 'runValidation'],
      suggestedModelId: 'ollama-codellama',
    },
  };

  private currentRole: AgentRole = 'coder';

  private constructor() {}

  public static getInstance(): AgentManager {
    if (!AgentManager.instance) {
      AgentManager.instance = new AgentManager();
    }
    return AgentManager.instance;
  }

  public getAgentDefinition(role: AgentRole): AgentDefinition {
    return this.agentDefinitions[role];
  }

  public getAllAgents(): AgentDefinition[] {
    return Object.values(this.agentDefinitions);
  }

  public getCurrentRole(): AgentRole {
    return this.currentRole;
  }

  public setCurrentRole(role: AgentRole): void {
    this.currentRole = role;
    logger.info(`Switched active logical agent to: ${this.agentDefinitions[role].name}`);
  }

  public getStageModelAssignments(): StageModelAssignment {
    return { ...this.stageModels };
  }

  public updateStageModelAssignments(assignments: Partial<StageModelAssignment>): void {
    this.stageModels = { ...this.stageModels, ...assignments };
    logger.info('Stage model assignments updated');
  }

  public getModelForRole(role: AgentRole): string {
    switch (role) {
      case 'architect':
        return this.stageModels.plannerModelId;
      case 'coder':
        return this.stageModels.coderModelId;
      case 'reviewer':
        return this.stageModels.reviewerModelId;
      case 'fixer':
        return this.stageModels.fixerModelId;
      case 'production':
        return this.stageModels.productionModelId;
      case 'audit':
        return this.stageModels.reviewerModelId;
      default:
        return this.stageModels.coderModelId;
    }
  }
}

export const agentManager = AgentManager.getInstance();
