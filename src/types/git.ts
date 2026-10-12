export interface GitStatusInfo {
  branch: string;
  isClean: boolean;
  modifiedFiles: string[];
  stagedFiles: string[];
  untrackedFiles: string[];
  lastCheckpointTag?: string;
  lastCommitHash?: string;
  lastCommitMessage?: string;
}

export interface GitCheckpoint {
  id: string;
  tag: string;
  phaseId?: string;
  message: string;
  timestamp: number;
  filesAffected: string[];
  hash: string;
}
