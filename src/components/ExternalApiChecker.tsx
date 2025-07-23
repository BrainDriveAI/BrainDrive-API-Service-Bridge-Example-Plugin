import React from 'react';

const ExternalApiChecker: React.FC = () => {
  return (
    <div style={{ padding: '16px' }}>
      <h3>🌐 External API Checker</h3>
      <p>Connectivity testing for external services</p>
      <div style={{
        padding: '12px',
        backgroundColor: '#f0f7ff',
        borderRadius: '6px',
        border: '1px solid #2196f3'
      }}>
        <p><strong>Target URL:</strong> https://community.braindrive.ai/</p>
        <p>This component will demonstrate:</p>
        <ul>
          <li>Testing external API connectivity</li>
          <li>Handling CORS restrictions</li>
          <li>Measuring response times</li>
          <li>Providing connectivity status feedback</li>
        </ul>
      </div>
    </div>
  );
};

export default ExternalApiChecker;