import React, { useState } from 'react';
import { BookOpen, Layers, ShieldCheck, ChevronDown, ChevronUp, Check, Eye } from 'lucide-react';
import { EffectiveRuleSet } from '../types/rules';
import { SkillDefinition } from '../types/skills';
import { HookExecutionRecord } from '../types/hooks';
import { ContextPackageDetail } from '../types/messages';
import { webviewBridge } from '../webview/messages';

interface ContextRulesSkillsModuleProps {
  effectiveRules: EffectiveRuleSet;
  skills: SkillDefinition[];
  hookRecords: HookExecutionRecord[];
  contextPackage: ContextPackageDetail;
}

export const ContextRulesSkillsModule: React.FC<ContextRulesSkillsModuleProps> = ({
  effectiveRules,
  skills,
  hookRecords,
  contextPackage,
}) => {
  const [openSection, setOpenSection] = useState<'context' | 'rules' | 'skills' | 'hooks' | null>(null);

  const toggle = (section: 'context' | 'rules' | 'skills' | 'hooks') => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="p-3 border-b border-[#242426] space-y-1.5 text-xs text-[#d1d1d6]">
      {/* Context Drawer */}
      <div className="border border-[#242426] rounded-md overflow-hidden">
        <div
          onClick={() => toggle('context')}
          className="flex items-center justify-between p-2 bg-[#1a1a1c] hover:bg-[#242428] cursor-pointer select-none transition-colors"
        >
          <span className="font-semibold text-[10px] text-[#71717a] uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3 h-3 text-blue-400" /> CONTEXT PACKAGE
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-emerald-400 font-mono">
              {Math.round(contextPackage.totalTokensUsed / 1000)}K / {Math.round(contextPackage.totalTokensBudget / 1000)}K
            </span>
            {openSection === 'context' ? <ChevronUp className="w-3 h-3 text-[#71717a]" /> : <ChevronDown className="w-3 h-3 text-[#71717a]" />}
          </div>
        </div>

        {openSection === 'context' && (
          <div className="p-2.5 bg-[#0e0e11] space-y-2 text-[11px] border-t border-[#242426]">
            <div className="font-medium text-[#f0f0f2]">Included Evidence & Files:</div>
            <div className="space-y-1">
              {contextPackage.includedFiles.map((f) => (
                <div key={f.path} className="flex items-center justify-between text-[#8e8e96]">
                  <span className="truncate max-w-[170px] text-[#f0f0f2]">✓ {f.path}</span>
                  <span className="text-[#71717a] font-mono">{f.tokenCount} tok</span>
                </div>
              ))}
            </div>
            <div className="font-medium text-[#f0f0f2] pt-1">Budget Exclusions:</div>
            <div className="space-y-1 text-[#71717a]">
              {contextPackage.excludedFiles.map((f) => (
                <div key={f.path} className="truncate" title={f.reason}>
                  ✕ {f.path} ({f.reason})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rules Drawer */}
      <div className="border border-[#242426] rounded-md overflow-hidden">
        <div
          onClick={() => toggle('rules')}
          className="flex items-center justify-between p-2 bg-[#1a1a1c] hover:bg-[#242428] cursor-pointer select-none transition-colors"
        >
          <span className="font-semibold text-[10px] text-[#71717a] uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3 h-3 text-amber-400" /> EFFECTIVE RULES
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#f0f0f2] font-mono">{effectiveRules.activeRules.length} Active</span>
            {openSection === 'rules' ? <ChevronUp className="w-3 h-3 text-[#71717a]" /> : <ChevronDown className="w-3 h-3 text-[#71717a]" />}
          </div>
        </div>

        {openSection === 'rules' && (
          <div className="p-2.5 bg-[#0e0e11] space-y-1.5 text-[11px] border-t border-[#242426]">
            {effectiveRules.activeRules.map((r) => (
              <div key={r.id} className="bg-[#1a1a1c] p-2 rounded-md border border-[#242426] space-y-0.5">
                <div className="font-medium text-[#f0f0f2] flex items-center justify-between">
                  <span>{r.title}</span>
                  <span className="text-[10px] text-blue-400 font-mono uppercase">{r.source}</span>
                </div>
                <div className="text-[#8e8e96] text-[10px] leading-snug">{r.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skills Drawer */}
      <div className="border border-[#242426] rounded-md overflow-hidden">
        <div
          onClick={() => toggle('skills')}
          className="flex items-center justify-between p-2 bg-[#1a1a1c] hover:bg-[#242428] cursor-pointer select-none transition-colors"
        >
          <span className="font-semibold text-[10px] text-[#71717a] uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-blue-400" /> SKILLS
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#f0f0f2] font-mono">
              {skills.filter((s) => s.isActive).length} Active
            </span>
            {openSection === 'skills' ? <ChevronUp className="w-3 h-3 text-[#71717a]" /> : <ChevronDown className="w-3 h-3 text-[#71717a]" />}
          </div>
        </div>

        {openSection === 'skills' && (
          <div className="p-2.5 bg-[#0e0e11] space-y-1.5 text-[11px] border-t border-[#242426]">
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    const activeIds = s.isActive
                      ? skills.filter((item) => item.isActive && item.id !== s.id).map((i) => i.id)
                      : [...skills.filter((item) => item.isActive).map((i) => i.id), s.id];
                    webviewBridge.send({
                      type: 'setSkills',
                      payload: { activeSkillIds: activeIds },
                    });
                  }}
                  className={`px-2 py-1 rounded-md text-[11px] flex items-center gap-1 border transition-colors ${
                    s.isActive
                      ? 'bg-blue-500/15 border-blue-500/30 text-blue-400 font-medium'
                      : 'bg-[#1a1a1c] border-[#242426] text-[#71717a] hover:text-[#d1d1d6]'
                  }`}
                >
                  {s.isActive && <Check className="w-3 h-3" />}
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hooks Drawer */}
      <div className="border border-[#242426] rounded-md overflow-hidden">
        <div
          onClick={() => toggle('hooks')}
          className="flex items-center justify-between p-2 bg-[#1a1a1c] hover:bg-[#242428] cursor-pointer select-none transition-colors"
        >
          <span className="font-semibold text-[10px] text-[#71717a] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-purple-400" /> LIFECYCLE HOOKS
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-emerald-400">Active</span>
            {openSection === 'hooks' ? <ChevronUp className="w-3 h-3 text-[#71717a]" /> : <ChevronDown className="w-3 h-3 text-[#71717a]" />}
          </div>
        </div>

        {openSection === 'hooks' && (
          <div className="p-2 bg-[#0e0e11] space-y-1 text-[10px] font-mono border-t border-[#242426]">
            {hookRecords.slice(-4).map((h) => (
              <div key={h.id} className="flex items-center justify-between text-[#8e8e96]">
                <span className="text-emerald-400">✓ {h.hookName}</span>
                <span>{h.durationMs}ms</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
