import { RuleDefinition, RuleSource } from '../types/rules';

export class RuleLoader {
  public static loadDefaultRules(): RuleDefinition[] {
    return [
      {
        id: 'rule-001',
        source: '.clinerules',
        title: 'Project Architecture & Clean Code',
        content: 'Preserve existing architectural boundaries. Do not rewrite working modules. Always validate edits before applying.',
        category: 'global',
        isActive: true,
        priority: 1,
      },
      {
        id: 'rule-002',
        source: '.cursorrules',
        title: 'Strict Verification & Diagnostics',
        content: 'Verify file types, check syntax boundaries, and ensure no unhandled exceptions or typing regressions.',
        category: 'project',
        isActive: true,
        priority: 2,
      },
      {
        id: 'rule-003',
        source: 'workspace',
        title: 'Safe Edit & Git Checkpoints',
        content: 'Create Git checkpoints at major phase completions. Require user confirmation for destructive workspace modifications.',
        category: 'task',
        isActive: true,
        priority: 3,
      },
      {
        id: 'rule-004',
        source: 'workspace',
        title: 'Multi-Model Staged Workflow',
        content: 'Ensure Planner, Coder, Reviewer, Fixer, and Production Review tasks respect individual assigned model capabilities.',
        category: 'project',
        isActive: true,
        priority: 4,
      },
      {
        id: 'rule-005',
        source: '.clinerules',
        title: 'Zero Malformed Code Application',
        content: 'If an AI response cannot be strictly validated or parsed into clean diffs, refuse file modifications and trigger safe retry.',
        category: 'global',
        isActive: true,
        priority: 5,
      },
    ];
  }
}
