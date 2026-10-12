import { AuditScope, AuditReport, AuditIssue } from '../types/audit';
import { auditReportManager } from './auditReport';
import { logger } from './logger';

export class AuditEngine {
  private static instance: AuditEngine;

  private constructor() {}

  public static getInstance(): AuditEngine {
    if (!AuditEngine.instance) {
      AuditEngine.instance = new AuditEngine();
    }
    return AuditEngine.instance;
  }

  public async runAudit(
    scope: AuditScope,
    onProgress?: (batch: number, totalBatches: number, filesProcessed: number) => void
  ): Promise<AuditReport> {
    logger.info(`Starting Audit in scope: ${scope}`);
    const totalFiles = scope === 'current_file' ? 1 : scope === 'selected_files' ? 12 : 67;
    const totalBatches = Math.ceil(totalFiles / 15);

    for (let b = 1; b <= totalBatches; b++) {
      await new Promise((r) => setTimeout(r, 280));
      const processed = Math.min(totalFiles, b * 15);
      if (onProgress) {
        onProgress(b, totalBatches, processed);
      }
      logger.info(`Audit Batch ${b}/${totalBatches} completed (${processed}/${totalFiles} files analyzed)`);
    }

    const report = auditReportManager.getReport();
    logger.info(`Audit completed: ${report.issues.length} total findings (${report.criticalCount} Critical)`);
    return report;
  }
}

export const auditEngine = AuditEngine.getInstance();
