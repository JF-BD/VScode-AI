import { WebviewToExtensionMessage, ExtensionToWebviewMessage, ExtensionStateSnapshot } from '../types/messages';
import { projectProfileManager } from '../core/projectProfile';
import { evidenceManager } from '../core/evidenceManager';
import { projectIntake } from '../core/projectIntake';
import { agentManager } from '../core/agentManager';
import { taskManager } from '../core/taskManager';
import { workflowEngine } from '../core/workflowEngine';
import { ruleEngine } from '../core/ruleEngine';
import { skillEngine } from '../core/skillEngine';
import { hookEngine } from '../core/hookEngine';
import { auditEngine } from '../core/auditEngine';
import { auditReportManager } from '../core/auditReport';
import { fixAssignmentService } from '../core/fixAssignment';
import { diffManager } from '../core/diffManager';
import { fileEditor } from '../core/fileEditor';
import { gitEngine } from '../core/gitEngine';
import { configManager } from '../core/configManager';
import { aiProviderRouter } from '../core/aiProvider';
import { contextPackager } from '../core/contextPackager';
import { workspaceContext } from '../core/workspaceContext';
import { agentRuntime } from '../core/agentRuntime';
import { logger } from '../core/logger';

export class SidebarProvider {
  private static instance: SidebarProvider;
  private messageListeners: Array<(msg: ExtensionToWebviewMessage) => void> = [];

  private constructor() {
    // Listen to agent runtime events and forward them
    agentRuntime.onEvent((event) => {
      if (event.type === 'step') {
        this.broadcast({
          type: 'executionStep',
          payload: {
            iteration: event.payload.iterationNumber,
            action: event.payload.action,
            operation: event.payload.operation,
            result: event.payload.result,
            status: event.payload.status,
          },
        });
      } else if (event.type === 'taskStatus') {
        this.broadcastState();
      }
    });
  }

  public static getInstance(): SidebarProvider {
    if (!SidebarProvider.instance) {
      SidebarProvider.instance = new SidebarProvider();
    }
    return SidebarProvider.instance;
  }

  public registerWebviewListener(fn: (msg: ExtensionToWebviewMessage) => void) {
    this.messageListeners.push(fn);
    return () => {
      this.messageListeners = this.messageListeners.filter((l) => l !== fn);
    };
  }

  public broadcast(msg: ExtensionToWebviewMessage) {
    this.messageListeners.forEach((fn) => fn(msg));
  }

  public getStateSnapshot(): ExtensionStateSnapshot {
    const currentTask = taskManager.getCurrentTask();
    const activePhase = currentTask?.phases.find((p) => p.number === currentTask.currentPhaseNumber);
    const selectedRole = agentManager.getCurrentRole();
    const selectedModelId = currentTask?.modelId || agentManager.getModelForRole(selectedRole);

    return {
      projectProfile: projectProfileManager.getProfile(),
      evidenceSummary: evidenceManager.getSummary(),
      selectedAgentRole: selectedRole,
      selectedModelId,
      stageModelAssignments: agentManager.getStageModelAssignments(),
      availableModels: aiProviderRouter.getModels(),
      currentTask,
      taskHistory: taskManager.getHistory(),
      effectiveRules: ruleEngine.getEffectiveRules(),
      skills: skillEngine.getSkills(),
      hookRecords: hookEngine.getHookRecords(),
      auditReport: auditReportManager.getReport(),
      gitStatus: gitEngine.getStatus(),
      gitCheckpoints: gitEngine.getCheckpoints(),
      contextPackage: contextPackager.packageForModel(128000, activePhase),
      config: configManager.getConfig(),
      activeDiffChange: diffManager.getActiveDiff(),
      activeEditorFile: workspaceContext.getActiveEditor(),
      isExecuting: agentRuntime.isBusy(),
    };
  }

  public broadcastState() {
    this.broadcast({
      type: 'stateUpdate',
      payload: this.getStateSnapshot(),
    });
  }

