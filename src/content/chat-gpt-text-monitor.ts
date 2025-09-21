import { extractText } from "@/shared/html-helpers";
import type { EmailDetectionData, HistoryEvent } from "@/shared/action-types";

const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
const TEXTAREA_ID = 'prompt-textarea';
const SUBMIT_BUTTON_ID = 'composer-submit-button';

/**
 * Monitors ChatGPT textarea for email addresses and prevents submission when detected
 */
export class ChatGPTEmailMonitor {
  private promptTextarea: HTMLElement | null = null;
  private observer: MutationObserver | null = null;

  /**
   * Starts monitoring ChatGPT textarea and submit button for email detection
   */
  public start(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.findAndMonitorTextarea();
        this.findAndMonitorSubmitButton();
      });
    } else {
      this.findAndMonitorTextarea();
      this.findAndMonitorSubmitButton();
    }

    this.startObservingLayoutChanges();
  }

  /**
   * Cleans up event listeners and layout observer
   */
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private async persistEventToHistory(type: HistoryEvent['type'], data?: EmailDetectionData): Promise<void> {
    try {
      const result = await chrome.storage.local.get(['eventHistory']);
      const eventHistory: HistoryEvent[] = result.eventHistory || [];

      const newEvent: HistoryEvent = {
        id: crypto.randomUUID(),
        type,
        timestamp: Date.now(),
        data
      };

      eventHistory.unshift(newEvent);

      const maxHistorySize = 100;
      if (eventHistory.length > maxHistorySize) {
        eventHistory.splice(maxHistorySize);
      }

      await chrome.storage.local.set({ eventHistory });
    } catch (error) {
      console.error('Failed to persist event to history:', error);
    }
  }

  private findAndMonitorTextarea(): void {
    const element = document.getElementById(TEXTAREA_ID) as HTMLElement;

    if (element) {
      this.promptTextarea = element;
      this.promptTextarea.addEventListener("keydown", (event) => {
        if (event.key === 'Enter') {
          this.handleSubmit(event);
        }
      }, { capture: true });
      console.log("Textarea keydown event attached")
    }
  }

  private findAndMonitorSubmitButton(): void {
    const element = document.getElementById(SUBMIT_BUTTON_ID) as HTMLElement;

    if (element) {
      element.addEventListener("click", (event) => {
        this.handleSubmit(event);
      }, { capture: true });
      console.log("Submit button click event attached")
    }
  }


  private handleSubmit(event: UIEvent): void {
    const text = extractText(this.promptTextarea);
    if (!text) return;

    const emailsDetected = this.detectEmails(text);

    if (emailsDetected.length > 0) {
      this.onEmailsDetected(event, {
        emails: emailsDetected,
        text,
        timestamp: Date.now(),
      });

    } else {
      this.onEmailNotDetected();
    }
  }

  private detectEmails(text: string): string[] {
    const matches = text.match(EMAIL_REGEX);
    return matches ? [...matches] : [];
  }

  private async onEmailsDetected(event: UIEvent, emailDetectionEvent: EmailDetectionData): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    console.warn('🚨 ChatGPTMonitor: Email addresses detected in ChatGPT prompt!', emailDetectionEvent);

    await this.persistEventToHistory('EMAIL_DETECTED', emailDetectionEvent);

    await chrome.runtime.sendMessage({
      type: 'EMAIL_DETECTED',
      data: emailDetectionEvent,
    });

    await chrome.storage.local.set({
      lastEmailDetection: emailDetectionEvent,
    });

    alert("🚨️ Email Detected in prompt!\n Remove it before sending.")
  }

  private startObservingLayoutChanges(): void {
    this.observer = new MutationObserver((mutations) => {
      let textareaChangeDetected = false;
      let submitButtonChangeDetected = false;

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if ((node as HTMLElement).id === TEXTAREA_ID) {
                textareaChangeDetected = true;
              } else if ((node as HTMLElement).id === SUBMIT_BUTTON_ID) {
                submitButtonChangeDetected = true;
              }
            }
          });
        }
      });

      if (textareaChangeDetected) {
        console.log("New textarea detected");
        this.findAndMonitorTextarea();
      }

      if (submitButtonChangeDetected) {
        console.log("New submit button detected");
        this.findAndMonitorSubmitButton();
      }
    });

    this.observer.observe(document.getElementById("main") || document.body, {
      childList: true,
      subtree: true,
    });
  }

  private onEmailNotDetected(): void {
    console.log('ChatGPTMonitor: No emails detected in prompt');

    this.persistEventToHistory('EMAIL_NOT_DETECTED');

    chrome.runtime.sendMessage({
      type: 'EMAIL_NOT_DETECTED',
    });
  }
}
