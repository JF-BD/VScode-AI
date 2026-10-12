import { WorkplanPhase } from '../types/task';
import { logger } from './logger';

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  defaultPhases: WorkplanPhase[];
}

export class WorkflowEngine {
  private static instance: WorkflowEngine;

  private workflows: WorkflowDefinition[] = [
    {
      id: 'coding',
      name: 'Coding Workflow',
      description: 'Standard staged development: Plan → Code → Review → Fix → Production',
      defaultPhases: [
        { id: 'p1', number: 1, title: 'Foundation & Environment Setup', objective: 'Verify dependencies, settings, and base config', status: 'completed', gitCheckpointTag: 'phase-01-foundation' },
        { id: 'p2', number: 2, title: 'Data Layer & Schema', objective: 'Models, migrations, ORM selectors & query boundaries', status: 'completed', gitCheckpointTag: 'phase-02-data-layer' },
        { id: 'p3', number: 3, title: 'Provider Layer & Authentication', objective: 'Token verification, DRF auth, permission checking', status: 'active', gitCheckpointTag: 'phase-03-provider-layer' },
        { id: 'p4', number: 4, title: 'Agent Runtime & Services', objective: 'Business logic services, controllers, error wrappers', status: 'pending' },
        { id: 'p5', number: 5, title: 'UI / View Integration', objective: 'REST views, serializers, templates, responses', status: 'pending' },
        { id: 'p6', number: 6, title: 'Audit & Vulnerability Scan', objective: 'Security scanning, OWASP review, typing audit', status: 'pending' },
        { id: 'p7', number: 7, title: 'Fix Queue & Hardening', objective: 'Address all critical/high audit findings', status: 'pending' },
        { id: 'p8', number: 8, title: 'Production Readiness & Release', objective: 'Final diagnostics, git checkpoints, staging test', status: 'pending' },
      ],
    },
    {
      id: 'planning',
      name: 'Planning Workflow',
      description: 'Extract evidence, check blueprint compliance, and generate phase plan',
      defaultPhases: [
        { id: 'pl1', number: 1, title: 'Extract Project Evidence', objective: 'Parse files, ZIPs, docs into structured index', status: 'active' },
        { id: 'pl2', number: 2, title: 'Blueprint & Rules Review', objective: 'Identify contradictions, missing constraints', status: 'pending' },
        { id: 'pl3', number: 3, title: 'Generate Workplan Phases', objective: 'Formulate executable atomic phases with acceptance criteria', status: 'pending' },
      ],
    },
    {
      id: 'review',
      name: 'Code Review Workflow',
      description: 'Comprehensive static review on security, standards, and performance',
      defaultPhases: [
        { id: 'rv1', number: 1, title: 'Blueprint Compliance Check', objective: 'Verify code against architecture specs', status: 'pending' },
        { id: 'rv2', number: 2, title: 'Security & OWASP Scrutiny', objective: 'Analyze authorization, input sanitization', status: 'pending' },
        { id: 'rv3', number: 3, title: 'Testing & Diagnostics Verification', objective: 'Examine test coverage and linter outputs', status: 'pending' },
      ],
    },
    {
      id: 'audit',
      name: 'Audit Workflow',
      description: 'Batch scanner across files into persistent Fixation Reports',
      defaultPhases: [
        { id: 'au1', number: 1, title: 'Workspace File Discovery', objective: 'Enumerate codebase and prioritize batches', status: 'pending' },
        { id: 'au2', number: 2, title: 'Batched AI Inspection', objective: 'Feed structured context batches to audit model', status: 'pending' },
        { id: 'au3', number: 3, title: 'Assemble Fixation Report', objective: 'Normalize findings and initialize Fix Queue', status: 'pending' },
      ],
    },
    {
      id: 'fix',
      name: 'Fix Workflow',
      description: 'Targeted fixes for assigned issues in Fix Queue',
      defaultPhases: [
        { id: 'fx1', number: 1, title: 'Load Target Issue & Evidence', objective: 'Isolate affected file, snippet, and rule', status: 'pending' },
        { id: 'fx2', number: 2, title: 'Generate Surgical Fix', objective: 'Produce minimal validated diff', status: 'pending' },
        { id: 'fx3', number: 3, title: 'Validate & Verify Resolution', objective: 'Confirm problem is resolved without regressions', status: 'pending' },
      ],
    },
    {
      id: 'production',
      name: 'Production Review Workflow',
      description: 'Pre-release deployment gate validation',
      defaultPhases: [
        { id: 'pr1', number: 1, title: 'Diagnostic Cleanliness Check', objective: 'Zero unhandled errors or warnings', status: 'pending' },
        { id: 'pr2', number: 2, title: 'Git Safety & Checkpoint Verification', objective: 'Confirm clean branch and tagged phase', status: 'pending' },
        { id: 'pr3', number: 3, title: 'Release Gate Sign-Off', objective: 'Produce release summary report', status: 'pending' },
      ],
    },
  ];

  private constructor() {}

  public static getInstance(): WorkflowEngine {
    if (!WorkflowEngine.instance) {
      WorkflowEngine.instance = new WorkflowEngine();
    }
    return WorkflowEngine.instance;
  }

  public getWorkflows(): WorkflowDefinition[] {
    return [...this.workflows];
  }

  public getWorkflow(id: string): WorkflowDefinition | undefined {
    return this.workflows.find((w) => w.id === id);
  }
}

export const workflowEngine = WorkflowEngine.getInstance();