  public async handleMessage(msg: WebviewToExtensionMessage): Promise<void> {
    logger.info(`SidebarProvider received webview message: ${msg.type}`);

    switch (msg.type) {
      case 'ready':
        this.broadcastState();
        break;

      case 'importFolder':
        await projectIntake.importFolder(msg.payload.folderName, msg.payload.filesCount);
        this.broadcastState();
        break;

      case 'importArchive':
        await projectIntake.importArchive(msg.payload.archiveName, msg.payload.sizeBytes);
        this.broadcastState();
        break;

      case 'importFiles':
        await projectIntake.importFiles(msg.payload.fileNames);
        this.broadcastState();
        break;

      case 'retryEvidence':
        evidenceManager.retryEvidence(msg.payload.evidenceId);
        this.broadcastState();
        break;

      case 'refreshProfile':
        this.broadcastState();
        break;

      case 'setAgent':
        agentManager.setCurrentRole(msg.payload.role);
        const task = taskManager.getCurrentTask();
        if (task && task.status === 'draft') {
          task.agentRole = msg.payload.role;
          task.modelId = agentManager.getModelForRole(msg.payload.role);
        }
        this.broadcastState();
        break;

      case 'setWorkflow':
        if (taskManager.getCurrentTask()) {
          taskManager.getCurrentTask()!.workflowId = msg.payload.workflowId;
        }
        this.broadcastState();
        break;

      case 'setModel':
        taskManager.switchTaskModel(msg.payload.modelId);
        this.broadcastState();
        break;

      case 'switchModel':
        taskManager.switchTaskModel(msg.payload.newModelId);
        this.broadcastState();
        break;

      case 'updateStageModels':
        agentManager.updateStageModelAssignments(msg.payload.assignments);
        this.broadcastState();
        break;

      case 'testConnection':
        const res = await aiProviderRouter.testConnection(msg.payload.modelId);
        this.broadcast({
          type: 'notification',
          payload: {
            message: res.message,
            type: res.success ? 'success' : 'error',
          },
        });
        this.broadcastState();
        break;

      case 'createTask':
        taskManager.createTask({
          title: msg.payload.title,
          userInstruction: msg.payload.instruction,
          agentRole: msg.payload.agentRole,
          modelId: msg.payload.modelId,
          workflowId: msg.payload.workflowId,
        });
        this.broadcastState();
        break;

      case 'startTask':
        this.broadcastState();
        taskManager.startTask(msg.payload?.taskId).then(() => {
          this.broadcastState();
        });
        break;

      case 'pauseTask':
        taskManager.pauseTask();
        this.broadcastState();
        break;

      case 'resumeTask':
        taskManager.resumeTask();
        this.broadcastState();
        break;

      case 'cancelTask':
        taskManager.cancelTask();
        this.broadcastState();
        break;

      case 'refreshRules':
        this.broadcastState();
        break;

      case 'setSkills':
        skillEngine.setActiveSkillIds(msg.payload.activeSkillIds);
        this.broadcastState();
        break;

      case 'auditWorkspace':
      case 'auditFile':
      case 'auditSelection':
        const scope = (msg as any).payload?.scope || 'entire_workspace';
        await auditEngine.runAudit(scope);
        this.broadcastState();
        break;

      case 'assignFixer':
        fixAssignmentService.assignIssue(msg.payload.issueId, msg.payload.modelId, msg.payload.isManual);
        this.broadcastState();
        break;

      case 'startFix':
        fixAssignmentService.markFixStarted(msg.payload.issueId);
        this.broadcastState();
        setTimeout(() => {
          fixAssignmentService.markFixCompleted(msg.payload.issueId);
          this.broadcastState();
        }, 1200);
        break;

      case 'openDiff':
        const curTask = taskManager.getCurrentTask();
        const change = curTask?.proposedChanges.find((c) => c.id === msg.payload.changeId);
        if (change) {
          diffManager.openDiff(change);
        }
        this.broadcastState();
        break;

      case 'applyEdits':
        const t = taskManager.getCurrentTask();
        if (t) {
          const targets = t.proposedChanges.filter((c) => msg.payload.changeIds.includes(c.id));
          await fileEditor.applyChanges(targets);
          t.status = 'completed';
          gitEngine.stageFiles(targets.map((c) => c.filePath));
        }
        diffManager.closeDiff();
        this.broadcastState();
        break;

      case 'rejectEdits':
        const rejectedTask = taskManager.getCurrentTask();
        if (rejectedTask) {
          const targets = rejectedTask.proposedChanges.filter((c) => msg.payload.changeIds.includes(c.id));
          fileEditor.rejectChanges(targets);
        }
        diffManager.closeDiff();
        this.broadcastState();
        break;

      case 'gitCheckpoint':
        gitEngine.createCheckpoint(msg.payload.message, msg.payload.tag);
        this.broadcastState();
        break;

      case 'gitStage':
        gitEngine.stageFiles(msg.payload?.filePaths);
        this.broadcastState();
        break;

      case 'gitCommit':
        gitEngine.commit(msg.payload.message);
        this.broadcastState();
        break;

      case 'gitPush':
        gitEngine.push();
        this.broadcastState();
        break;

      case 'saveConfig':
        configManager.updateConfig(msg.payload.config);
        this.broadcastState();
        break;
    }
  }
}

export const sidebarProvider = SidebarProvider.getInstance();
