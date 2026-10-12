import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Bug, Wrench, Play, UserCheck, ChevronRight, CheckCircle2 } from 'lucide-react';
import { AuditReport, AuditIssue, AuditScope } from '../types/audit';
import { AIModel } from '../types/ai';
import { webviewBridge } from '../webview/messages';

interface ReviewAuditModuleProps {
  auditReport: AuditReport;
  availableModels: AIModel[];
}

export const ReviewAuditModule: React.FC<ReviewAuditModuleProps> = ({
  auditReport,
  availableModels,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'fixQueue'>('summary');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  const selectedIssue = auditReport.issues.find((i) => i.id === selectedIssueId);

  return (
    <div className="p-3 border-b border-[#242426] space-y-2.5">
      <div className="flex items-center justify-between text-[10px] font-bold text-[#71717a] tracking-wider uppercase">
        <span>REVIEW / AUDIT</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
              activeTab === 'summary' ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20' : 'text-[#71717a] hover:text-[#f0f0f2]'
            }`}
          >
            Report
          </button>
          <button
            onClick={() => setActiveTab('fixQueue')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
              activeTab === 'fixQueue' ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20' : 'text-[#71717a] hover:text-[#f0f0f2]'
            }`}
          >
            Fix Queue ({auditReport.pendingCount})
          </button>
        </div>
      </div>

      {activeTab === 'summary' ? (
        <div className="space-y-2">
          {/* Summary badge */}
          <div className="flex items-center justify-between bg-[#1a1a1c] p-2.5 rounded-md border border-[#242426] text-xs">
            <div>
              <span className="font-semibold text-[#f0f0f2]">{auditReport.totalIssues} Issues</span>
              <span className="text-[#8e8e96] ml-1.5">({auditReport.totalFilesScanned} files)</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-rose-400 font-semibold">{auditReport.criticalCount} Critical</span>
              <span className="text-amber-400 font-semibold">{auditReport.highCount} High</span>
              <span className="text-emerald-400">{auditReport.fixedCount} Fixed</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => webviewBridge.send({ type: 'auditWorkspace', payload: { scope: 'current_file' } })}
              className="py-1 px-1.5 bg-[#1a1a1c] hover:bg-[#242428] rounded-md border border-[#242426] text-[11px] text-[#d1d1d6] text-center transition-colors font-medium"
            >
              File Audit
            </button>
            <button
              onClick={() => webviewBridge.send({ type: 'auditWorkspace', payload: { scope: 'selected_files' } })}
              className="py-1 px-1.5 bg-[#1a1a1c] hover:bg-[#242428] rounded-md border border-[#242426] text-[11px] text-[#d1d1d6] text-center transition-colors font-medium"
            >
              Selection
            </button>
            <button
              onClick={() => webviewBridge.send({ type: 'auditWorkspace', payload: { scope: 'entire_workspace' } })}
              className="py-1 px-1.5 bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 rounded-md border border-blue-500/30 text-[11px] font-medium text-center transition-colors"
            >
              Workspace
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-0.5 custom-scrollbar">
            {auditReport.issues.slice(0, 5).map((issue) => (
              <div
                key={issue.id}
                onClick={() => setSelectedIssueId(selectedIssueId === issue.id ? null : issue.id)}
                className={`p-2.5 rounded-md border cursor-pointer transition-all ${
                  selectedIssueId === issue.id
                    ? 'bg-blue-500/10 border-blue-500/40'
                    : 'bg-[#1a1a1c] border-[#242426] hover:bg-[#242428]'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#f0f0f2] flex items-center gap-1.5">
                    <span className="font-mono text-blue-400">#{issue.id}</span>
                    <span className="truncate max-w-[120px]">{issue.filePath}</span>
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold border ${
                      issue.severity === 'Critical'
                        ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        : issue.severity === 'High'
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    {issue.severity}
                  </span>
                </div>

                <div className="text-[11px] text-[#8e8e96] mt-1 line-clamp-1">
                  {issue.problem}
                </div>

                {selectedIssueId === issue.id && (
                  <div className="mt-2 pt-2 border-t border-[#242426] space-y-2 text-[11px]">
                    <div className="text-[#8e8e96] bg-[#0e0e11] border border-[#242426] p-1.5 rounded-md font-mono text-[10px]">
                      Line {issue.line}: {issue.evidenceSnippet}
                    </div>

                    <div className="flex items-center justify-between gap-1.5 pt-1">
                      <select
                        value={issue.assignedModelId || ''}
                        onChange={(e) => {
                          webviewBridge.send({
                            type: 'assignFixer',
                            payload: { issueId: issue.id, modelId: e.target.value },
                          });
                        }}
                        className="bg-[#121214] border border-[#242426] rounded-md px-2 py-1 text-[11px] text-[#f0f0f2] flex-1 truncate focus:outline-hidden focus:border-blue-500"
                      >
                        <option value="">Choose Fix Model...</option>
                        {availableModels.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          webviewBridge.send({
                            type: 'startFix',
                            payload: { issueId: issue.id },
                          });
                        }}
                        className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded-md border border-emerald-500/30 text-[11px] font-medium shrink-0 flex items-center gap-1 transition-colors"
                      >
                        <Wrench className="w-3 h-3" /> Fix
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          webviewBridge.send({
                            type: 'assignFixer',
                            payload: { issueId: issue.id, isManual: true },
                          });
                        }}
                        className="px-2 py-1 bg-[#1a1a1c] hover:bg-[#242428] text-[#d1d1d6] rounded-md border border-[#242426] text-[11px] shrink-0 transition-colors"
                        title="Mark for Manual Fix"
                      >
                        Manual
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
