import React, { useEffect, useState } from 'react';
import { type HistoryEvent } from '@/shared/action-type';

interface EventHistoryProps {
  isVisible: boolean;
  onToggle: () => void;
}


export const EventHistory: React.FC<EventHistoryProps> = ({ isVisible, onToggle }) => {
  const [events, setEvents] = useState<HistoryEvent[]>([]);

  useEffect(() => {
    loadEventHistory();

    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.eventHistory) {
        setEvents(changes.eventHistory.newValue || []);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  const loadEventHistory = async () => {
    try {
      const result = await chrome.storage.local.get(['eventHistory']);
      setEvents(result.eventHistory || []);
    } catch (error) {
      console.error('Failed to load event history:', error);
    }
  };


  const clearHistory = async () => {
    if (confirm('Are you sure you want to clear all event history?')) {
      try {
        await chrome.storage.local.set({ eventHistory: [] });
        setEvents([]);
      } catch (error) {
        console.error('Failed to clear history:', error);
      }
    }
  };

  return (
    <div className="history-section">
      <div className="history-header" onClick={onToggle}>
        <h3>Event History</h3>
        <span className="toggle-arrow">{isVisible ? '▼' : '▶'}</span>
      </div>

      {isVisible && (
        <div className="history-content">
          <div className="history-controls">
            <span className="event-count">{events.length} events</span>
            {events.length > 0 && (
              <button className="clear-button" onClick={clearHistory}>
                Clear History
              </button>
            )}
          </div>

          <div className="history-list">
            {events.length === 0 ? (
              <div className="no-events">No events recorded yet</div>
            ) : (
              events.map((event) => (
                <div key={event.id} className="history-item">
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
              ))
            )}
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

