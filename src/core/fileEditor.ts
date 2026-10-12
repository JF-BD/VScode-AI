import { ProposedChange } from '../types/edits';
import { workspaceContext } from './workspaceContext';
import { logger } from './logger';

export class FileEditor {
  private static instance: FileEditor;

  private constructor() {}

  public static getInstance(): FileEditor {
    if (!FileEditor.instance) {
      FileEditor.instance = new FileEditor();
    }
    return FileEditor.instance;
  }

  public async applyChanges(changes: ProposedChange[]): Promise<{ appliedCount: number; files: string[] }> {
    const appliedFiles: string[] = [];
    for (const change of changes) {
      logger.info(`Applying WorkspaceEdit on file: ${change.filePath}`);
      change.status = 'applied';
      appliedFiles.push(change.filePath);

      // If active editor is this file, update its content
      const active = workspaceContext.getActiveEditor();
      if (active && active.path === change.filePath) {
        workspaceContext.setActiveEditor({
          ...active,
          content: change.newContent,
          isModified: false,
        });
      }
    }
    return {
      appliedCount: changes.length,
      files: appliedFiles,
    };
  }

  public rejectChanges(changes: ProposedChange[]): void {
    for (const change of changes) {
      logger.info(`Rejected proposed change on: ${change.filePath}`);
      change.status = 'rejected';
    }
  }
}

export const fileEditor = FileEditor.getInstance();
