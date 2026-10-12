import React from 'react';
import { Bot, ChevronDown, Sparkles, Sliders } from 'lucide-react';
import { AgentRole } from '../types/agent';
import { agentManager } from '../core/agentManager';
import { webviewBridge } from '../webview/messages';

interface AgentModuleProps {
  selectedRole: AgentRole;
  onOpenStageModels: () => void;
  isExecuting: boolean;
}

export const AgentModule: React.FC<AgentModuleProps> = ({
  selectedRole,
  onOpenStageModels,
  isExecuting,
}) => {
  const currentAgent = agentManager.getAgentDefinition(selectedRole);

  const agents: Array<{ role: AgentRole; label: string }> = [
    { role: 'architect', label: 'Architect / Planner' },
    { role: 'coder', label: 'Coding Agent' },
    { role: 'reviewer', label: 'Code Reviewer' },
    { role: 'audit', label: 'Audit Agent' },
    { role: 'fixer', label: 'Fix Agent' },
    { role: 'production', label: 'Production Reviewer' },
  ];

  return (
    <div className="p-3 border-b border-[#242426] space-y-2">
      <div className="flex items-center justify-between text-[10px] font-bold text-[#71717a] tracking-wider uppercase">
        <span>AGENT</span>
        <button
          onClick={onOpenStageModels}
          title="Configure Stage Model Assignments"
          className="text-[#71717a] hover:text-[#f0f0f2] flex items-center gap-1 normal-case text-[11px] transition-colors"
        >
          <Sliders className="w-3 h-3" /> Stages
        </button>
      </div>

      <div className="relative">
        <select
          value={selectedRole}
          onChange={(e) => {
            webviewBridge.send({
              type: 'setAgent',
              payload: { role: e.target.value as AgentRole },
            });
          }}
          className="w-full bg-[#121214] border border-[#242426] rounded-md px-2.5 py-1.5 text-xs text-[#f0f0f2] appearance-none focus:outline-hidden focus:border-blue-500 pr-7 font-medium transition-colors"
        >
          {agents.map((a) => (
            <option key={a.role} value={a.role} className="bg-[#121214] text-[#f0f0f2]">
              {a.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-[#71717a] absolute right-2.5 top-2.5 pointer-events-none" />
      </div>

      <div className="text-[11px] text-[#8e8e96] leading-relaxed">
        {currentAgent.shortDescription}
      </div>
    </div>
  );
};
