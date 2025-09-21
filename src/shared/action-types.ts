/**
 * Data structure for email detection events
 */
export interface EmailDetectionData {
  emails: string[];
  text: string;
  timestamp: number;
}

/**
 * Event stored in browser history for tracking email detection
 */
export interface HistoryEvent {
  id: string;
  type: 'EMAIL_DETECTED' | 'EMAIL_NOT_DETECTED';
  timestamp: number;
  data?: EmailDetectionData;
}
