export interface EmailDetectionData {
  emails: string[];
  text: string;
  timestamp: number;
}

export interface HistoryEvent {
  id: string;
  type: 'EMAIL_DETECTED' | 'EMAIL_NOT_DETECTED';
  timestamp: number;
  data?: EmailDetectionData;
}
