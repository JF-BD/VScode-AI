import React from 'react';
import { CheckCircle2, Circle, Clock, AlertTriangle, Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { AgentIteration } from '../types/agent';
import { Task } from '../types/task';

interface ExecutionModuleProps {
  currentTask: Task | null;
  recentSteps: AgentIteration[];
}

export const ExecutionModule: React.FC<ExecutionModuleProps> = ({ currentTask, recentSteps }) => {
  const [expanded, setExpanded] = React.useState(true);

  const stepsList = [
    { title: 'Evidence loaded', status: 'complete' },
    { title: 'Rules loaded', status: 'complete' },
    { title: 'Blueprint reviewed', status: 'complete' },
    { title: 'Preparing Phase Plan', status: currentTask?.status === 'running' ? 'running' : 'complete' },
    { title: 'User diff review', status: currentTask?.status === 'waiting_for_user' ? 'active' : 'pending' },
  ];

  return (
    <div className="p-3 border-b border-[#242426] space-y-2">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between text-[10px] font-bold text-[#71717a] tracking-wider uppercase cursor-pointer select-none"
      >
        <span>EXECUTION</span>
        <button className="text-[#71717a] hover:text-[#f0f0f2] transition-colors">
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {expanded && (
        <div className="space-y-1.5 pt-0.5">
          {stepsList.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              {step.status === 'complete' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : step.status === 'running' ? (
                <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </span>
              ) : step.status === 'active' ? (
                <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                </span>
              ) : (
                <Circle className="w-3.5 h-3.5 text-[#3f3f46] shrink-0" />
              )}
              <span
                className={`${
                  step.status === 'complete'
                    ? 'text-[#d1d1d6]'
                    : step.status === 'running' || step.status === 'active'
                    ? 'text-[#ffffff] font-medium'
                    : 'text-[#52525b]'
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}

          {recentSteps.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-[#242426] bg-[#0e0e11] p-2 rounded-md text-[11px] space-y-1 font-mono">
              <div className="text-blue-400 flex items-center gap-1.5 font-sans font-medium text-xs">
                <Terminal className="w-3 h-3" />
                <span>Iteration {recentSteps[recentSteps.length - 1].iterationNumber}</span>
              </div>
              <div className="text-[#f0f0f2]">
                <span className="text-[#71717a]">Action:</span> {recentSteps[recentSteps.length - 1].action}
              </div>
              <div className="text-[#8e8e96]">
                <span className="text-[#52525b]">Op:</span> {recentSteps[recentSteps.length - 1].operation}
              </div>
              <div className="text-emerald-400 text-[10px]">
                {recentSteps[recentSteps.length - 1].result}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
