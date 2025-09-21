import React from 'react';


export const StatusDisplay: React.FC = () => {
  return (
    <div className="status-section">
      <div className="status-indicator">
        <div className="status-dot ok"></div>
        <span>Protection Active</span>
      </div>
    </div>
  );
}
