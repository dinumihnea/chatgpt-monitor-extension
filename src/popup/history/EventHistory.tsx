import React from 'react';
import { useEventHistory } from './EventHistoryContext';
import { HistoryItem } from './HistoryItem';

interface EventHistoryProps {
  isVisible: boolean;
  onToggle: () => void;
}

export const EventHistory: React.FC<EventHistoryProps> = ({ isVisible, onToggle }) => {
  const { events, clearHistory } = useEventHistory();

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
                <HistoryItem key={event.id} event={event}/>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

