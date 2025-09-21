import React from 'react';
import { type HistoryEvent } from '@/shared/action-types';

interface HistoryItemProps {
  event: HistoryEvent;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ event }) => {
  return (
    <div className="history-item">
      <div className="event-info">
        <span className="event-icon">{getEventIcon(event.type)}</span>
        <span className="event-label">{getEventLabel(event.type)}</span>
        <span className="event-time">{formatTimestamp(event.timestamp)}</span>
      </div>

      {event.type === 'EMAIL_DETECTED' && event.data && (
        <div className="event-details">
          <div className="detected-emails-history">
            {event.data.emails.map((email: string, index: number) => (
              <span key={index} className="email-badge">
                {email}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const getEventIcon = (type: HistoryEvent["type"]) => {
  switch (type) {
    case 'EMAIL_DETECTED':
      return '🚨';
    case 'EMAIL_NOT_DETECTED':
      return '✅';
    default:
      return '📝';
  }
};

const getEventLabel = (type: HistoryEvent["type"]) => {
  switch (type) {
    case 'EMAIL_DETECTED':
      return 'Email Detected';
    case 'EMAIL_NOT_DETECTED':
      return 'Safe Prompt';
    default:
      return 'Unknown Event';
  }
};
