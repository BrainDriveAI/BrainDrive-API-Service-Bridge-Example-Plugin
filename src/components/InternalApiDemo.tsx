import React from 'react';

interface InternalApiDemoProps {
  services?: any;
  isServiceConnected?: boolean;
}

const InternalApiDemo: React.FC<InternalApiDemoProps> = ({ 
  services, 
  isServiceConnected 
}) => {
  return (
    <div style={{ padding: '16px' }}>
      <h3>🔧 Internal API Demo</h3>
      <p>CRUD operations with BrainDrive backend</p>
      <div style={{
        padding: '12px',
        backgroundColor: '#f0f7ff',
        borderRadius: '6px',
        border: '1px solid #2196f3'
      }}>
        <p><strong>Service Status:</strong> {isServiceConnected ? '✅ Connected' : '❌ Not Connected'}</p>
        <p>This component will demonstrate:</p>
        <ul>
          <li>GET requests to fetch demo items</li>
          <li>POST requests to create new items</li>
          <li>PUT requests to update existing items</li>
          <li>DELETE requests to remove items</li>
        </ul>
      </div>
    </div>
  );
};

export default InternalApiDemo;