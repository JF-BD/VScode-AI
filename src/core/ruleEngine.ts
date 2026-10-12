import { RuleDefinition, EffectiveRuleSet } from '../types/rules';
import { RuleLoader } from './ruleLoader';
import { logger } from './logger';

export class RuleEngine {
  private static instance: RuleEngine;
  private rules: RuleDefinition[] = [];

  private constructor() {
    this.rules = RuleLoader.loadDefaultRules();
  }

  public static getInstance(): RuleEngine {
    if (!RuleEngine.instance) {
      RuleEngine.instance = new RuleEngine();
    }
    return RuleEngine.instance;
  }

  public getEffectiveRules(): EffectiveRuleSet {
    const active = this.rules.filter((r) => r.isActive).sort((a, b) => a.priority - b.priority);
    const summary = active.map((r) => `[${r.source.toUpperCase()}] ${r.title}: ${r.content}`).join('\n');
    return {
      totalRules: this.rules.length,
      activeRules: active,
      summaryText: summary,
      lastLoaded: Date.now(),
    };
  }

  public toggleRule(ruleId: string, isActive: boolean): void {
    const target = this.rules.find((r) => r.id === ruleId);
    if (target) {
      target.isActive = isActive;
      logger.info(`Rule ${ruleId} set to active: ${isActive}`);
    }
  }

  public addCustomRule(rule: Omit<RuleDefinition, 'id'>): RuleDefinition {
    const newRule: RuleDefinition = {
      ...rule,
      id: `rule-${Date.now()}`,
    };
    this.rules.push(newRule);
    logger.info(`Custom rule added: ${newRule.title}`);
    return newRule;
  }
}

export const ruleEngine = RuleEngine.getInstance();
