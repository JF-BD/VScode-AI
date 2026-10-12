import { Task, WorkplanPhase, TaskStatus } from '../types/task';
import { AgentRole } from '../types/agent';
import { workflowEngine } from './workflowEngine';
import { agentManager } from './agentManager';
import { agentRuntime } from './agentRuntime';
import { logger } from './logger';

export class TaskManager {
  private static instance: TaskManager;
  private currentTask: Task | null = null;
  private history: Task[] = [];

  private constructor() {
    this.initDefaultTask();
  }

  public static getInstance(): TaskManager {
    if (!TaskManager.instance) {
      TaskManager.instance = new TaskManager();
    }
    return TaskManager.instance;
  }

  private initDefaultTask() {
    const workflow = workflowEngine.getWorkflow('coding')!;
    this.currentTask = {
      id: 'task-101',
      title: 'Review blueprint & prepare workplan',
      userInstruction: 'Implement phase 03 provider layer requirements with token caching and permission checks.',
      agentRole: 'coder',
      modelId: 'cloud-claude35',
      workflowId: 'coding',
      status: 'draft',
      currentPhaseNumber: 3,
      totalPhases: 8,
      phases: workflow.defaultPhases,
      steps: [
        { id: 's1', title: 'Evidence & context loaded', status: 'completed' },
        { id: 's2', title: 'Rules & skills loaded', status: 'completed' },
        { id: 's3', title: 'Blueprint reviewed', status: 'completed' },
        { id: 's4', title: 'Preparing Phase Plan & Edits', status: 'pending' },
        { id: 's5', title: 'User diff review & approval', status: 'pending' },
      ],
      activeSkills: ['skill-python', 'skill-django', 'skill-security'],
      activeRules: ['rule-001', 'rule-002', 'rule-003'],
      proposedChanges: [],
      createdAt: Date.now() - 7200000,
      updatedAt: Date.now() - 3600000,
      currentIteration: 0,
      maxIterations: 10,
      gitCheckpoint: 'phase-03',
      contextBudgetUsed: 38000,
      contextBudgetTotal: 128000,
    };

    this.history = [
      {
        id: 'task-100',
        title: 'Phase 02 Data Layer Models',
        userInstruction: 'Set up initial ORM models and migrations',
        agentRole: 'coder',
        modelId: 'cloud-claude35',
        workflowId: 'coding',
        status: 'completed',
        currentPhaseNumber: 2,
        totalPhases: 8,
        phases: workflow.defaultPhases,
        steps: [],
        activeSkills: ['skill-python', 'skill-django'],
        activeRules: ['rule-001'],
        proposedChanges: [],
        createdAt: Date.now() - 14400000,
        updatedAt: Date.now() - 7200000,
        currentIteration: 6,
        maxIterations: 10,
        gitCheckpoint: 'phase-02-data-layer',
        contextBudgetUsed: 29000,
        contextBudgetTotal: 128000,
      },
      {
        id: 'task-099',
        title: 'Initial Blueprint Compliance Audit',
        userInstruction: 'Scan repository for security & architecture compliance',
        agentRole: 'audit',
        modelId: 'cloud-claude35',
        workflowId: 'audit',
        status: 'completed',
        currentPhaseNumber: 1,
        totalPhases: 3,
        phases: [],
        steps: [],
        activeSkills: ['skill-security'],
        activeRules: ['rule-002'],
        proposedChanges: [],
        createdAt: Date.now() - 28800000,
        updatedAt: Date.now() - 25200000,
        currentIteration: 4,
        maxIterations: 10,
        contextBudgetUsed: 42000,
        contextBudgetTotal: 128000,
      },
    ];
  }

  public getCurrentTask(): Task | null {
    return this.currentTask;
  }

  public getHistory(): Task[] {
    return [...this.history];
  }

  public createTask(params: {
    title: string;
    userInstruction: string;
    agentRole: AgentRole;
    modelId: string;
    workflowId: string;
  }): Task {
    const workflow = workflowEngine.getWorkflow(params.workflowId) || workflowEngine.getWorkflow('coding')!;
    
    // If there was an existing current task, push it to history
    if (this.currentTask) {
      this.history.unshift(this.currentTask);
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: params.title,
      userInstruction: params.userInstruction,
      agentRole: params.agentRole,
      modelId: params.modelId,
      workflowId: params.workflowId,
      status: 'draft',
      currentPhaseNumber: 1,
      totalPhases: workflow.defaultPhases.length || 1,
      phases: workflow.defaultPhases,
      steps: [
        { id: 's1', title: 'Load evidence & context', status: 'pending' },
        { id: 's2', title: 'Reasoning & plan', status: 'pending' },
        { id: 's3', title: 'Generate proposed changes', status: 'pending' },
        { id: 's4', title: 'Validate & diff review', status: 'pending' },
      ],
      activeSkills: ['skill-python', 'skill-django', 'skill-security'],
      activeRules: ['rule-001', 'rule-002'],
      proposedChanges: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      currentIteration: 0,
      maxIterations: 10,
      contextBudgetUsed: 38000,
      contextBudgetTotal: 128000,
    };

    this.currentTask = newTask;
    logger.info(`New Task created: [${newTask.id}] "${newTask.title}"`);
    return newTask;
  }

  public switchTaskModel(newModelId: string): void {
    if (this.currentTask) {
      logger.info(`Switching model for Task [${this.currentTask.id}] from ${this.currentTask.modelId} to ${newModelId}. Task state preserved.`);
      this.currentTask.modelId = newModelId;
      this.currentTask.updatedAt = Date.now();
    }
  }

  public async startTask(taskId?: string): Promise<Task | null> {
    const task = this.currentTask;
    if (!task) return null;
    return agentRuntime.executeTask(task);
  }

  public pauseTask(): void {
    agentRuntime.pause();
    if (this.currentTask) {
      this.currentTask.status = 'paused';
    }
  }

  public resumeTask(): void {
    agentRuntime.resume();
    if (this.currentTask) {
      this.currentTask.status = 'running';
    }
  }

  public cancelTask(): void {
    agentRuntime.cancel();
    if (this.currentTask) {
      this.currentTask.status = 'cancelled';
    }
  }
}

export const taskManager = TaskManager.getInstance();
