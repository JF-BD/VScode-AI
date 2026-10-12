import React from 'react';
import { Play, Pause, Square, Plus, CheckCircle, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { Task } from '../types/task';
import { webviewBridge } from '../webview/messages';

interface TaskModuleProps {
  currentTask: Task | null;
  onOpenNewTask: () => void;
  isExecuting: boolean;
}

export const TaskModule: React.FC<TaskModuleProps> = ({
  currentTask,
  onOpenNewTask,
  isExecuting,
}) => {
  if (!currentTask) {
    return (
      <div className="p-3 border-b border-[#242426] space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold text-[#71717a] tracking-wider uppercase">
          <span>TASK</span>
        </div>
        <button
          onClick={onOpenNewTask}
          className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs shadow-blue-500/20 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> New Task
        </button>
      </div>
    );
  }

  const isRunning = currentTask.status === 'running';
  const isPaused = currentTask.status === 'paused';
  const isCompleted = currentTask.status === 'completed';

  return (
    <div className="p-3 border-b border-[#242426] space-y-2.5">
      <div className="flex items-center justify-between text-[10px] font-bold text-[#71717a] tracking-wider uppercase">
        <span>TASK</span>
        <button
          onClick={onOpenNewTask}
          className="text-blue-400 hover:text-blue-300 flex items-center gap-1 normal-case font-medium text-[11px] transition-colors"
        >
          <Plus className="w-3 h-3" /> New Task
        </button>
      </div>

      <div>
        <div className="font-semibold text-xs text-[#f0f0f2] leading-snug">
          {currentTask.title}
        </div>
        <div className="text-[11px] text-[#8e8e96] mt-0.5 flex items-center gap-2">
          <span>Phase {String(currentTask.currentPhaseNumber).padStart(2, '0')} / {String(currentTask.totalPhases).padStart(2, '0')}</span>
          <span>·</span>
          <span>Iteration {currentTask.currentIteration}/{currentTask.maxIterations}</span>
        </div>
      </div>

      {/* Status indicator & controls */}
      <div className="flex items-center justify-between pt-0.5">
        <div className="flex items-center gap-1.5 text-xs">
          {isRunning ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Running
            </span>
          ) : isPaused ? (
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              Paused
            </span>
          ) : isCompleted ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              Completed
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[#71717a]">
              <span className="w-2 h-2 rounded-full bg-[#71717a]" />
              Ready
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {isRunning ? (
            <button
              onClick={() => webviewBridge.send({ type: 'pauseTask' })}
              className="px-2 py-1 bg-[#1a1a1c] hover:bg-[#242428] rounded-md border border-[#242426] text-[11px] text-[#d1d1d6] flex items-center gap-1 transition-colors"
            >
              <Pause className="w-3 h-3" /> Pause
            </button>
          ) : isPaused ? (
            <button
              onClick={() => webviewBridge.send({ type: 'resumeTask' })}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-[11px] flex items-center gap-1 font-medium shadow-xs shadow-blue-500/20 transition-colors"
            >
              <Play className="w-3 h-3" /> Resume
            </button>
          ) : (
            <button
              onClick={() => webviewBridge.send({ type: 'startTask', payload: { taskId: currentTask.id } })}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-[11px] flex items-center gap-1 font-medium shadow-xs shadow-blue-500/20 transition-colors"
            >
              <Play className="w-3 h-3" /> Run Phase
            </button>
          )}

          {(isRunning || isPaused) && (
            <button
              onClick={() => webviewBridge.send({ type: 'cancelTask' })}
              className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-md border border-rose-500/25 text-[11px] flex items-center gap-1 transition-colors"
              title="Cancel Execution"
            >
              <Square className="w-3 h-3" /> Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
