import React from 'react';
import { Cpu, RefreshCw, Layers, CheckCircle2, ChevronRight, Shuffle } from 'lucide-react';
import { AIModel } from '../types/ai';
import { webviewBridge } from '../webview/messages';

interface ModelModuleProps {
  models: AIModel[];
  selectedModelId: string;
  onOpenSwitchModel: () => void;
  contextBudgetUsed: number;
  contextBudgetTotal: number;
}

export const ModelModule: React.FC<ModelModuleProps> = ({
  models,
  selectedModelId,
  onOpenSwitchModel,
  contextBudgetUsed,
  contextBudgetTotal,
}) => {
  const currentModel = models.find((m) => m.id === selectedModelId) || models[0];

  return (
    <div className="p-3 border-b border-[#242426] space-y-2">
      <div className="flex items-center justify-between text-[10px] font-bold text-[#71717a] tracking-wider uppercase">
        <span>MODEL</span>
        <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium normal-case">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Connected
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Cpu className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <div className="min-w-0">
            <div className="font-semibold text-xs text-[#f0f0f2] truncate">
              {currentModel.name}
            </div>
            <div className="text-[11px] text-[#8e8e96] mt-0.5 truncate">
              Context: {Math.round(contextBudgetTotal / 1000)}K · Used: {Math.round(contextBudgetUsed / 1000)}K
            </div>
          </div>
        </div>

        <button
          onClick={onOpenSwitchModel}
          className="px-2 py-1 bg-[#1a1a1c] hover:bg-[#242428] rounded-md border border-[#242426] text-[11px] text-[#d1d1d6] flex items-center gap-1.5 shrink-0 transition-colors"
          title="Switch Model with state preservation"
        >
          <Shuffle className="w-3 h-3 text-blue-400" />
          Switch
        </button>
      </div>
    </div>
  );
};
