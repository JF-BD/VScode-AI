import React, { useState, useEffect } from 'react';
import {
  Files,
  Search,
  GitBranch,
  Play,
  Grid,
  Settings,
  Sparkles,
  Split,
  Terminal as TerminalIcon,
  AlertCircle,
  FileCode,
  Check,
  X,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronDown,
  Layers,
  ShieldAlert,
  FolderTree,
} from 'lucide-react';
import { ExtensionStateSnapshot } from '../types/messages';
import { ProposedChange } from '../types/edits';
import { webviewBridge } from '../webview/messages';
import { SidebarHeader } from './SidebarHeader';
import { ProjectModule } from './ProjectModule';
import { AgentModule } from './AgentModule';
import { TaskModule } from './TaskModule';
import { ModelModule } from './ModelModule';
import { ExecutionModule } from './ExecutionModule';
import { ChangesModule } from './ChangesModule';
import { ContextRulesSkillsModule } from './ContextRulesSkillsModule';
import { ReviewAuditModule } from './ReviewAuditModule';
import { GitModule } from './GitModule';
import { Modals } from './Modals';

export const VSCodeWorkbench: React.FC = () => {
  const [state, setState] = useState<ExtensionStateSnapshot>(webviewBridge.getInitialState());
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeActivityTab, setActiveActivityTab] = useState<'agent' | 'explorer' | 'git' | 'search'>('agent');
  const [recentSteps, setRecentSteps] = useState<any[]>([]);
  const [activeEditorTab, setActiveEditorTab] = useState<'code' | 'diff'>('code');
  const [bottomTab, setBottomTab] = useState<'output' | 'problems' | 'terminal' | 'audit'>('output');

  useEffect(() => {
    const unsubState = webviewBridge.onStateUpdate((newState) => {
      setState(newState);
      if (newState.activeDiffChange) {
        setActiveEditorTab('diff');
      }
    });

    const unsubStep = webviewBridge.onExecutionStep((step) => {
      setRecentSteps((prev) => [...prev, step]);
    });

    return () => {
      unsubState();
      unsubStep();
    };
  }, []);

  const handleOpenDiff = (change: ProposedChange) => {
    webviewBridge.send({ type: 'openDiff', payload: { changeId: change.id } });
    setActiveEditorTab('diff');
  };

  const activeChange = state.activeDiffChange || state.currentTask?.proposedChanges[0] || null;

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0d0d0f] text-[#d1d1d6] font-sans select-none overflow-hidden text-[13px]">
      {/* 1. VS Code Top Window Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#121214] border-b border-[#242426] text-xs text-[#71717a] h-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-2 text-[#8e8e96] font-medium ml-2">
            <span className="hover:text-[#f0f0f2] cursor-pointer transition-colors">File</span>
            <span className="hover:text-[#f0f0f2] cursor-pointer transition-colors">Edit</span>
            <span className="hover:text-[#f0f0f2] cursor-pointer transition-colors">Selection</span>
            <span className="hover:text-[#f0f0f2] cursor-pointer transition-colors">View</span>
            <span className="hover:text-[#f0f0f2] cursor-pointer transition-colors">Go</span>
            <span className="hover:text-[#f0f0f2] cursor-pointer transition-colors">Run</span>
            <span className="hover:text-[#f0f0f2] cursor-pointer transition-colors">Terminal</span>
            <span className="hover:text-[#f0f0f2] cursor-pointer transition-colors">Help</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[#1a1a1c] px-3 py-0.5 rounded-md border border-[#242426] text-xs text-[#d1d1d6]">
          <Search className="w-3 h-3 text-[#71717a]" />
          <span>{state.projectProfile.name} — auth/service.py — SI VsCode AI</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#71717a]">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Agent Active
          </span>
        </div>
      </div>

      {/* 2. Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Activity Bar */}
        <div className="w-12 bg-[#121214] border-r border-[#242426] flex flex-col items-center py-2 shrink-0 justify-between">
          <div className="flex flex-col items-center gap-3 w-full">
            <button
              onClick={() => setActiveActivityTab('agent')}
              title="SI VsCode AI Coding Control Center"
              className={`p-2 rounded relative transition-colors ${
                activeActivityTab === 'agent'
                  ? 'text-white border-l-2 border-blue-500 pl-1.5'
                  : 'text-[#71717a] hover:text-[#f0f0f2]'
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs shadow-blue-500/20">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </button>

            <button
              onClick={() => setActiveActivityTab('explorer')}
              title="Explorer"
              className={`p-2 rounded relative transition-colors ${
                activeActivityTab === 'explorer'
                  ? 'text-white border-l-2 border-blue-500 pl-1.5'
                  : 'text-[#71717a] hover:text-[#f0f0f2]'
              }`}
            >
              <Files className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveActivityTab('search')}
              title="Search"
              className={`p-2 rounded relative transition-colors ${
                activeActivityTab === 'search'
                  ? 'text-white border-l-2 border-blue-500 pl-1.5'
                  : 'text-[#71717a] hover:text-[#f0f0f2]'
              }`}
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveActivityTab('git')}
              title="Source Control"
              className={`p-2 rounded relative transition-colors ${
                activeActivityTab === 'git'
                  ? 'text-white border-l-2 border-blue-500 pl-1.5'
                  : 'text-[#71717a] hover:text-[#f0f0f2]'
              }`}
            >
              <GitBranch className="w-5 h-5" />
              {state.gitStatus.modifiedFiles.length > 0 && (
                <span className="absolute top-1 right-1 bg-blue-600 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {state.gitStatus.modifiedFiles.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setActiveModal('settings')}
              title="Settings"
              className="p-2 text-[#71717a] hover:text-[#f0f0f2] transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Primary Sidebar - SI VsCode AI Control Center */}
        <div className="w-80 bg-[#161618] border-r border-[#242426] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
          {activeActivityTab === 'agent' ? (
            <>
              <SidebarHeader onOpenSettings={() => setActiveModal('settings')} />
              <ProjectModule
                profile={state.projectProfile}
                evidenceSummary={state.evidenceSummary}
                onOpenIntake={() => setActiveModal('intake')}
                onOpenProfile={() => setActiveModal('projectProfile')}
                onOpenEvidence={() => setActiveModal('evidenceDetails')}
              />
              <AgentModule
                selectedRole={state.selectedAgentRole}
                onOpenStageModels={() => setActiveModal('stageModels')}
                isExecuting={state.isExecuting}
              />
              <TaskModule
                currentTask={state.currentTask}
                onOpenNewTask={() => setActiveModal('newTask')}
                isExecuting={state.isExecuting}
              />
              <ModelModule
                models={state.availableModels}
                selectedModelId={state.selectedModelId}
                onOpenSwitchModel={() => setActiveModal('switchModel')}
                contextBudgetUsed={state.currentTask?.contextBudgetUsed || 38000}
                contextBudgetTotal={state.currentTask?.contextBudgetTotal || 128000}
              />
              <ExecutionModule
                currentTask={state.currentTask}
                recentSteps={recentSteps}
              />
              <ChangesModule
                proposedChanges={state.currentTask?.proposedChanges || []}
                activeDiffChange={state.activeDiffChange}
                onOpenDiff={handleOpenDiff}
              />
              <ReviewAuditModule
                auditReport={state.auditReport}
                availableModels={state.availableModels}
              />
              <ContextRulesSkillsModule
                effectiveRules={state.effectiveRules}
                skills={state.skills}
                hookRecords={state.hookRecords}
                contextPackage={state.contextPackage}
              />
              <GitModule
                gitStatus={state.gitStatus}
                onOpenCheckpointModal={() => setActiveModal('gitCheckpoint')}
                onOpenCommitModal={() => setActiveModal('gitCommit')}
              />
            </>
          ) : (
            <div className="p-4 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#71717a]">
                {activeActivityTab.toUpperCase()}
              </div>
              <div className="text-xs text-[#d1d1d6]">
                {activeActivityTab === 'explorer' && (
                  <div className="space-y-1 font-mono text-[12px]">
                    <div className="font-sans font-semibold text-[#f0f0f2] pb-1">▾ MY-DJANGO-APP</div>
                    <div className="pl-2 text-[#d1d1d6]">▾ auth</div>
                    <div className="pl-4 text-emerald-400 font-semibold">service.py (M)</div>
                    <div className="pl-4 text-emerald-400 font-semibold">views.py (M)</div>
                    <div className="pl-4 text-[#8e8e96]">models.py</div>
                    <div className="pl-2 text-emerald-400">settings.py (M)</div>
                    <div className="pl-2 text-[#8e8e96]">urls.py</div>
                    <div className="pl-2 text-[#8e8e96]">manage.py</div>
                    <div className="pl-2 text-[#8e8e96]">requirements.txt</div>
                    <div className="pl-2 text-blue-400 font-medium">.clinerules</div>
                    <div className="pl-2 text-blue-400 font-medium">.cursorrules</div>
                  </div>
                )}
                {activeActivityTab === 'git' && (
                  <div className="space-y-2">
                    <div className="text-xs text-[#f0f0f2] font-semibold">Source Control: Git</div>
                    <div className="text-xs text-[#8e8e96]">Branch: <span className="text-blue-400 font-mono">main</span></div>
                    <div className="pt-2 text-xs font-medium text-[#d1d1d6]">Changes ({state.gitStatus.modifiedFiles.length}):</div>
                    {state.gitStatus.modifiedFiles.map((f) => (
                      <div key={f} className="text-xs text-amber-400 flex items-center justify-between font-mono">
                        <span>{f}</span>
                        <span>M</span>
                      </div>
                    ))}
                  </div>
                )}
                {activeActivityTab === 'search' && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Search workspace..."
                      className="w-full bg-[#0e0e11] border border-[#242426] rounded-md px-2.5 py-1 text-xs text-[#f0f0f2] focus:outline-hidden focus:border-blue-500"
                      defaultValue="AuthService"
                    />
                    <div className="text-[11px] text-[#8e8e96]">3 results in 2 files</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Center & Right: Editor Area & Native VS Code Diff */}
        <div className="flex-1 flex flex-col bg-[#0e0e11] overflow-hidden">
          {/* Editor Tabs Bar */}
          <div className="flex items-center justify-between bg-[#121214] border-b border-[#242426] h-9 px-2 shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveEditorTab('code')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium border-t-2 transition-colors ${
                  activeEditorTab === 'code'
                    ? 'bg-[#0e0e11] text-[#f0f0f2] border-blue-500'
                    : 'bg-[#161618] text-[#71717a] border-transparent hover:bg-[#1a1a1c] hover:text-[#d1d1d6]'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                <span>service.py</span>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              </button>

              {activeChange && (
                <button
                  onClick={() => setActiveEditorTab('diff')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium border-t-2 transition-colors ${
                    activeEditorTab === 'diff'
                      ? 'bg-[#0e0e11] text-[#f0f0f2] border-blue-500'
                      : 'bg-[#161618] text-[#71717a] border-transparent hover:bg-[#1a1a1c] hover:text-[#d1d1d6]'
                  }`}
                >
                  <Split className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Diff: {activeChange.filePath}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">+{activeChange.additionsCount}/-{activeChange.deletionsCount}</span>
                </button>
              )}
            </div>

            {/* Quick Diff Action Bar */}
            {activeEditorTab === 'diff' && activeChange && (
              <div className="flex items-center gap-2 pr-2">
                <span className="text-[11px] text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30 font-medium">
                  ✓ Syntax & Boundary Validated
                </span>
                <button
                  onClick={() => {
                    webviewBridge.send({
                      type: 'applyEdits',
                      payload: { changeIds: [activeChange.id] },
                    });
                    setActiveEditorTab('code');
                  }}
                  className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded-md border border-emerald-500/30 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Approve & Apply
                </button>
                <button
                  onClick={() => {
                    webviewBridge.send({
                      type: 'rejectEdits',
                      payload: { changeIds: [activeChange.id] },
                    });
                    setActiveEditorTab('code');
                  }}
                  className="px-2.5 py-1 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 rounded-md border border-rose-500/30 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            )}
          </div>

          {/* Editor Body */}
          <div className="flex-1 overflow-auto bg-[#0e0e11] font-mono text-[13px] leading-relaxed custom-scrollbar">
            {activeEditorTab === 'diff' && activeChange ? (
              /* Native VS Code Split Diff View */
              <div className="p-4 space-y-0.5">
                <div className="bg-[#161618] p-2.5 rounded-md border border-[#242426] mb-3 text-xs font-sans flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[#8e8e96]">Proposed by Coding Agent:</span>
                    <span className="text-[#f0f0f2] font-semibold">{activeChange.rationale || 'Token security enhancement'}</span>
                  </div>
                  <div className="text-blue-400 text-xs font-mono">Model: {state.selectedModelId}</div>
                </div>

                <div className="border border-[#242426] rounded-md overflow-hidden bg-[#121214]">
                  {activeChange.diffLines?.map((line, idx) => (
                    <div
                      key={idx}
                      className={`flex items-stretch px-2 py-0.5 text-xs font-mono select-text ${
                        line.type === 'add'
                          ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500'
                          : line.type === 'delete'
                          ? 'bg-rose-500/10 text-rose-400 border-l-2 border-rose-500 line-through opacity-80'
                          : line.type === 'header'
                          ? 'bg-[#1a1a1c] text-blue-400 font-semibold'
                          : 'text-[#d1d1d6]'
                      }`}
                    >
                      <div className="w-10 text-[#52525b] shrink-0 text-right pr-3 select-none text-[11px]">
                        {line.oldLineNumber || ''}
                      </div>
                      <div className="w-10 text-[#52525b] shrink-0 text-right pr-3 select-none text-[11px]">
                        {line.newLineNumber || ''}
                      </div>
                      <div className="w-4 text-center shrink-0 select-none font-bold">
                        {line.type === 'add' ? '+' : line.type === 'delete' ? '-' : ' '}
                      </div>
                      <div className="flex-1 whitespace-pre pl-1">{line.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Regular Active File Editor View */
              <div className="p-4">
                <div className="text-xs text-[#8e8e96] font-sans pb-2 flex items-center gap-2 border-b border-[#242426] mb-3">
                  <span>auth &gt; service.py &gt; AuthService &gt; authenticate_token</span>
                </div>
                <div className="space-y-0.5">
                  {state.activeEditorFile?.content.split('\n').map((lineText, idx) => (
                    <div key={idx} className="flex items-start text-xs select-text hover:bg-[#161618]">
                      <span className="w-10 text-[#52525b] shrink-0 text-right pr-4 select-none text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="flex-1 whitespace-pre text-[#e1e1e4]">
                        {lineText || ' '}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Panel: Output, Problems, Terminal, Audit Log */}
          <div className="h-44 bg-[#121214] border-t border-[#242426] flex flex-col shrink-0">
            <div className="flex items-center justify-between px-3 py-1 bg-[#161618] border-b border-[#242426] text-xs">
              <div className="flex items-center gap-3 font-medium">
                <button
                  onClick={() => setBottomTab('output')}
                  className={`pb-0.5 border-b-2 transition-colors ${
                    bottomTab === 'output' ? 'text-white border-blue-500' : 'text-[#71717a] border-transparent hover:text-[#d1d1d6]'
                  }`}
                >
                  Agent Output
                </button>
                <button
                  onClick={() => setBottomTab('problems')}
                  className={`pb-0.5 border-b-2 flex items-center gap-1.5 transition-colors ${
                    bottomTab === 'problems' ? 'text-white border-blue-500' : 'text-[#71717a] border-transparent hover:text-[#d1d1d6]'
                  }`}
                >
                  Problems
                  <span className="bg-[#242428] text-[#d1d1d6] text-[10px] px-1.5 rounded-md font-mono">2</span>
                </button>
                <button
                  onClick={() => setBottomTab('audit')}
                  className={`pb-0.5 border-b-2 flex items-center gap-1.5 transition-colors ${
                    bottomTab === 'audit' ? 'text-white border-blue-500' : 'text-[#71717a] border-transparent hover:text-[#d1d1d6]'
                  }`}
                >
                  Fixation Report
                  <span className="bg-rose-500/15 text-rose-400 text-[10px] px-1.5 rounded-md font-semibold border border-rose-500/30">2 Critical</span>
                </button>
                <button
                  onClick={() => setBottomTab('terminal')}
                  className={`pb-0.5 border-b-2 transition-colors ${
                    bottomTab === 'terminal' ? 'text-white border-blue-500' : 'text-[#71717a] border-transparent hover:text-[#d1d1d6]'
                  }`}
                >
                  Terminal
                </button>
              </div>
              <div className="text-[#71717a] text-[11px]">
                SI VsCode AI Engine v1.0.0
              </div>
            </div>

            <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] space-y-1 custom-scrollbar bg-[#0e0e11]">
              {bottomTab === 'output' && (
                <div className="space-y-1 text-[#8e8e96]">
                  <div className="text-blue-400">[INFO] SI VsCode AI Extension Host activated successfully.</div>
                  <div className="text-blue-400">[INFO] Loaded rules from .clinerules, .cursorrules (5 effective rules).</div>
                  <div className="text-blue-400">[INFO] Project Evidence indexed (67 files, completeness 94%).</div>
                  <div className="text-emerald-400">[AGENT] Active Role: {state.selectedAgentRole.toUpperCase()} | Assigned Model: {state.selectedModelId}</div>
                  {recentSteps.map((s, i) => (
                    <div key={i} className="text-[#d1d1d6]">
                      <span className="text-[#71717a]">[Iteration {s.iterationNumber}]</span> {s.action} &rarr; <span className="text-emerald-400">{s.result}</span>
                    </div>
                  ))}
                </div>
              )}

              {bottomTab === 'problems' && (
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>auth/service.py:14 — Unresolved database transaction boundary in auth token resolver.</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>auth/views.py:8 — Missing permission_classes attribute on LoginView.</span>
                  </div>
                </div>
              )}

              {bottomTab === 'audit' && (
                <div className="space-y-1.5 font-sans text-xs">
                  {state.auditReport.issues.map((issue) => (
                    <div key={issue.id} className="flex items-center justify-between bg-[#161618] p-2 rounded-md border border-[#242426]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-blue-400">#{issue.id}</span>
                        <span className="text-[#f0f0f2] font-semibold">{issue.filePath}:{issue.line}</span>
                        <span className="text-[#8e8e96] truncate max-w-[350px]">{issue.problem}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-rose-400 font-semibold">{issue.severity}</span>
                        <span className="text-emerald-400">[{issue.status}]</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {bottomTab === 'terminal' && (
                <div className="text-[#d1d1d6] space-y-1">
                  <div>$ uv run pytest tests/test_auth.py</div>
                  <div className="text-emerald-400">============================= test session starts ==============================</div>
                  <div className="text-[#d1d1d6]">collected 4 items</div>
                  <div className="text-emerald-400">tests/test_auth.py ....                                                   [100%]</div>
                  <div className="text-emerald-400">============================== 4 passed in 0.24s ===============================</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. VS Code Bottom Status Bar */}
      <div className="flex items-center justify-between px-3 py-0.5 bg-[#161618] border-t border-[#242426] text-[#8e8e96] text-[11px] h-6 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium hover:text-[#f0f0f2] hover:bg-[#242428] px-1.5 py-0.5 rounded-md cursor-pointer transition-colors">
            <GitBranch className="w-3 h-3 text-blue-400" />
            {state.gitStatus.branch}
          </span>
          <span className="flex items-center gap-1 hover:text-[#f0f0f2] hover:bg-[#242428] px-1.5 py-0.5 rounded-md cursor-pointer transition-colors">
            <AlertCircle className="w-3 h-3 text-amber-400" /> 0 Errors, 2 Warnings
          </span>
          <span className="hover:text-[#f0f0f2] hover:bg-[#242428] px-1.5 py-0.5 rounded-md cursor-pointer transition-colors">
            Evidence: {state.evidenceSummary.completenessPercentage}%
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span
            onClick={() => setActiveModal('switchModel')}
            className="flex items-center gap-1 font-medium text-blue-400 hover:text-blue-300 hover:bg-[#242428] px-1.5 py-0.5 rounded-md cursor-pointer transition-colors"
            title="Switch Model"
          >
            <Sparkles className="w-3 h-3" /> {state.selectedModelId}
          </span>
          <span>UTF-8</span>
          <span>Python 3.13 (uv)</span>
        </div>
      </div>

      {/* Modals Container */}
      <Modals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        availableModels={state.availableModels}
        selectedModelId={state.selectedModelId}
        stageModelAssignments={state.stageModelAssignments}
        projectProfile={state.projectProfile}
        evidenceItems={state.evidenceSummary ? [] : []}
        config={state.config}
      />
    </div>
  );
};
