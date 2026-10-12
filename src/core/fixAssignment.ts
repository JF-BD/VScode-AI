import { auditReportManager } from './auditReport';
import { AuditIssue } from '../types/audit';
import { logger } from './logger';

export class FixAssignmentService {
  private static instance: FixAssignmentService;

  private constructor() {}

  public static getInstance(): FixAssignmentService {
    if (!FixAssignmentService.instance) {
      FixAssignmentService.instance = new FixAssignmentService();
    }
    return FixAssignmentService.instance;
  }

  public assignIssue(issueId: string, modelId?: string, isManual = false): AuditIssue | undefined {
    logger.info(`Assigning Fixer for Issue #${issueId} -> ${isManual ? 'Manual Fix' : modelId}`);
    return auditReportManager.updateIssue(issueId, {
      assignedModelId: isManual ? undefined : modelId,
      status: isManual ? 'Manual' : 'Assigned',
    });
  }

  public markFixStarted(issueId: string): AuditIssue | undefined {
    return auditReportManager.updateIssue(issueId, {
      status: 'Fixing',
    });
  }

  public markFixCompleted(issueId: string): AuditIssue | undefined {
    return auditReportManager.updateIssue(issueId, {
      status: 'Fixed',
      validationStatus: 'passed',
    });
  }
}

export const fixAssignmentService = FixAssignmentService.getInstance();
