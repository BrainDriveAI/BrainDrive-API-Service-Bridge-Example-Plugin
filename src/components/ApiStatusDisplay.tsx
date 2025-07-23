/**
 * ApiStatusDisplay Component for ServiceExample_API plugin
 * 
 * This component provides unified status and response display for all API operations.
 * It shows request status, response data, error messages, and timing information.
 */

import React from 'react';

interface ApiStatusDisplayProps {
  status: string;
  isLoading: boolean;
  error: string | null;
  responseData?: any;
  requestTime?: number | null;
  responseTime?: number | null;
  showRawResponse?: boolean;
  operationType?: string;
}

const ApiStatusDisplay: React.FC<ApiStatusDisplayProps> = ({ 
  status,
  isLoading,
  error,
  responseData,
  requestTime,
  responseTime,
  showRawResponse = false,
  operationType
}) => {
  // Get status color based on current status
  const getStatusColor = (): string => {
    if (error) return '#f44336'; // Red for errors
    if (status.includes('✅')) return '#4caf50'; // Green for success
    if (status.includes('⏳')) return '#ff9800'; // Orange for loading
    if (status.includes('❌')) return '#f44336'; // Red for errors
    return '#2196f3'; // Blue for info
  };

  // Get status icon based on current status
  const getStatusIcon = (): string => {
    if (isLoading) return '⏳';
    if (error) return '❌';
    if (status.includes('✅')) return '✅';
    return 'ℹ️';
  };

  // Format response data for display
  const formatResponseData = (data: any): string => {
    if (!data) return 'No data';
    
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  const statusColor = getStatusColor();
  const statusIcon = getStatusIcon();

  return (
    <div style={{
      padding: '12px',
      border: `1px solid ${statusColor}`,
      borderRadius: '6px',
      backgroundColor: `${statusColor}08`,
      marginBottom: '12px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '8px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '14px' }}>{statusIcon}</span>
          <span style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            {operationType ? `${operationType} Status` : 'API Status'}
          </span>
        </div>
        {isLoading && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            marginLeft: '8px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              border: '2px solid #f3f3f3',
              borderTop: '2px solid #2196f3',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
        )}
      </div>

      {/* Status Message */}
      <div style={{
        fontSize: '12px',
        color: statusColor,
        fontWeight: '500',
        marginBottom: '4px'
      }}>
        {status}
      </div>

      {/* Timing Information */}
      {requestTime && (
        <div style={{
          fontSize: '10px',
          color: '#666',
          marginTop: '4px',
          display: 'flex',
          gap: '12px'
        }}>
          <span>Started: {new Date(requestTime).toLocaleTimeString()}</span>
          {responseTime && (
            <span>Duration: {responseTime - requestTime}ms</span>
          )}
        </div>
      )}

      {/* Error Details */}
      {error && (
        <div style={{
          marginTop: '8px',
          padding: '8px',
          backgroundColor: '#ffebee',
          borderRadius: '4px',
          border: '1px solid #ffcdd2'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 'bold',
            marginBottom: '4px',
            color: '#d32f2f'
          }}>
            Error Details:
          </div>
          <div style={{
            fontSize: '11px',
            color: '#d32f2f',
            wordBreak: 'break-word'
          }}>
            {error}
          </div>
        </div>
      )}

      {/* Response Data */}
      {responseData && showRawResponse && (
        <div style={{
          marginTop: '8px',
          padding: '8px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 'bold',
            marginBottom: '4px',
            color: '#333'
          }}>
            Response Data:
          </div>
          <pre style={{
            fontSize: '10px',
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: '200px',
            overflow: 'auto',
            color: '#555'
          }}>
            {formatResponseData(responseData)}
          </pre>
        </div>
      )}

      {/* Educational Note */}
      <div style={{
        marginTop: '8px',
        fontSize: '10px',
        color: '#666',
        fontStyle: 'italic',
        borderTop: '1px solid #e0e0e0',
        paddingTop: '6px'
      }}>
        📚 This component demonstrates real-time API operation feedback with comprehensive error handling
      </div>

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ApiStatusDisplay;