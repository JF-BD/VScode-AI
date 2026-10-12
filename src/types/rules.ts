export type RuleSource = '.clinerules' | '.cursorrules' | 'workspace' | 'global';

export interface RuleDefinition {
  id: string;
  source: RuleSource;
  title: string;
  content: string;
  category: 'global' | 'project' | 'language' | 'framework' | 'task';
  isActive: boolean;
  priority: number;
}

export interface EffectiveRuleSet {
  totalRules: number;
  activeRules: RuleDefinition[];
  summaryText: string;
  lastLoaded: number;
}
