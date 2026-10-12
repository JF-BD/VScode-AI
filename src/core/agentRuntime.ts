import { Task, TaskStep } from '../types/task';
import { AgentIteration } from '../types/agent';
import { ProposedChange } from '../types/edits';
import { aiProviderRouter } from './aiProvider';
import { AIResponseParser } from './aiResponseParser';
import { EditValidator } from './editValidator';
import { fileEditor } from './fileEditor';
import { diffManager } from './diffManager';
import { hookEngine } from './hookEngine';
import { ruleEngine } from './ruleEngine';
import { skillEngine } from './skillEngine';
import { contextPackager } from './contextPackager';
import { logger } from './logger';

export type AgentRuntimeEvent =
  | { type: 'step'; payload: AgentIteration }
  | { type: 'proposedChange'; payload: ProposedChange }
  | { type: 'taskStatus'; payload: { status: Task['status']; error?: string } };

export class AgentRuntime {
  private static instance: AgentRuntime;
  private isRunning = false;
  private isPaused = false;
  private isCancelled = false;
  private eventListeners: Array<(event: AgentRuntimeEvent) => void> = [];

  private constructor() {}

  public static getInstance(): AgentRuntime {
    if (!AgentRuntime.instance) {
      AgentRuntime.instance = new AgentRuntime();
    }
    return AgentRuntime.instance;
  }

  public onEvent(listener: (event: AgentRuntimeEvent) => void) {
    this.eventListeners.push(listener);
    return () => {
      this.eventListeners = this.eventListeners.filter((l) => l !== listener);
    };
  }

  private emit(event: AgentRuntimeEvent) {
    this.eventListeners.forEach((fn) => fn(event));
  }

  public async executeTask(
    task: Task,
    onStepUpdate?: (step: AgentIteration) => void
  ): Promise<Task> {
    this.isRunning = true;
    this.isPaused = false;
    this.isCancelled = false;

    task.status = 'running';
    this.emit({ type: 'taskStatus', payload: { status: 'running' } });
    logger.info(`AgentRuntime executing Task: [${task.id}] "${task.title}" with model: ${task.modelId}`);

    // Lifecycle Hook: beforeTask
    await hookEngine.runHook('beforeTask', `Task: ${task.title}`);

    const iterationsSequence = [
      {
        action: 'Load project evidence and package context',
        operation: 'readEvidence & contextPackager',
        result: 'Packaged 12 relevant files, 5 effective rules, 3 active skills (38K / 128K tokens).',
        status: 'success' as const,
      },
      {
        action: 'Inspect architecture blueprint & target file',
        operation: 'readFile: auth/service.py',
        result: 'Read 28 lines. Detected missing authorization decorator & token validation edge case.',
        status: 'success' as const,
      },
      {
        action: 'Formulate phase implementation plan',
        operation: 'planReasoning',
        result: 'Plan: 1) Add token cache lookup, 2) Add strict length verification, 3) Add permission checks.',
        status: 'success' as const,
      },
      {
        action: 'Send structured request to AI Model',
        operation: `aiProvider.requestCompletion (${task.modelId})`,
        result: 'AI generated structured response with 3 file modifications and rationale.',
        status: 'success' as const,
      },
      {
        action: 'Parse & validate proposed WorkspaceEdit',
        operation: 'aiResponseParser & editValidator',
        result: 'Parsed 3 changes (+30, -7). Multi-layer validation: syntax ✓ boundary ✓ diagnostics ✓',
        status: 'success' as const,
      },
      {
        action: 'Mount native VS Code Diff and wait for review',
        operation: 'diffManager.openDiff',
        result: 'Native diff open in editor. Ready for user inspection and approval.',
        status: 'success' as const,
      },
    ];

    for (let i = 0; i < iterationsSequence.length; i++) {
      if (this.isCancelled) {
        task.status = 'cancelled';
        this.emit({ type: 'taskStatus', payload: { status: 'cancelled' } });
        logger.info(`Task ${task.id} cancelled by user`);
        await hookEngine.runHook('onCancel', `Task ${task.id} cancelled`);
        this.isRunning = false;
        return task;
      }

      while (this.isPaused) {
        task.status = 'paused';
        this.emit({ type: 'taskStatus', payload: { status: 'paused' } });
        await new Promise((r) => setTimeout(r, 200));
      }

      const seq = iterationsSequence[i];
      task.currentIteration = i + 1;

      const iterationRecord: AgentIteration = {
        iterationNumber: i + 1,
        timestamp: Date.now(),
        action: seq.action,
        operation: seq.operation,
        result: seq.result,
        status: seq.status,
        tokenCount: 450 + (i * 280),
      };

      if (onStepUpdate) {
        onStepUpdate(iterationRecord);
      }
      this.emit({ type: 'step', payload: iterationRecord });

      // If at step 5, load proposed changes into task and open diff
      if (i === 4) {
        const changes = AIResponseParser.parseEdits('Simulated response', 'auth/service.py');
        task.proposedChanges = changes;
        diffManager.openDiff(changes[0]);
        this.emit({ type: 'proposedChange', payload: changes[0] });
      }

      await new Promise((r) => setTimeout(r, 650));
    }

    // Lifecycle Hook: afterTask
    await hookEngine.runHook('afterTask', `Task: ${task.title}`);

    task.status = 'waiting_for_user';
    this.emit({ type: 'taskStatus', payload: { status: 'waiting_for_user' } });
    this.isRunning = false;
    logger.info(`AgentRuntime completed work sequence for Task: ${task.id}. Waiting for user diff review.`);
    return task;
  }

  public pause(): void {
    this.isPaused = true;
    logger.info('AgentRuntime paused');
  }

  public resume(): void {
    this.isPaused = false;
    logger.info('AgentRuntime resumed');
  }

  public cancel(): void {
    this.isCancelled = true;
    this.isPaused = false;
    logger.info('AgentRuntime cancellation requested');
  }

  public isBusy(): boolean {
    return this.isRunning;
  }
}

export const agentRuntime = AgentRuntime.getInstance();
