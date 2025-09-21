import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { type HistoryEvent } from '@/shared/action-types';

interface EventHistoryContextType {
  events: HistoryEvent[];
  clearHistory: () => Promise<void>;
  loadEventHistory: () => Promise<void>;
}

const EventHistoryContext = createContext<EventHistoryContextType | undefined>(undefined);

interface EventHistoryProviderProps {
  children: ReactNode;
}

export const EventHistoryProvider: React.FC<EventHistoryProviderProps> = ({ children }) => {
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

  const loadEventHistory = useCallback(async () => {
    try {
      const result = await chrome.storage.local.get(['eventHistory']);
      setEvents(result.eventHistory || []);
    } catch (error) {
      console.error('Failed to load event history:', error);
    }
  }, []);

  const clearHistory = useCallback(async () => {
    if (confirm('Are you sure you want to clear all event history?')) {
      try {
        await chrome.storage.local.set({ eventHistory: [] });
        setEvents([]);
      } catch (error) {
        console.error('Failed to clear history:', error);
      }
    }
  }, []);

  const value: EventHistoryContextType = {
    events,
    clearHistory,
    loadEventHistory,
  };

  return (
    <EventHistoryContext.Provider value={value}>
      {children}
    </EventHistoryContext.Provider>
  );
};

export const useEventHistory = (): EventHistoryContextType => {
  const context = useContext(EventHistoryContext);
  if (context === undefined) {
    throw new Error('useEventHistory must be used within an EventHistoryProvider');
  }
  return context;
};
