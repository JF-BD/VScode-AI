import { GitStatusInfo, GitCheckpoint } from '../types/git';
import { logger } from './logger';

export class GitEngine {
  private static instance: GitEngine;
  private status: GitStatusInfo = {
    branch: 'main',
    isClean: false,
    modifiedFiles: ['auth/service.py', 'auth/views.py', 'settings.py'],
    stagedFiles: [],
    untrackedFiles: [],
    lastCheckpointTag: 'phase-03-provider-layer',
    lastCommitHash: '7b9e2f1',
    lastCommitMessage: 'Complete data layer models & initial schema migrations',
  };

  private checkpoints: GitCheckpoint[] = [
    {
      id: 'cp-01',
      tag: 'phase-01-foundation',
      phaseId: '01',
      message: 'Phase 01 Foundation initialized and validated',
      timestamp: Date.now() - 7200000,
      filesAffected: ['settings.py', 'manage.py', 'requirements.txt'],
      hash: 'a1b2c3d',
    },
    {
      id: 'cp-02',
      tag: 'phase-02-data-layer',
      phaseId: '02',
      message: 'Phase 02 Data Layer: models, migrations, ORM selectors',
      timestamp: Date.now() - 3600000,
      filesAffected: ['models.py', 'migrations/0001_initial.py'],
      hash: 'e4f5g6h',
    },
  ];

  private constructor() {}

  public static getInstance(): GitEngine {
    if (!GitEngine.instance) {
      GitEngine.instance = new GitEngine();
    }
    return GitEngine.instance;
  }

  public getStatus(): GitStatusInfo {
    return { ...this.status };
  }

  public getCheckpoints(): GitCheckpoint[] {
    return [...this.checkpoints];
  }

  public createCheckpoint(message: string, tag?: string, phaseId?: string): GitCheckpoint {
    const tagName = tag || `checkpoint-${Date.now()}`;
    const hash = Math.random().toString(36).substring(2, 9);
    const cp: GitCheckpoint = {
      id: `cp-${Date.now()}`,
      tag: tagName,
      phaseId,
      message,
      timestamp: Date.now(),
      filesAffected: [...this.status.modifiedFiles, ...this.status.stagedFiles],
      hash,
    };
    this.checkpoints.unshift(cp);
    this.status.lastCheckpointTag = tagName;
    this.status.lastCommitHash = hash;
    this.status.lastCommitMessage = message;
    logger.info(`Git checkpoint created: [${tagName}] "${message}" (hash: ${hash})`);
    return cp;
  }

  public stageFiles(filePaths?: string[]): void {
    const targets = filePaths || this.status.modifiedFiles;
    this.status.stagedFiles = Array.from(new Set([...this.status.stagedFiles, ...targets]));
    this.status.modifiedFiles = this.status.modifiedFiles.filter((f) => !this.status.stagedFiles.includes(f));
    logger.info(`Staged files: ${targets.join(', ')}`);
  }

  public commit(message: string): { hash: string; message: string } {
    const hash = Math.random().toString(36).substring(2, 9);
    this.status.lastCommitHash = hash;
    this.status.lastCommitMessage = message;
    this.status.stagedFiles = [];
    this.status.isClean = this.status.modifiedFiles.length === 0;
    logger.info(`Git commit [${hash}]: ${message}`);
    return { hash, message };
  }

  public push(): { success: boolean; branch: string } {
    logger.info(`Git pushed successfully to remote branch: ${this.status.branch}`);
    return { success: true, branch: this.status.branch };
  }
}

export const gitEngine = GitEngine.getInstance();
