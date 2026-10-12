import React from 'react';
import { FolderGit2, CheckCircle2, ChevronRight, HardDrive, Upload, Plus } from 'lucide-react';
import { ProjectProfile, ProjectEvidenceSummary } from '../types/project';

interface ProjectModuleProps {
  profile: ProjectProfile;
  evidenceSummary: ProjectEvidenceSummary;
  onOpenIntake: () => void;
  onOpenProfile: () => void;
  onOpenEvidence: () => void;
}

export const ProjectModule: React.FC<ProjectModuleProps> = ({
  profile,
  evidenceSummary,
  onOpenIntake,
  onOpenProfile,
  onOpenEvidence,
}) => {
  return (
    <div className="p-3 border-b border-[#242426] space-y-2">
      <div className="flex items-center justify-between text-[10px] font-bold text-[#71717a] tracking-wider uppercase">
        <span>PROJECT</span>
        <button
          onClick={onOpenIntake}
          className="text-blue-400 hover:text-blue-300 flex items-center gap-1 normal-case font-medium text-[11px] transition-colors"
        >
          <Plus className="w-3 h-3" /> Import
        </button>
      </div>

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold text-xs text-[#f0f0f2] flex items-center gap-1.5 truncate">
            <FolderGit2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">{profile.name}</span>
          </div>
          <div className="text-[11px] text-[#8e8e96] mt-0.5 truncate">
            {profile.languages.slice(0, 2).join(' · ')} · {profile.frameworks[0]} · {profile.runtimes[0]}
          </div>
        </div>
        <div
          onClick={onOpenEvidence}
          className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-md text-[11px] text-emerald-400 cursor-pointer hover:bg-emerald-500/20 shrink-0 transition-colors"
          title="Project Evidence Completeness Score"
        >
          <CheckCircle2 className="w-3 h-3" />
          <span className="font-medium">{evidenceSummary.completenessPercentage}%</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 pt-0.5">
        <button
          onClick={onOpenEvidence}
          className="flex-1 py-1 px-2 bg-[#1a1a1c] hover:bg-[#242428] rounded-md border border-[#242426] text-[11px] text-[#d1d1d6] text-center font-medium transition-colors"
        >
          Evidence
        </button>
        <button
          onClick={onOpenProfile}
          className="flex-1 py-1 px-2 bg-[#1a1a1c] hover:bg-[#242428] rounded-md border border-[#242426] text-[11px] text-[#d1d1d6] text-center font-medium transition-colors"
        >
          Profile
        </button>
      </div>
    </div>
  );
};
