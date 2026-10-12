import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, RefreshCw, Cpu, Layers, ShieldCheck, Database, HardDrive, Upload } from 'lucide-react';
import { AIModel, StageModelAssignment, ProviderConfig } from '../types/ai';
import { AgentRole } from '../types/agent';
import { ProjectProfile, EvidenceItem } from '../types/project';
import { webviewBridge } from '../webview/messages';

interface ModalsProps {
  activeModal: string | null;
  onClose: () => void;
  availableModels: AIModel[];
  selectedModelId: string;
  stageModelAssignments: StageModelAssignment;
  projectProfile: ProjectProfile;
  evidenceItems: EvidenceItem[];
  config: ProviderConfig;
}

export const Modals: React.FC<ModalsProps> = ({
  activeModal,
  onClose,
  availableModels,
  selectedModelId,
  stageModelAssignments,
  projectProfile,
  evidenceItems,
  config,
}) => {
  // New Task state
  const [taskTitle, setTaskTitle] = useState('Implement token caching & permission checks');
  const [taskInstruction, setTaskInstruction] = useState('Implement phase 03 requirements: add SHA256 token caching with 5-min TTL, enforce strict token length, and add DRF permission classes.');
  const [taskAgent, setTaskAgent] = useState<AgentRole>('coder');
  const [taskModel, setTaskModel] = useState('cloud-claude35');
  const [taskWorkflow, setTaskWorkflow] = useState('coding');

  // Switch Model state
  const [switchTargetModel, setSwitchTargetModel] = useState(selectedModelId);

  // Settings state
  const [cfg, setCfg] = useState<ProviderConfig>(config);

  // Git state
  const [checkpointMsg, setCheckpointMsg] = useState('Phase 03 Provider Layer completed & verified');
  const [commitMsg, setCommitMsg] = useState('feat(auth): implement token caching and DRF permissions');

  // Intake state
  const [intakeFolder, setIntakeFolder] = useState('django-auth-service');
  const [intakeFilesCount, setIntakeFilesCount] = useState(14);

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in text-[13px] text-[#d1d1d6]">
      <div className="bg-[#121214] border border-[#242426] rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#161618] border-b border-[#242426]">
          <h3 className="font-semibold text-sm text-[#f0f0f2] flex items-center gap-2">
            {activeModal === 'newTask' && 'Create New Persistent Task'}
            {activeModal === 'switchModel' && 'Switch Model (Task State Preserved)'}
            {activeModal === 'stageModels' && 'Stage Model Assignments'}
            {activeModal === 'projectProfile' && 'Project Profile & Detection'}
            {activeModal === 'evidenceDetails' && 'Project Evidence & Artifacts'}
            {activeModal === 'settings' && 'Provider & Environment Settings'}
            {activeModal === 'gitCheckpoint' && 'Create Phase Git Checkpoint'}
            {activeModal === 'gitCommit' && 'Commit Staged Changes'}
            {activeModal === 'intake' && 'Import Project into Evidence Pipeline'}
          </h3>
          <button onClick={onClose} className="text-[#71717a] hover:text-[#f0f0f2] p-1.5 rounded-md hover:bg-[#242428] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-4 custom-scrollbar">
          {activeModal === 'newTask' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[#8e8e96] text-xs mb-1 font-medium">Task Title</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-[#0e0e11] border border-[#242426] rounded-md px-3 py-1.5 text-[#f0f0f2] focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[#8e8e96] text-xs mb-1 font-medium">User Instruction</label>
                <textarea
                  rows={3}
                  value={taskInstruction}
                  onChange={(e) => setTaskInstruction(e.target.value)}
                  className="w-full bg-[#0e0e11] border border-[#242426] rounded-md px-3 py-1.5 text-[#f0f0f2] focus:outline-hidden focus:border-blue-500 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8e8e96] text-xs mb-1 font-medium">Agent Role</label>
                  <select
                    value={taskAgent}
                    onChange={(e) => setTaskAgent(e.target.value as AgentRole)}
                    className="w-full bg-[#0e0e11] border border-[#242426] rounded-md px-2.5 py-1.5 text-[#f0f0f2] focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="architect">Architect / Planner</option>
                    <option value="coder">Coding Agent</option>
                    <option value="reviewer">Code Reviewer</option>
                    <option value="audit">Audit Agent</option>
                    <option value="fixer">Fix Agent</option>
                    <option value="production">Production Reviewer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#8e8e96] text-xs mb-1 font-medium">Model</label>
                  <select
                    value={taskModel}
                    onChange={(e) => setTaskModel(e.target.value)}
                    className="w-full bg-[#0e0e11] border border-[#242426] rounded-md px-2.5 py-1.5 text-[#f0f0f2] focus:outline-hidden focus:border-blue-500"
                  >
                    {availableModels.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.contextWindow / 1000}K)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[#8e8e96] text-xs mb-1 font-medium">Workflow</label>
                <select
                  value={taskWorkflow}
                  onChange={(e) => setTaskWorkflow(e.target.value)}
                  className="w-full bg-[#0e0e11] border border-[#242426] rounded-md px-2.5 py-1.5 text-[#f0f0f2] focus:outline-hidden focus:border-blue-500"
                >
                  <option value="coding">Coding Workflow (Plan → Code → Review → Fix → Production)</option>
                  <option value="planning">Planning Workflow</option>
                  <option value="review">Code Review Workflow</option>
                  <option value="audit">Audit Workflow</option>
                  <option value="fix">Fix Workflow</option>
                  <option value="production">Production Review</option>
                </select>
              </div>
              <div className="bg-[#1a1a1c] p-2.5 rounded-md border border-[#242426] text-xs space-y-1">
                <div className="text-[#8e8e96]">Context & Knowledge auto-attached:</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="bg-[#242428] px-2 py-0.5 rounded-md text-emerald-400 border border-[#242426]">✓ .clinerules</span>
                  <span className="bg-[#242428] px-2 py-0.5 rounded-md text-emerald-400 border border-[#242426]">✓ .cursorrules</span>
                  <span className="bg-[#242428] px-2 py-0.5 rounded-md text-blue-400 border border-[#242426]">Python Skill</span>
                  <span className="bg-[#242428] px-2 py-0.5 rounded-md text-blue-400 border border-[#242426]">Django Skill</span>
                  <span className="bg-[#242428] px-2 py-0.5 rounded-md text-blue-400 border border-[#242426]">Security Skill</span>
                </div>
              </div>
            </div>
          )}

          {activeModal === 'switchModel' && (
            <div className="space-y-3">
              <div className="bg-[#1a1a1c] border border-[#242426] p-3 rounded-md text-xs space-y-1">
                <div className="text-[#f0f0f2] font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  TASK STATE PRESERVED
                </div>
                <div className="text-[#8e8e96]">
                  Switching model will preserve all extracted evidence, workplan phase progress, rule sets, and iteration state. Context will be repackaged for the chosen model’s context limit.
                </div>
              </div>
              <div className="space-y-2">
                {availableModels.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center justify-between p-2.5 rounded-md border cursor-pointer transition-all ${
                      switchTargetModel === m.id
                        ? 'bg-blue-500/10 border-blue-500/40 text-white'
                        : 'bg-[#1a1a1c] border-[#242426] hover:bg-[#242428]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="model"
                        checked={switchTargetModel === m.id}
                        onChange={() => setSwitchTargetModel(m.id)}
                        className="accent-blue-500"
                      />
                      <div>
                        <div className="font-semibold text-xs text-[#f0f0f2]">{m.name}</div>
                        <div className="text-[11px] text-[#8e8e96]">
                          {m.provider.toUpperCase()} · Context: {m.contextWindow / 1000}K tokens {m.capabilities.local ? '· (Local Offline)' : '· (Cloud API)'}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 bg-[#242428] rounded-md border border-[#242426] text-emerald-400 font-medium">
                      ● Available
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeModal === 'stageModels' && (
            <div className="space-y-3">
              <div className="text-xs text-[#8e8e96]">
                Assign individual models tailored for each stage of the development workflow:
              </div>
              <div className="space-y-2">
                {[
                  { roleKey: 'plannerModelId', stage: '01 Planner / Architect', current: stageModelAssignments.plannerModelId },
                  { roleKey: 'coderModelId', stage: '02 Coder / Implementer', current: stageModelAssignments.coderModelId },
                  { roleKey: 'reviewerModelId', stage: '03 Code Reviewer', current: stageModelAssignments.reviewerModelId },
                  { roleKey: 'fixerModelId', stage: '04 Fix Agent', current: stageModelAssignments.fixerModelId },
                  { roleKey: 'productionModelId', stage: '05 Production Reviewer', current: stageModelAssignments.productionModelId },
                ].map((item) => (
                  <div key={item.roleKey} className="flex items-center justify-between bg-[#1a1a1c] p-2.5 rounded-md border border-[#242426]">
                    <div className="font-medium text-xs text-[#f0f0f2]">{item.stage}</div>
                    <select
                      value={item.current}
                      onChange={(e) => {
                        webviewBridge.send({
                          type: 'updateStageModels',
                          payload: { assignments: { [item.roleKey]: e.target.value } },
                        });
                      }}
                      className="bg-[#0e0e11] border border-[#242426] rounded-md px-2.5 py-1 text-xs text-[#f0f0f2] focus:outline-hidden focus:border-blue-500"
                    >
                      {availableModels.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeModal === 'projectProfile' && (
            <div className="space-y-3">
              <div className="bg-[#1a1a1c] p-3 rounded-md border border-[#242426] space-y-2 text-xs">
                <div className="flex justify-between border-b border-[#242426] pb-2">
                  <span className="text-[#8e8e96]">Project Name:</span>
                  <span className="text-[#f0f0f2] font-semibold">{projectProfile.name}</span>
                </div>
                <div className="flex justify-between border-b border-[#242426] pb-2">
                  <span className="text-[#8e8e96]">Architecture Type:</span>
                  <span className="text-emerald-400 font-semibold">{projectProfile.type}</span>
                </div>
                <div className="flex justify-between border-b border-[#242426] pb-2">
                  <span className="text-[#8e8e96]">Languages:</span>
                  <span className="text-[#f0f0f2]">{projectProfile.languages.join(' · ')}</span>
                </div>
                <div className="flex justify-between border-b border-[#242426] pb-2">
                  <span className="text-[#8e8e96]">Frameworks:</span>
                  <span className="text-[#f0f0f2]">{projectProfile.frameworks.join(' · ')}</span>
                </div>
                <div className="flex justify-between border-b border-[#242426] pb-2">
                  <span className="text-[#8e8e96]">Runtimes:</span>
                  <span className="text-[#f0f0f2]">{projectProfile.runtimes.join(' · ')}</span>
                </div>
                <div className="flex justify-between border-b border-[#242426] pb-2">
                  <span className="text-[#8e8e96]">Package Managers:</span>
                  <span className="text-[#f0f0f2]">{projectProfile.packageManagers.join(' · ')}</span>
                </div>
                <div className="flex justify-between border-b border-[#242426] pb-2">
                  <span className="text-[#8e8e96]">Test Frameworks:</span>
                  <span className="text-[#f0f0f2]">{projectProfile.testFrameworks.join(' · ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8e8e96]">Estimated Code Volume:</span>
                  <span className="text-[#f0f0f2] font-mono">{projectProfile.totalCodeLines?.toLocaleString()} lines</span>
                </div>
              </div>
            </div>
          )}

          {activeModal === 'evidenceDetails' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#8e8e96]">
                <span>Indexed Sources ({evidenceItems.length})</span>
                <button
                  onClick={() => webviewBridge.send({ type: 'retryEvidence', payload: {} })}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Retry Warnings
                </button>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {evidenceItems.map((ev) => (
                  <div key={ev.id} className="bg-[#1a1a1c] p-2.5 rounded-md border border-[#242426] space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-xs text-[#f0f0f2]">{ev.sourceName}</div>
                      <span
                        className={`text-[11px] px-1.5 py-0.5 rounded-md font-medium border ${
                          ev.status === 'complete'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {ev.status === 'complete' ? '✓ Complete' : '⚠ ' + ev.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#8e8e96] flex items-center gap-3">
                      <span>Path: {ev.path}</span>
                      <span>{ev.fileType}</span>
                      <span className="font-mono">~{ev.tokenEstimate} tok</span>
                    </div>
                    {ev.warningMessage && (
                      <div className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 p-1.5 rounded-md">
                        {ev.warningMessage}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeModal === 'settings' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[#8e8e96] text-xs mb-1 font-medium">Cloud/API Endpoint</label>
                <input
                  type="text"
                  value={cfg.cloudEndpoint}
                  onChange={(e) => setCfg({ ...cfg, cloudEndpoint: e.target.value })}
                  className="w-full bg-[#0e0e11] border border-[#242426] rounded-md px-3 py-1.5 text-[#f0f0f2] focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[#8e8e96] text-xs mb-1 font-medium">LM Studio Endpoint</label>
                <input
                  type="text"
                  value={cfg.lmStudioEndpoint}
                  onChange={(e) => setCfg({ ...cfg, lmStudioEndpoint: e.target.value })}
                  className="w-full bg-[#0e0e11] border border-[#242426] rounded-md px-3 py-1.5 text-[#f0f0f2] focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[#8e8e96] text-xs mb-1 font-medium">Ollama Endpoint</label>
                <input
                  type="text"
                  value={cfg.ollamaEndpoint}
                  onChange={(e) => setCfg({ ...cfg, ollamaEndpoint: e.target.value })}
                  className="w-full bg-[#0e0e11] border border-[#242426] rounded-md px-3 py-1.5 text-[#f0f0f2] focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="fallback"
                  checked={cfg.autoFallbackEnabled}
                  onChange={(e) => setCfg({ ...cfg, autoFallbackEnabled: e.target.checked })}
                  className="accent-blue-500"
                />
                <label htmlFor="fallback" className="text-xs text-[#d1d1d6]">
                  Enable Automatic Provider Fallback on timeout or rate limit
                </label>
              </div>
            </div>
          )}

          {activeModal === 'intake' && (
            <div className="space-y-3">
              <div className="bg-[#1a1a1c] p-3 rounded-md border border-[#242426] space-y-2">
                <div className="text-xs text-[#8e8e96]">
                  Import codebase folders, ZIP archives, or documentation files directly into the structured Evidence pipeline:
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => {
                      webviewBridge.send({
                        type: 'importFolder',
                        payload: { folderName: intakeFolder, filesCount: intakeFilesCount },
                      });
                      onClose();
                    }}
                    className="flex flex-col items-center justify-center p-3 bg-[#0e0e11] hover:bg-[#242428] rounded-md border border-[#242426] text-center transition-colors"
                  >
                    <HardDrive className="w-5 h-5 text-blue-400 mb-1.5" />
                    <span className="font-semibold text-xs text-[#f0f0f2]">Import Folder</span>
                    <span className="text-[10px] text-[#8e8e96]">Workspace tree</span>
                  </button>
                  <button
                    onClick={() => {
                      webviewBridge.send({
                        type: 'importArchive',
                        payload: { archiveName: 'plugin-django.zip', sizeBytes: 198000 },
                      });
                      onClose();
                    }}
                    className="flex flex-col items-center justify-center p-3 bg-[#0e0e11] hover:bg-[#242428] rounded-md border border-[#242426] text-center transition-colors"
                  >
                    <Database className="w-5 h-5 text-emerald-400 mb-1.5" />
                    <span className="font-semibold text-xs text-[#f0f0f2]">Import ZIP</span>
                    <span className="text-[10px] text-[#8e8e96]">Archive extraction</span>
                  </button>
                  <button
                    onClick={() => {
                      webviewBridge.send({
                        type: 'importFiles',
                        payload: { fileNames: ['Blueprint.md', 'requirements.txt', 'models.py', 'settings.py'] },
                      });
                      onClose();
                    }}
                    className="flex flex-col items-center justify-center p-3 bg-[#0e0e11] hover:bg-[#242428] rounded-md border border-[#242426] text-center transition-colors"
                  >
                    <Upload className="w-5 h-5 text-purple-400 mb-1.5" />
                    <span className="font-semibold text-xs text-[#f0f0f2]">Import Files</span>
                    <span className="text-[10px] text-[#8e8e96]">MD, PY, PHP, JS</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeModal === 'gitCheckpoint' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[#8e8e96] text-xs mb-1 font-medium">Checkpoint Message</label>
                <input
                  type="text"
                  value={checkpointMsg}
                  onChange={(e) => setCheckpointMsg(e.target.value)}
                  className="w-full bg-[#0e0e11] border border-[#242426] rounded-md px-3 py-1.5 text-[#f0f0f2] focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div className="text-xs text-[#8e8e96]">
                Creates an atomic Git checkpoint tag (e.g. <span className="text-emerald-400 font-mono">phase-03-checkpoint</span>) protecting your verified progress before advancing to next phase.
              </div>
            </div>
          )}

          {activeModal === 'gitCommit' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[#8e8e96] text-xs mb-1 font-medium">Commit Message</label>
                <input
                  type="text"
                  value={commitMsg}
                  onChange={(e) => setCommitMsg(e.target.value)}
                  className="w-full bg-[#0e0e11] border border-[#242426] rounded-md px-3 py-1.5 text-[#f0f0f2] focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div className="text-xs text-[#8e8e96]">
                Staged files: <span className="text-[#f0f0f2] font-mono">auth/service.py, auth/views.py, settings.py</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 bg-[#161618] border-t border-[#242426]">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-[#1a1a1c] hover:bg-[#242428] rounded-md border border-[#242426] text-xs font-medium text-[#d1d1d6] transition-colors"
          >
            Cancel
          </button>
          {activeModal === 'newTask' && (
            <button
              onClick={() => {
                webviewBridge.send({
                  type: 'createTask',
                  payload: {
                    title: taskTitle,
                    instruction: taskInstruction,
                    agentRole: taskAgent,
                    modelId: taskModel,
                    workflowId: taskWorkflow,
                  },
                });
                onClose();
              }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-md text-xs font-medium text-white shadow-xs shadow-blue-500/20 transition-colors"
            >
              Start Task
            </button>
          )}
          {activeModal === 'switchModel' && (
            <button
              onClick={() => {
                webviewBridge.send({
                  type: 'switchModel',
                  payload: { newModelId: switchTargetModel },
                });
                onClose();
              }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-md text-xs font-medium text-white shadow-xs shadow-blue-500/20 transition-colors"
            >
              Switch & Resume
            </button>
          )}
          {activeModal === 'settings' && (
            <button
              onClick={() => {
                webviewBridge.send({
                  type: 'saveConfig',
                  payload: { config: cfg },
                });
                onClose();
              }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-md text-xs font-medium text-white shadow-xs shadow-blue-500/20 transition-colors"
            >
              Save Settings
            </button>
          )}
          {activeModal === 'gitCheckpoint' && (
            <button
              onClick={() => {
                webviewBridge.send({
                  type: 'gitCheckpoint',
                  payload: { message: checkpointMsg },
                });
                onClose();
              }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-md text-xs font-medium text-white shadow-xs shadow-blue-500/20 transition-colors"
            >
              Create Checkpoint
            </button>
          )}
          {activeModal === 'gitCommit' && (
            <button
              onClick={() => {
                webviewBridge.send({
                  type: 'gitCommit',
                  payload: { message: commitMsg },
                });
                onClose();
              }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-md text-xs font-medium text-white shadow-xs shadow-blue-500/20 transition-colors"
            >
              Commit Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
