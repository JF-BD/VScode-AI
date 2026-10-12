export type AuditScope = 'current_file' | 'selected_files' | 'entire_workspace';

export type IssueSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type IssueType = 'Security' | 'Bug' | 'Performance' | 'Architecture' | 'Style' | 'Typing';
export type IssueStatus = 'Pending' | 'Assigned' | 'Fixing' | 'Fixed' | 'Rejected' | 'Manual';

export interface AuditIssue {
  id: string; // e.g. "001", "002"
  filePath: string;
  line: number;
  column?: number;
  type: IssueType;
  severity: IssueSeverity;
  problem: string;
  suggestedFix: string;
  evidenceSnippet?: string;
  ruleReference?: string;
  assignedModelId?: string;
  status: IssueStatus;
  validationStatus?: 'passed' | 'failed' | 'untested';
  createdAt: number;
  updatedAt: number;
}

export interface AuditReport {
  id: string;
  timestamp: number;
  scope: AuditScope;
  totalFilesScanned: number;
  totalIssues: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  pendingCount: number;
  fixedCount: number;
  issues: AuditIssue[];
}
