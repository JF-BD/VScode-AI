import React from 'react';
import { GitBranch, GitCommit, UploadCloud, Shield, Check, Plus } from 'lucide-react';
import { GitStatusInfo, GitCheckpoint } from '../types/git';
import { webviewBridge } from '../webview/messages';

interface GitModuleProps {
  gitStatus: GitStatusInfo;
  onOpenCheckpointModal: () => void;
  onOpenCommitModal: () => void;
}

export const GitModule: React.FC<GitModuleProps> = ({
  gitStatus,
  onOpenCheckpointModal,
  onOpenCommitModal,
}) => {
  return (
    <div className="p-3 border-b border-[#242426] space-y-2">
      <div className="flex items-center justify-between text-[10px] font-bold text-[#71717a] tracking-wider uppercase">
        <span>GIT SAFETY</span>
        <span className="text-[#8e8e96] font-mono text-[11px] flex items-center gap-1">
          <GitBranch className="w-3 h-3 text-blue-400" /> {gitStatus.branch}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-[#8e8e96]">
        <div>
          Working tree: <span className={gitStatus.isClean ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
            {gitStatus.isClean ? 'Clean' : `Modified: ${gitStatus.modifiedFiles.length}`}
          </span>
        </div>
        {gitStatus.lastCheckpointTag && (
          <div className="text-[11px] text-blue-400 font-mono truncate max-w-[130px]" title={gitStatus.lastCheckpointTag}>
            🏷 {gitStatus.lastCheckpointTag}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-1.5 pt-0.5">
        <button
          onClick={onOpenCheckpointModal}
          className="py-1 px-1.5 bg-[#1a1a1c] hover:bg-[#242428] rounded-md border border-[#242426] text-[11px] font-medium text-[#d1d1d6] text-center flex items-center justify-center gap-1 transition-colors"
          title="Create Phase Checkpoint Tag"
        >
          <Shield className="w-3 h-3 text-blue-400" /> Checkpoint
        </button>

        <button
          onClick={onOpenCommitModal}
          className="py-1 px-1.5 bg-[#1a1a1c] hover:bg-[#242428] rounded-md border border-[#242426] text-[11px] font-medium text-[#d1d1d6] text-center flex items-center justify-center gap-1 transition-colors"
          title="Commit Changes with explicit message"
        >
          <GitCommit className="w-3 h-3 text-emerald-400" /> Commit
        </button>

        <button
          onClick={() => webviewBridge.send({ type: 'gitPush' })}
          className="py-1 px-1.5 bg-[#1a1a1c] hover:bg-[#242428] rounded-md border border-[#242426] text-[11px] font-medium text-[#d1d1d6] text-center flex items-center justify-center gap-1 transition-colors"
          title="Push to remote repository"
        >
          <UploadCloud className="w-3 h-3 text-purple-400" /> Push
        </button>
      </div>
    </div>
  );
};
