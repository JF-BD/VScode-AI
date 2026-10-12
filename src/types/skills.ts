export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  category: 'language' | 'framework' | 'discipline' | 'tooling';
  conventions: string[];
  recommendedWorkflows: string[];
  validationRules: string[];
  isActive: boolean;
}
