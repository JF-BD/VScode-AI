import { WebviewToExtensionMessage, ExtensionToWebviewMessage, ExtensionStateSnapshot } from '../types/messages';
import { sidebarProvider } from '../providers/sidebarProvider';

export class WebviewMessageBridge {
  private static instance: WebviewMessageBridge;
  private stateListeners: Array<(state: ExtensionStateSnapshot) => void> = [];
  private stepListeners: Array<(step: any) => void> = [];
  private notificationListeners: Array<(notif: { message: string; type?: string }) => void> = [];

  private constructor() {
    sidebarProvider.registerWebviewListener((msg: ExtensionToWebviewMessage) => {
      if (msg.type === 'stateUpdate') {
        this.stateListeners.forEach((fn) => fn(msg.payload));
      } else if (msg.type === 'executionStep') {
        this.stepListeners.forEach((fn) => fn(msg.payload));
      } else if (msg.type === 'notification') {
        this.notificationListeners.forEach((fn) => fn(msg.payload));
      }
    });
  }

  public static getInstance(): WebviewMessageBridge {
    if (!WebviewMessageBridge.instance) {
      WebviewMessageBridge.instance = new WebviewMessageBridge();
    }
    return WebviewMessageBridge.instance;
  }

  public send(msg: WebviewToExtensionMessage): void {
    sidebarProvider.handleMessage(msg);
  }

  public onStateUpdate(listener: (state: ExtensionStateSnapshot) => void) {
    this.stateListeners.push(listener);
    return () => {
      this.stateListeners = this.stateListeners.filter((l) => l !== listener);
    };
  }

  public onExecutionStep(listener: (step: any) => void) {
    this.stepListeners.push(listener);
    return () => {
      this.stepListeners = this.stepListeners.filter((l) => l !== listener);
    };
  }

  public onNotification(listener: (notif: { message: string; type?: string }) => void) {
    this.notificationListeners.push(listener);
    return () => {
      this.notificationListeners = this.notificationListeners.filter((l) => l !== listener);
    };
  }

  public getInitialState(): ExtensionStateSnapshot {
    return sidebarProvider.getStateSnapshot();
  }
}

export const webviewBridge = WebviewMessageBridge.getInstance();
