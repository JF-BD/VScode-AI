import React from 'react';
import { GitCommit, Split, Check, X, FileCode, CheckCircle, ShieldCheck } from 'lucide-react';
import { ProposedChange } from '../types/edits';
import { webviewBridge } from '../webview/messages';

interface ChangesModuleProps {
  proposedChanges: ProposedChange[];
  activeDiffChange: ProposedChange | null;
  onOpenDiff: (change: ProposedChange) => void;
}

export const ChangesModule: React.FC<ChangesModuleProps> = ({
  proposedChanges,
  activeDiffChange,
  onOpenDiff,
}) => {
  if (!proposedChanges || proposedChanges.length === 0) {
    return (
      <div className="p-3 border-b border-[#242426] space-y-1">
        <div className="flex items-center justify-between text-[10px] font-bold text-[#71717a] tracking-wider uppercase">
          <span>CHANGES</span>
        </div>
        <div className="text-xs text-[#52525b] italic py-1">
          No proposed changes yet
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 border-b border-[#242426] space-y-2.5">
      <div className="flex items-center justify-between text-[10px] font-bold text-[#71717a] tracking-wider uppercase">
        <span>PROPOSED CHANGES ({proposedChanges.length})</span>
        <span className="text-emerald-400 font-medium normal-case text-[11px] flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Validated
        </span>
      </div>

      <div className="space-y-1.5">
        {proposedChanges.map((change) => {
          const isSelected = activeDiffChange?.id === change.id;
          return (
            <div
              key={change.id}
              onClick={() => onOpenDiff(change)}
              className={`p-2.5 rounded-md border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-blue-500/10 border-blue-500/40 text-white'
                  : 'bg-[#1a1a1c] border-[#242426] hover:bg-[#242428] text-[#d1d1d6]'
              }`}
            >
              <div className="flex items-center justify-between text-xs gap-2">
                <span className="font-medium text-[#f0f0f2] flex items-center gap-1.5 truncate">
                  <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{change.filePath}</span>
                </span>
                <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono">
                  <span className="text-emerald-400">+{change.additionsCount}</span>
                  <span className="text-rose-400">-{change.deletionsCount}</span>
                </div>
              </div>

              {change.rationale && (
                <div className="text-[11px] text-[#8e8e96] mt-1 line-clamp-1">
                  {change.rationale}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 pt-1">
        <button
          onClick={() => {
            const first = proposedChanges[0];
            if (first) onOpenDiff(first);
          }}
          className="flex-1 py-1.5 px-2 bg-[#1a1a1c] hover:bg-[#242428] rounded-md border border-[#242426] text-xs font-medium text-[#d1d1d6] flex items-center justify-center gap-1.5 transition-colors"
        >
          <Split className="w-3.5 h-3.5 text-blue-400" /> Open Diff
        </button>
        <button
          onClick={() => {
            webviewBridge.send({
              type: 'applyEdits',
              payload: { changeIds: proposedChanges.map((c) => c.id) },
            });
          }}
          className="py-1.5 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded-md border border-emerald-500/30 text-xs font-medium flex items-center gap-1 transition-colors"
          title="Approve & Apply WorkspaceEdit"
        >
          <Check className="w-3.5 h-3.5" /> Apply
        </button>
        <button
          onClick={() => {
            webviewBridge.send({
              type: 'rejectEdits',
              payload: { changeIds: proposedChanges.map((c) => c.id) },
            });
          }}
          className="py-1.5 px-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 rounded-md border border-rose-500/30 text-xs font-medium flex items-center gap-1 transition-colors"
          title="Reject Proposed Changes"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
