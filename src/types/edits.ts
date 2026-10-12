export interface FileDiffLine {
  type: 'unchanged' | 'add' | 'delete' | 'header';
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
}

export interface ValidationCheck {
  name: string;
  category: 'structure' | 'boundary' | 'diagnostics' | 'tests' | 'acceptance';
  status: 'passed' | 'warning' | 'failed';
  message?: string;
}

export interface ProposedChange {
  id: string;
  filePath: string;
  oldContent: string;
  newContent: string;
  additionsCount: number;
  deletionsCount: number;
  status: 'proposed' | 'validated' | 'applied' | 'rejected';
  validationChecks: ValidationCheck[];
  diffLines?: FileDiffLine[];
  rationale?: string;
}

export interface EditOperation {
  type: 'create' | 'update' | 'delete';
  filePath: string;
  content?: string;
  range?: {
    startLine: number;
    startCol: number;
    endLine: number;
    endCol: number;
  };
}
