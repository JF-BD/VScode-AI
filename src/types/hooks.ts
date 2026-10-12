export type HookLifecyclePoint =
  | 'beforeTask'
  | 'afterTask'
  | 'beforeAIRequest'
  | 'afterAIResponse'
  | 'beforeOperation'
  | 'afterOperation'
  | 'beforeEdit'
  | 'afterEdit'
  | 'beforeValidation'
  | 'afterValidation'
  | 'onError'
  | 'onRetry'
  | 'onCancel';

export interface HookExecutionRecord {
  id: string;
  hookName: HookLifecyclePoint;
  timestamp: number;
  status: 'passed' | 'warning' | 'blocked';
  message: string;
  durationMs: number;
}
