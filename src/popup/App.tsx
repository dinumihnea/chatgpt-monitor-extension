import React, { useState } from 'react';
import './App.css';


const App: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);


  const toggleEnabled = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    chrome.storage.sync.set({ enabled: newState });
  };

  return (
    <div className='app'>
      <header className='app-header'>
        <h1>ChatGPT Monitor</h1>
      </header>

      <main className='app-main'>
        <div className='status-section'>
          <div className='status-indicator'>
            <span className={`status-dot ${isEnabled ? 'enabled' : 'disabled'}`} />
            <span className='status-text'>
              {isEnabled ? 'Protection Active' : 'Protection Disabled'}
            </span>
          </div>

          <button
            className={`toggle-button ${isEnabled ? 'enabled' : 'disabled'}`}
            onClick={toggleEnabled}
          >
            {isEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>

      </main>
    </div>
  );
};

export default App;
