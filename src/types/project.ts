export type IntakeSourceType = 'folder' | 'zip' | 'files' | 'manual';

export interface EvidenceItem {
  id: string;
  sourceName: string;
  sourceType: IntakeSourceType;
  path: string;
  fileType: string;
  sizeBytes: number;
  status: 'complete' | 'partial' | 'limited' | 'failed';
  warningMessage?: string;
  extractedTextPreview?: string;
  tokenEstimate: number;
  indexedAt: number;
}

export interface ProjectEvidenceSummary {
  totalFiles: number;
  indexedFiles: number;
  warningFiles: number;
  failedFiles: number;
  completenessPercentage: number; // e.g. 94%
  breakdown: Record<string, number>; // { 'PHP': 48, 'JS': 7, 'CSS': 5, 'JSON': 3, 'Images': 4 }
  lastUpdated: number;
}

export interface ProjectProfile {
  name: string;
  type: string; // 'Web Application', 'Backend Service', 'WordPress Plugin', 'CLI Tool'
  languages: string[]; // ['Python', 'JavaScript']
  frameworks: string[]; // ['Django', 'React']
  runtimes: string[]; // ['Python 3.13', 'Node 22']
  packageManagers: string[]; // ['uv', 'npm']
  testFrameworks: string[]; // ['pytest', 'Vitest']
  buildTools: string[]; // ['Vite']
  totalCodeLines?: number;
  rootPath: string;
}
