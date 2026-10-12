import { ContextPackageDetail } from '../types/messages';
import { WorkplanPhase } from '../types/task';
import { projectProfileManager } from './projectProfile';
import { ruleEngine } from './ruleEngine';
import { skillEngine } from './skillEngine';
import { evidenceManager } from './evidenceManager';
import { workspaceContext } from './workspaceContext';

export class ContextPackager {
  private static instance: ContextPackager;

  private constructor() {}

  public static getInstance(): ContextPackager {
    if (!ContextPackager.instance) {
      ContextPackager.instance = new ContextPackager();
    }
    return ContextPackager.instance;
  }

  public packageForModel(modelContextLimit = 128000, activePhase?: WorkplanPhase): ContextPackageDetail {
    const profile = projectProfileManager.getProfile();
    const effectiveRules = ruleEngine.getEffectiveRules();
    const activeSkills = skillEngine.getActiveSkills();
    const diagnostics = workspaceContext.getDiagnosticsSummary();

    const includedFiles = [
      { path: 'auth/service.py', tokenCount: 4200, reason: 'Active target file for authentication logic' },
      { path: 'auth/views.py', tokenCount: 2800, reason: 'Calling view controller with auth dependency' },
      { path: 'settings.py', tokenCount: 3100, reason: 'Project security & auth middleware config' },
      { path: 'docs/Blueprint.md', tokenCount: 6200, reason: 'Architecture specification & phase objectives' },
      { path: 'urls.py', tokenCount: 1400, reason: 'Routing table definitions' },
    ];

    const excludedFiles = [
      { path: 'static/css/theme.css', reason: 'Excluded by context budget / irrelevant to backend phase' },
      { path: 'templates/base.html', reason: 'Frontend template outside authentication logic scope' },
      { path: 'tests/test_payment.py', reason: 'Unrelated payment test suite' },
      { path: 'intake/plugin.zip', reason: 'Raw archive excluded; structured evidence extracted' },
    ];

    const usedTokens = includedFiles.reduce((acc, f) => acc + f.tokenCount, 0) +
      effectiveRules.activeRules.length * 250 +
      activeSkills.length * 400 +
      2500; // Base prompt tokens

    return {
      projectProfile: profile,
      activePhase,
      includedFiles,
      excludedFiles,
      effectiveRulesCount: effectiveRules.activeRules.length,
      activeSkillsCount: activeSkills.length,
      diagnosticsCount: diagnostics.count,
      gitChangesCount: 2,
      totalTokensUsed: usedTokens,
      totalTokensBudget: modelContextLimit,
    };
  }
}

export const contextPackager = ContextPackager.getInstance();
