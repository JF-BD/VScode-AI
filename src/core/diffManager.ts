import { ProposedChange, FileDiffLine } from '../types/edits';
import { logger } from './logger';

export class DiffManager {
  private static instance: DiffManager;
  private activeDiff: ProposedChange | null = null;

  private constructor() {}

  public static getInstance(): DiffManager {
    if (!DiffManager.instance) {
      DiffManager.instance = new DiffManager();
    }
    return DiffManager.instance;
  }

  public openDiff(change: ProposedChange): ProposedChange {
    logger.info(`Opening native VS Code diff comparison for ${change.filePath}`);
    this.activeDiff = change;
    return change;
  }

  public closeDiff(): void {
    this.activeDiff = null;
  }

  public getActiveDiff(): ProposedChange | null {
    return this.activeDiff;
  }

  public static computeDiffLines(oldText: string, newText: string, filePath = 'file.py'): FileDiffLine[] {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');

    const lines: FileDiffLine[] = [
      { type: 'header', content: `--- a/${filePath}` },
      { type: 'header', content: `+++ b/${filePath}` },
    ];

    let oldIdx = 0;
    let newIdx = 0;

    while (oldIdx < oldLines.length || newIdx < newLines.length) {
      if (oldIdx < oldLines.length && newIdx < newLines.length && oldLines[oldIdx] === newLines[newIdx]) {
        lines.push({
          type: 'unchanged',
          oldLineNumber: oldIdx + 1,
          newLineNumber: newIdx + 1,
          content: oldLines[oldIdx],
        });
        oldIdx++;
        newIdx++;
      } else if (newIdx < newLines.length && (oldIdx >= oldLines.length || !oldLines.includes(newLines[newIdx]))) {
        lines.push({
          type: 'add',
          newLineNumber: newIdx + 1,
          content: newLines[newIdx],
        });
        newIdx++;
      } else if (oldIdx < oldLines.length) {
        lines.push({
          type: 'delete',
          oldLineNumber: oldIdx + 1,
          content: oldLines[oldIdx],
        });
        oldIdx++;
      }
    }

    return lines;
  }
}

export const diffManager = DiffManager.getInstance();
