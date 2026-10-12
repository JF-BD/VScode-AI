import { AuditReport, AuditIssue, AuditScope } from '../types/audit';
import { logger } from './logger';

export class AuditReportManager {
  private static instance: AuditReportManager;
  private currentReport: AuditReport = {
    id: 'rep-01',
    timestamp: Date.now() - 1800000,
    scope: 'entire_workspace',
    totalFilesScanned: 67,
    totalIssues: 8,
    criticalCount: 2,
    highCount: 3,
    mediumCount: 3,
    lowCount: 0,
    pendingCount: 4,
    fixedCount: 1,
    issues: [
      {
        id: '001',
        filePath: 'auth/service.py',
        line: 84,
        type: 'Security',
        severity: 'Critical',
        problem: 'Missing authorization validation before sensitive role modification.',
        suggestedFix: 'Add verify_permission() check enforcing superuser/tenant isolation.',
        evidenceSnippet: 'def update_role(user, new_role):\n    user.role = new_role\n    user.save()',
        ruleReference: '.cursorrules (Rule-002), OWASP Top 10 A01:2021-Broken Access Control',
        assignedModelId: 'cloud-claude35',
        status: 'Pending',
        createdAt: Date.now() - 1800000,
        updatedAt: Date.now() - 1800000,
      },
      {
        id: '002',
        filePath: 'auth/views.py',
        line: 23,
        type: 'Security',
        severity: 'Critical',
        problem: 'Unauthenticated API endpoint allows credential brute-force without rate limiting.',
        suggestedFix: 'Attach ScopedRateThrottle and authenticate_token validator.',
        evidenceSnippet: 'class AuthTokenView(APIView):\n    permission_classes = []',
        ruleReference: 'Security Skill, Django DRF Guidelines',
        assignedModelId: 'cloud-gemini25',
        status: 'Assigned',
        createdAt: Date.now() - 1800000,
        updatedAt: Date.now() - 1800000,
      },
      {
        id: '003',
        filePath: 'settings.py',
        line: 112,
        type: 'Architecture',
        severity: 'Medium',
        problem: 'CORS_ALLOW_ALL_ORIGINS set to True in production settings template.',
        suggestedFix: 'Restrict CORS_ALLOWED_ORIGINS to configured domains.',
        evidenceSnippet: 'CORS_ALLOW_ALL_ORIGINS = True',
        ruleReference: 'Rule-001 (Architecture Boundaries)',
        assignedModelId: 'lmstudio-qwen',
        status: 'Fixed',
        createdAt: Date.now() - 1800000,
        updatedAt: Date.now() - 600000,
      },
      {
        id: '004',
        filePath: 'api/endpoints.py',
        line: 45,
        type: 'Bug',
        severity: 'High',
        problem: 'Unhandled NoneType exception when user profile object is missing.',
        suggestedFix: 'Wrap in get_object_or_404 or add safe navigation.',
        evidenceSnippet: 'profile = user.profile.bio',
        ruleReference: 'Python Skill conventions',
        status: 'Manual',
        createdAt: Date.now() - 1800000,
        updatedAt: Date.now() - 1800000,
      },
      {
        id: '005',
        filePath: 'auth/models.py',
        line: 67,
        type: 'Performance',
        severity: 'High',
        problem: 'N+1 query problem during bulk user profile lookup.',
        suggestedFix: 'Apply select_related("profile") on QuerySet.',
        evidenceSnippet: 'for u in User.objects.all(): print(u.profile.phone)',
        ruleReference: 'Django Skill conventions',
        assignedModelId: 'cloud-claude35',
        status: 'Pending',
        createdAt: Date.now() - 1800000,
        updatedAt: Date.now() - 1800000,
      },
      {
        id: '006',
        filePath: 'utils/helpers.py',
        line: 19,
        type: 'Typing',
        severity: 'Medium',
        problem: 'Function signature missing type hints on payload argument.',
        suggestedFix: 'Annotate payload: Dict[str, Any] -> bool.',
        evidenceSnippet: 'def parse_payload(payload):',
        ruleReference: 'Python Skill conventions',
        status: 'Pending',
        createdAt: Date.now() - 1800000,
        updatedAt: Date.now() - 1800000,
      },
      {
        id: '007',
        filePath: 'auth/tokens.py',
        line: 52,
        type: 'Security',
        severity: 'High',
        problem: 'Weak random seed used for temporary password reset token.',
        suggestedFix: 'Use secrets.token_urlsafe(32) instead of random.randint().',
        evidenceSnippet: 'token = str(random.randint(100000, 999999))',
        ruleReference: 'Security Skill conventions',
        assignedModelId: 'ollama-codellama',
        status: 'Assigned',
        createdAt: Date.now() - 1800000,
        updatedAt: Date.now() - 1800000,
      },
      {
        id: '008',
        filePath: 'auth/signals.py',
        line: 14,
        type: 'Architecture',
        severity: 'Medium',
        problem: 'Direct synchronous webhook dispatch inside post_save signal.',
        suggestedFix: 'Enqueue background Celery task or async worker queue.',
        evidenceSnippet: 'requests.post("https://api.external.com/hook", data=user_data)',
        ruleReference: 'Architecture Skill conventions',
        status: 'Pending',
        createdAt: Date.now() - 1800000,
        updatedAt: Date.now() - 1800000,
      },
    ],
  };

  private constructor() {}

  public static getInstance(): AuditReportManager {
    if (!AuditReportManager.instance) {
      AuditReportManager.instance = new AuditReportManager();
    }
    return AuditReportManager.instance;
  }

  public getReport(): AuditReport {
    return { ...this.currentReport };
  }

  public updateIssue(issueId: string, updates: Partial<AuditIssue>): AuditIssue | undefined {
    const issue = this.currentReport.issues.find((i) => i.id === issueId);
    if (issue) {
      Object.assign(issue, updates, { updatedAt: Date.now() });
      this.recomputeStats();
      logger.info(`Audit Issue #${issueId} updated: status=${issue.status}, assigned=${issue.assignedModelId}`);
      return issue;
    }
    return undefined;
  }

  private recomputeStats() {
    this.currentReport.criticalCount = this.currentReport.issues.filter((i) => i.severity === 'Critical').length;
    this.currentReport.highCount = this.currentReport.issues.filter((i) => i.severity === 'High').length;
    this.currentReport.mediumCount = this.currentReport.issues.filter((i) => i.severity === 'Medium').length;
    this.currentReport.pendingCount = this.currentReport.issues.filter((i) => i.status === 'Pending').length;
    this.currentReport.fixedCount = this.currentReport.issues.filter((i) => i.status === 'Fixed').length;
  }

  public addReport(report: AuditReport): void {
    this.currentReport = report;
    logger.info(`New audit report registered with ${report.issues.length} findings`);
  }
}

export const auditReportManager = AuditReportManager.getInstance();
