import React from 'react';
import { Settings, RefreshCw, Sparkles } from 'lucide-react';
import { webviewBridge } from '../webview/messages';

interface SidebarHeaderProps {
  onOpenSettings: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onOpenSettings }) => {
  return (
    <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#121214] border-b border-[#242426] select-none">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-linear-to-br from-blue-600 to-indigo-500 flex items-center justify-center shadow-xs">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
        <span className="font-semibold text-xs text-[#f0f0f2] tracking-wide">
          SI VsCode AI
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => webviewBridge.send({ type: 'ready' })}
          title="Refresh State"
          className="p-1 text-[#71717a] hover:text-[#f0f0f2] hover:bg-[#1a1a1c] rounded-md transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onOpenSettings}
          title="Settings & Provider Config"
          className="p-1 text-[#71717a] hover:text-[#f0f0f2] hover:bg-[#1a1a1c] rounded-md transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
