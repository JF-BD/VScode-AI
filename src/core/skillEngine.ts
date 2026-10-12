import { SkillDefinition } from '../types/skills';
import { logger } from './logger';

export class SkillEngine {
  private static instance: SkillEngine;
  private skills: SkillDefinition[] = [
    {
      id: 'skill-python',
      name: 'Python',
      description: 'PEP 8 standards, typing annotations, asyncio patterns, pytest testing fixtures.',
      category: 'language',
      conventions: ['Use explicit type annotations', 'Follow PEP 8 naming conventions', 'Avoid global state in modules'],
      recommendedWorkflows: ['pytest unit testing', 'mypy strict typechecking', 'ruff linting'],
      validationRules: ['Check for unhandled TypeError', 'Validate return types'],
      isActive: true,
    },
    {
      id: 'skill-django',
      name: 'Django',
      description: 'Django REST Framework, ORM query optimization (select_related/prefetch_related), CSRF/Auth safety.',
      category: 'framework',
      conventions: ['Never execute raw SQL without parameterized queries', 'Keep views thin, logic in services/selectors', 'Use explicit permissions on API endpoints'],
      recommendedWorkflows: ['Django migrations check', 'TestCase or APITestCase'],
      validationRules: ['Check for missing permission_classes', 'Ensure foreign key indexes'],
      isActive: true,
    },
    {
      id: 'skill-security',
      name: 'Security',
      description: 'OWASP Top 10 mitigation: SQL injection, XSS, CSRF, IDOR, sensitive data leakage prevention.',
      category: 'discipline',
      conventions: ['Always validate user inputs at the boundary', 'Sanitize rendered HTML output', 'Never hardcode secrets or credentials in codebase'],
      recommendedWorkflows: ['Static analysis security audit', 'Role-based access check'],
      validationRules: ['Scan for hardcoded API keys', 'Validate authorization middleware'],
      isActive: true,
    },
    {
      id: 'skill-php',
      name: 'PHP & WordPress',
      description: 'PSR-12 coding standard, WordPress Plugin APIs, nonces verification, wpdb prepared queries.',
      category: 'language',
      conventions: ['Always verify wp_verify_nonce for forms and AJAX', 'Sanitize with sanitize_text_field / esc_html', 'Use $wpdb->prepare()'],
      recommendedWorkflows: ['PHP_CodeSniffer with WordPress-Core rules', 'PHPUnit plugin tests'],
      validationRules: ['Verify nonces on all POST handlers', 'Ensure capability checks before actions'],
      isActive: false,
    },
    {
      id: 'skill-refactoring',
      name: 'Refactoring',
      description: 'Design patterns, SOLID principles, extracting duplicate logic, maintaining backwards compatibility.',
      category: 'discipline',
      conventions: ['Ensure existing tests pass before and after refactoring', 'Make surgical, atomic changes', 'Extract cohesive helper utilities'],
      recommendedWorkflows: ['Diff inspection', 'Regression test suite run'],
      validationRules: ['Ensure no public API signatures broken'],
      isActive: false,
    },
    {
      id: 'skill-testing',
      name: 'Testing',
      description: 'Unit, integration, and end-to-end testing with mock fixtures, boundary testing, and assertion clarity.',
      category: 'discipline',
      conventions: ['Arrange-Act-Assert structure', 'Mock external network and filesystem calls in unit tests'],
      recommendedWorkflows: ['Run test suite on every edit iteration'],
      validationRules: ['Ensure test assertions are not trivial or skipped'],
      isActive: false,
    },
  ];

  private constructor() {}

  public static getInstance(): SkillEngine {
    if (!SkillEngine.instance) {
      SkillEngine.instance = new SkillEngine();
    }
    return SkillEngine.instance;
  }

  public getSkills(): SkillDefinition[] {
    return [...this.skills];
  }

  public getActiveSkills(): SkillDefinition[] {
    return this.skills.filter((s) => s.isActive);
  }

  public setSkillActive(skillId: string, isActive: boolean): void {
    const s = this.skills.find((item) => item.id === skillId);
    if (s) {
      s.isActive = isActive;
      logger.info(`Skill ${s.name} active state: ${isActive}`);
    }
  }

  public setActiveSkillIds(skillIds: string[]): void {
    this.skills.forEach((s) => {
      s.isActive = skillIds.includes(s.id);
    });
    logger.info(`Active skills updated to: ${skillIds.join(', ')}`);
  }
}

export const skillEngine = SkillEngine.getInstance();
