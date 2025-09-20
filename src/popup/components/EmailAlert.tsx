import React from 'react';

interface EmailDetectionEvent {
  emails: string[];
  text: string;
  timestamp: number;
}

interface EmailAlertProps {
  emailDetection: EmailDetectionEvent;
  onDismiss: () => void;
}

export const EmailAlert: React.FC<EmailAlertProps> = ({ emailDetection, onDismiss }) => {
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="email-detection-section">
      <h3>🚨 Email Detected</h3>
      <div className="email-warning">
        <div className="warning-header">
          Email addresses found in ChatGPT prompt!
        </div>
        <div className="warning-details">
          <div className="detected-emails">
            {emailDetection.emails.map((email, index) => (
              <div key={index} className="email-item">
                {email}
              </div>
            ))}
          </div>
          <div className="detection-time">
            Detected at {formatTimestamp(emailDetection.timestamp)}
          </div>
          <button
            className="toggle-button enabled"
            onClick={onDismiss}
            style={{ marginTop: '8px', fontSize: '12px', padding: '6px 12px' }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
