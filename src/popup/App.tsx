import React, { useState } from 'react';
import './App.css';
import { StatusDisplay } from './StatusDisplay';
import { EventHistory } from './history/EventHistory';
import { EventHistoryProvider } from './history/EventHistoryContext';

const App: React.FC = () => {
  const [showHistory, setShowHistory] = useState<boolean>(true);

  const toggleHistory = () => {
    setShowHistory(prev => !prev);
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>ChatGPT Monitor</h1>
      </div>
      <div className="app-main">
        <StatusDisplay/>
        <EventHistoryProvider>
          <EventHistory
            isVisible={showHistory}
            onToggle={toggleHistory}
          />
        </EventHistoryProvider>
      </div>
    </div>
  );
};

export default App;
