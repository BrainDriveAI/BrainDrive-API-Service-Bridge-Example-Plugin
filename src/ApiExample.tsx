import React from 'react';
import './ApiExample.css';
import {
  PluginTemplateProps,
  PluginTemplateState,
  PluginData,
  Services
} from './types';
import { apiServiceWrapper, demoApiService, externalApiService } from './services';

/**
 * API Service Bridge Example Plugin
 *
 * This plugin demonstrates how to use the API Service Bridge for:
 * 1. CRUD operations with BrainDrive backend
 * 2. External API connectivity testing
 * 3. Proper error handling and user feedback
 * 4. Authentication and token management
 * 5. Best practices for API integration
 */
class ApiExample extends React.Component<PluginTemplateProps, PluginTemplateState> {
  private themeChangeListener: ((theme: string) => void) | null = null;
  private pageContextUnsubscribe: (() => void) | null = null;
  private pluginStateUnsubscribers: (() => void)[] = [];

  constructor(props: PluginTemplateProps) {
    super(props);
    
    // Initialize API example state
    this.state = {
      isLoading: false,
      error: '',
      currentTheme: 'light',
      isInitializing: true,
      isServiceConnected: false,
      currentDemo: 'overview',
      activeTab: 'learning',
      status: 'Initializing API Service Bridge...',
      data: {
        apiServiceConnected: false,
        demoItems: [],
        externalApiStatus: 'unknown',
        requestCount: 0
      }
    };

    console.log('[API-DEMO] 📚 LEARNING: API Service Bridge Example initialized');

  }

  async componentDidMount() {
    console.log('[API-DEMO] 🔄 Component mounting - initializing services');

    // Initialize theme
    if (this.props.services.theme) {
      const currentTheme = this.props.services.theme.getCurrentTheme();
      this.setState({ currentTheme });

      // Set up theme change listener
      this.themeChangeListener = (theme: string) => {
        console.log('[API-DEMO] 🎨 Theme changed to:', theme);
        this.setState({ currentTheme: theme });
      };
      this.props.services.theme.addThemeChangeListener(this.themeChangeListener);
    }

    // Initialize API Service Bridge
    if (this.props.services.api) {
      apiServiceWrapper.setServiceBridge(this.props.services.api);
      console.log('[API-DEMO] 📚 LEARNING: API Service Bridge connected and ready');
    }

    // Load initial data
    await this.loadInitialData();
  }

  componentWillUnmount() {
    console.log('[API-DEMO] 🧹 Cleaning up component');

    // Clean up theme listener
    if (this.themeChangeListener && this.props.services.theme) {
      this.props.services.theme.removeThemeChangeListener(this.themeChangeListener);
    }

    // Clean up page context listener
    if (this.pageContextUnsubscribe) {
      this.pageContextUnsubscribe();
    }

    // Clean up plugin state listeners
    this.pluginStateUnsubscribers.forEach(unsubscribe => unsubscribe());
  }

  /**
   * Load initial data with comprehensive error handling
   */
  private async loadInitialData(): Promise<void> {
    console.log('[API-DEMO] 📚 LEARNING: Loading initial data with proper error handling');
    
    try {
      // Test API Service connection
      if (apiServiceWrapper.isServiceConnected()) {
        console.log('[API-DEMO] ✅ API Service Bridge is connected');
        
        // Try to load demo items
        const itemsResult = await demoApiService.getItems();
        if (itemsResult.success && itemsResult.data) {
          this.setState({
            data: {
              apiServiceConnected: true,
              demoItems: itemsResult.data,
              externalApiStatus: this.state.data?.externalApiStatus || 'unknown',
              requestCount: (this.state.data?.requestCount || 0) + 1
            }
          });
        }
      }

      // Test external API
      console.log('[API-DEMO] Testing external API connectivity...');
      const externalResult = await externalApiService.checkCommunityStatus();
      if (externalResult.success && externalResult.data) {
        this.setState({
          data: {
            apiServiceConnected: this.state.data?.apiServiceConnected || false,
            demoItems: this.state.data?.demoItems || [],
            externalApiStatus: externalResult.data.status,
            requestCount: this.state.data?.requestCount || 0
          }
        });
        console.log('[API-DEMO] ✅ External API check completed:', externalResult.data.status);
      }

    } catch (error) {
      console.warn('[API-DEMO] ⚠️ Some initial data loading failed:', error);
    }

    // Clear both loading states
    this.setState({
      isLoading: false,
      isInitializing: false,
      error: '',
      status: 'Ready for API operations'
    });
  }

  /**
   * Handle creating a new demo item with comprehensive error handling
   */
  private handleCreateItem = async (): Promise<void> => {
    // Set loading state
    this.setState({ isLoading: true, error: '' });
    
    try {
      console.log('[API-DEMO] 📚 LEARNING: Starting item creation with proper error handling');
      console.log('[API-DEMO] 🔄 Setting loading state for better UX');
      
      const newItem = {
        name: `Demo Item ${Date.now()}`,
        description: `A demo item created at ${new Date().toLocaleTimeString()}`,
        value: Math.floor(Math.random() * 100),
        timestamp: new Date().toISOString()
      };
      
      console.log('[API-DEMO] 📚 LEARNING: Validating data before sending request');
      if (!newItem.name || !newItem.description) {
        throw new Error('Name and description are required');
      }
      
      const result = await demoApiService.createItem(newItem);
      if (result.success) {
        await this.handleRefreshItems();
        console.log('[API-DEMO] ✅ Item created successfully');
        console.log('[API-DEMO] 📚 LEARNING: Success! Always refresh data after mutations');
        
        // Show success feedback
        this.setState({ 
          status: '✅ Item created successfully!',
          error: ''
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.setState({ status: 'Ready for API operations' });
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to create item');
      }
    } catch (error: any) {
      console.error('[API-DEMO] ❌ Failed to create item:', error);
      console.log('[API-DEMO] 📚 LEARNING: Error handling in action - showing user-friendly message');
      
      // Extract user-friendly error message
      const errorMessage = this.extractErrorMessage(error);
      
      this.setState({ 
        error: `Failed to create item: ${errorMessage}`,
        status: 'Error occurred - check console for details'
      });
      
      // Log educational information about the error
      this.logErrorEducation(error, 'CREATE');
    } finally {
      this.setState({ isLoading: false });
      console.log('[API-DEMO] 📚 LEARNING: Always clear loading state in finally block');
    }
  };

  /**
   * Handle updating a demo item with enhanced error handling
   */
  private handleUpdateItem = async (itemId: string): Promise<void> => {
    this.setState({ isLoading: true, error: '' });
    
    try {
      console.log('[API-DEMO] 📚 LEARNING: Updating item with proper validation');
      const updatedData = {
        name: `Updated Item ${Date.now()}`,
        description: `Updated at ${new Date().toLocaleTimeString()}`,
        value: Math.floor(Math.random() * 100),
        timestamp: new Date().toISOString()
      };
      
      const result = await demoApiService.updateItem(itemId, updatedData);
      if (result.success) {
        await this.handleRefreshItems();
        console.log('[API-DEMO] ✅ Item updated successfully');
        
        this.setState({ 
          status: '✅ Item updated successfully!',
          error: ''
        });
        
        setTimeout(() => {
          this.setState({ status: 'Ready for API operations' });
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to update item');
      }
    } catch (error: any) {
      console.error('[API-DEMO] ❌ Failed to update item:', error);
      const errorMessage = this.extractErrorMessage(error);
      
      this.setState({ 
        error: `Failed to update item: ${errorMessage}`,
        status: 'Error occurred - check console for details'
      });
      
      this.logErrorEducation(error, 'UPDATE');
    } finally {
      this.setState({ isLoading: false });
    }
  };

  /**
   * Handle deleting a demo item with enhanced error handling
   */
  private handleDeleteItem = async (itemId: string): Promise<void> => {
    this.setState({ isLoading: true, error: '' });
    
    try {
      console.log('[API-DEMO] 📚 LEARNING: Deleting item with confirmation pattern');
      const result = await demoApiService.deleteItem(itemId);
      if (result.success) {
        await this.handleRefreshItems();
        console.log('[API-DEMO] ✅ Item deleted successfully');
        
        this.setState({ 
          status: '✅ Item deleted successfully!',
          error: ''
        });
        
        setTimeout(() => {
          this.setState({ status: 'Ready for API operations' });
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to delete item');
      }
    } catch (error: any) {
      console.error('[API-DEMO] ❌ Failed to delete item:', error);
      const errorMessage = this.extractErrorMessage(error);
      
      this.setState({ 
        error: `Failed to delete item: ${errorMessage}`,
        status: 'Error occurred - check console for details'
      });
      
      this.logErrorEducation(error, 'DELETE');
    } finally {
      this.setState({ isLoading: false });
    }
  };

  /**
   * Handle refreshing demo items with error handling
   */
  private handleRefreshItems = async (): Promise<void> => {
    try {
      console.log('[API-DEMO] 📚 LEARNING: Refreshing data with error recovery');
      const result = await demoApiService.getItems();
      if (result.success && result.data) {
        this.setState({
          data: {
            ...this.state.data!,
            demoItems: result.data
          }
        });
        console.log('[API-DEMO] ✅ Items refreshed successfully');
      } else {
        throw new Error(result.error || 'Failed to refresh items');
      }
    } catch (error: any) {
      console.error('[API-DEMO] ❌ Failed to refresh items:', error);
      const errorMessage = this.extractErrorMessage(error);
      
      this.setState({ 
        error: `Failed to refresh items: ${errorMessage}`
      });
      
      this.logErrorEducation(error, 'REFRESH');
    }
  };

  /**
   * Handle testing external connection with enhanced error handling
   */
  private handleTestConnection = async (): Promise<void> => {
    this.setState({ isLoading: true, error: '' });
    
    try {
      console.log('[API-DEMO] 📚 LEARNING: Testing external connection with timeout handling');
      const result = await externalApiService.checkCommunityStatus();
      if (result.success && result.data) {
        this.setState({
          data: {
            ...this.state.data!,
            externalApiStatus: result.data.status
          },
          status: '✅ Connection test completed successfully!'
        });
        console.log('[API-DEMO] ✅ Connection test completed');
        
        setTimeout(() => {
          this.setState({ status: 'Ready for API operations' });
        }, 3000);
      } else {
        throw new Error(result.error || 'Connection test failed');
      }
    } catch (error: any) {
      console.error('[API-DEMO] ❌ Connection test failed:', error);
      const errorMessage = this.extractErrorMessage(error);
      
      this.setState({ 
        error: `Connection test failed: ${errorMessage}`,
        status: 'Connection test failed - check console for details'
      });
      
      this.logErrorEducation(error, 'CONNECTION_TEST');
    } finally {
      this.setState({ isLoading: false });
    }
  };

  /**
   * Handle refreshing external connection status
   */
  private handleRefreshConnection = async (): Promise<void> => {
    await this.handleTestConnection();
  };

  /**
   * Extract user-friendly error message from error object
   */
  private extractErrorMessage(error: any): string {
    console.log('[API-DEMO] 📚 LEARNING: Extracting user-friendly error message');
    
    // Check for API error structure
    if (error?.message) {
      return error.message;
    }
    
    // Check for HTTP response errors
    if (error?.response?.data?.detail) {
      return error.response.data.detail;
    }
    
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    
    // Check for network errors
    if (error?.code === 'ERR_NETWORK') {
      return 'Network connection failed. Please check your internet connection.';
    }
    
    // Check for timeout errors
    if (error?.message?.includes('timeout')) {
      return 'Request timed out. The server is taking too long to respond.';
    }
    
    // Default fallback
    return error?.toString() || 'An unexpected error occurred';
  }

  /**
   * Log educational information about errors for learning purposes
   */
  private logErrorEducation(error: any, operation: string): void {
    console.group(`[API-DEMO] 📚 LEARNING: Error Analysis for ${operation} Operation`);
    
    console.log('🔍 Error Type Analysis:');
    if (error?.response) {
      const status = error.response.status;
      console.log(`   • HTTP Error: ${status}`);
      console.log(`   • Meaning: ${this.getHttpErrorMeaning(status)}`);
      console.log(`   • Common Causes: ${this.getHttpErrorCauses(status)}`);
      console.log(`   • Recommended Action: ${this.getHttpErrorAction(status)}`);
    } else if (error?.code === 'ERR_NETWORK') {
      console.log('   • Network Error: Connection failed');
      console.log('   • Common Causes: Internet disconnection, server down, CORS issues');
      console.log('   • Recommended Action: Check network connection and server status');
    } else if (error?.message?.includes('timeout')) {
      console.log('   • Timeout Error: Request took too long');
      console.log('   • Common Causes: Slow server response, network congestion');
      console.log('   • Recommended Action: Retry with exponential backoff');
    } else {
      console.log('   • Unknown Error: Unexpected error type');
      console.log('   • Recommended Action: Log error details and implement fallback');
    }
    
    console.log('💡 Best Practices Applied:');
    console.log('   ✅ User-friendly error messages');
    console.log('   ✅ Detailed logging for debugging');
    console.log('   ✅ Loading state management');
    console.log('   ✅ Error state cleanup');
    console.log('   ✅ Educational error information');
    
    console.groupEnd();
  }

  /**
   * Get human-readable meaning of HTTP status codes
   */
  private getHttpErrorMeaning(status: number): string {
    switch (status) {
      case 400: return 'Bad Request - Invalid data sent';
      case 401: return 'Unauthorized - Authentication required';
      case 403: return 'Forbidden - Access denied';
      case 404: return 'Not Found - Resource does not exist';
      case 422: return 'Unprocessable Entity - Validation failed';
      case 500: return 'Internal Server Error - Server malfunction';
      case 503: return 'Service Unavailable - Server temporarily down';
      default: return `HTTP ${status} - See HTTP specification`;
    }
  }

  /**
   * Get common causes for HTTP errors
   */
  private getHttpErrorCauses(status: number): string {
    switch (status) {
      case 400: return 'Missing required fields, invalid data format';
      case 401: return 'Expired token, missing authentication';
      case 403: return 'Insufficient permissions, account restrictions';
      case 404: return 'Wrong URL, deleted resource, typo in endpoint';
      case 422: return 'Data validation rules not met';
      case 500: return 'Server bug, database issues, configuration problems';
      case 503: return 'Server maintenance, overload, dependency failure';
      default: return 'Various server or client issues';
    }
  }

  /**
   * Get recommended actions for HTTP errors
   */
  private getHttpErrorAction(status: number): string {
    switch (status) {
      case 400: return 'Validate input data before sending';
      case 401: return 'Refresh authentication token and retry';
      case 403: return 'Check user permissions or contact administrator';
      case 404: return 'Verify endpoint URL and resource existence';
      case 422: return 'Fix validation errors and resubmit';
      case 500: return 'Retry after delay, contact support if persistent';
      case 503: return 'Implement retry with exponential backoff';
      default: return 'Log error details and implement appropriate fallback';
    }
  }

  /**
   * Render loading state
   */
  private renderLoading(): JSX.Element {
    return (
      <div className="plugin-template-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  /**
   * Render error state
   */
  private renderError(): JSX.Element {
    return (
      <div className="plugin-template-error">
        <div className="error-icon">⚠️</div>
        <p>{this.state.error}</p>
      </div>
    );
  }

  /**
   * Render tab navigation
   */
  private renderTabNavigation(): JSX.Element {
    const tabs = [
      { id: 'learning', label: 'Learning Objectives', icon: '📚' },
      { id: 'service', label: 'Service Connected', icon: '🔧' },
      { id: 'external', label: 'External Connection', icon: '🌐' }
    ];

    return (
      <div className="tab-navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${this.state.activeTab === tab.id ? 'active' : ''}`}
            onClick={() => this.setState({ activeTab: tab.id as any })}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
    );
  }

  /**
   * Render Learning Objectives tab
   */
  private renderLearningTab(): JSX.Element {
    return (
      <div className="tab-content">
        <div className="learning-objectives">
          <h4>📚 What You'll Learn</h4>
          <div className="objectives-grid">
            <div className="objective-card">
              <h5>🔌 API Service Bridge Integration</h5>
              <p>Learn how to integrate the API Service Bridge into your BrainDrive plugins for seamless backend communication.</p>
              <ul>
                <li>Service initialization and configuration</li>
                <li>Authentication handling</li>
                <li>Request/response patterns</li>
              </ul>
            </div>
            <div className="objective-card">
              <h5>🔧 CRUD Operations</h5>
              <p>Master Create, Read, Update, and Delete operations with proper error handling and user feedback.</p>
              <ul>
                <li>GET requests for data retrieval</li>
                <li>POST requests for creating resources</li>
                <li>PUT requests for updates</li>
                <li>DELETE requests for removal</li>
              </ul>
            </div>
            <div className="objective-card">
              <h5>🌐 External API Connectivity</h5>
              <p>Understand how to test and handle external API connections, including CORS and network issues.</p>
              <ul>
                <li>Connection testing patterns</li>
                <li>Response time measurement</li>
                <li>Error handling strategies</li>
                <li>Status monitoring</li>
              </ul>
            </div>

          </div>
          <div className="learning-note">
            <p><strong>💡 Pro Tip:</strong> Open your browser's developer console to see detailed educational logging during API operations. Each request includes learning annotations to help you understand what's happening behind the scenes.</p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render Service Connected tab
   */
  private renderServiceTab(): JSX.Element {
    const apiStats = apiServiceWrapper.getStats();
    
    return (
      <div className="tab-content">
        <div className="service-demo">
          <div className="service-status">
            <h4>🔧 API Service Bridge Status</h4>
            <div className="status-indicators">
              <div className={`status-indicator ${this.state.data?.apiServiceConnected ? 'connected' : 'disconnected'}`}>
                <span className="status-dot"></span>
                <span>Service: {this.state.data?.apiServiceConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              <div className="status-metric">
                <span className="metric-label">Requests Made:</span>
                <span className="metric-value">{apiStats.requestCount}</span>
              </div>
            </div>
          </div>
          
          <div className="crud-demo">
            <h4>📋 Interactive CRUD Demo</h4>
            <p>Try creating, reading, updating, and deleting demo items to see the API Service Bridge in action with comprehensive error handling.</p>
            
            {this.state.error && (
              <div className="error-display">
                <strong>⚠️ Error:</strong> {this.state.error}
              </div>
            )}
            
            <div className="demo-items">
              <h5>Current Demo Items ({this.state.data?.demoItems?.length || 0})</h5>
              {this.state.data?.demoItems && this.state.data.demoItems.length > 0 ? (
                <div className="items-list">
                  {this.state.data.demoItems.map((item: any, index: number) => (
                    <div key={item.id || index} className="demo-item">
                      <div className="item-info">
                        <strong>{item.name || `Item ${index + 1}`}</strong>
                        <span className="item-value">{item.description || item.value || 'No value'}</span>
                        <span className="item-timestamp">{item.timestamp || 'No timestamp'}</span>
                      </div>
                      <div className="item-actions">
                        <button 
                          className="action-btn update" 
                          onClick={() => this.handleUpdateItem(item.id)}
                          disabled={this.state.isLoading}
                        >
                          ✏️ Update
                        </button>
                        <button 
                          className="action-btn delete" 
                          onClick={() => this.handleDeleteItem(item.id)}
                          disabled={this.state.isLoading}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No demo items yet. Create one to get started!</p>
                </div>
              )}
              
              <div className="demo-actions">
                <button 
                  className="action-btn create" 
                  onClick={() => this.handleCreateItem()}
                  disabled={this.state.isLoading}
                >
                  {this.state.isLoading ? '⏳ Creating...' : '➕ Create New Item'}
                </button>
                <button 
                  className="action-btn refresh" 
                  onClick={() => this.handleRefreshItems()}
                  disabled={this.state.isLoading}
                >
                  {this.state.isLoading ? '⏳ Refreshing...' : '🔄 Refresh Items'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render External Connection tab
   */
  private renderExternalTab(): JSX.Element {
    const externalStats = externalApiService.getStats();
    
    return (
      <div className="tab-content">
        <div className="external-demo">
          <h4>🌐 External API Connection Status</h4>
          
          {this.state.error && (
            <div className="error-display">
              <strong>⚠️ Connection Error:</strong> {this.state.error}
            </div>
          )}
          
          <div className="connection-status">
            <div className="connection-card">
              <div className="connection-header">
                <h5>🏠 community.braindrive.ai</h5>
                <div className={`connection-indicator ${this.state.data?.externalApiStatus === 'online' ? 'online' : 'offline'}`}>
                  <span className="connection-dot"></span>
                  <span>{this.state.data?.externalApiStatus === 'online' ? 'Online' : 'Offline'}</span>
                </div>
              </div>
              
              <div className="connection-metrics">
                <div className="metric">
                  <span className="metric-label">Status:</span>
                  <span className={`metric-value ${this.state.data?.externalApiStatus === 'online' ? 'success' : 'error'}`}>
                    {this.state.data?.externalApiStatus === 'online' ? '✅ Connected' : 
                     this.state.data?.externalApiStatus === 'offline' ? '❌ Disconnected' : '❓ Unknown'}
                  </span>
                </div>
                
                <div className="metric">
                  <span className="metric-label">Total Checks:</span>
                  <span className="metric-value">{externalStats.checkCount}</span>
                </div>
                
                <div className="metric">
                  <span className="metric-label">Target URL:</span>
                  <span className="metric-value">{externalStats.targetUrl}</span>
                </div>
              </div>
              
              <div className="connection-actions">
                <button 
                  className="action-btn test" 
                  onClick={() => this.handleTestConnection()}
                  disabled={this.state.isLoading}
                >
                  {this.state.isLoading ? '⏳ Testing...' : '🔍 Test Connection'}
                </button>
                <button 
                  className="action-btn refresh" 
                  onClick={() => this.handleRefreshConnection()}
                  disabled={this.state.isLoading}
                >
                  {this.state.isLoading ? '⏳ Refreshing...' : '🔄 Refresh Status'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="connection-info">
            <h5>ℹ️ About External API Testing & Error Handling</h5>
            <p>This demonstrates how to test connectivity to external services and handle various network conditions with proper error handling:</p>
            <ul>
              <li><strong>CORS Handling:</strong> Proper cross-origin request management with fallback strategies</li>
              <li><strong>Timeout Management:</strong> Graceful handling of slow responses with user feedback</li>
              <li><strong>Error Recovery:</strong> Retry logic and fallback strategies for failed connections</li>
              <li><strong>Status Monitoring:</strong> Real-time connection health tracking with error reporting</li>
              <li><strong>User Feedback:</strong> Clear error messages and loading states for better UX</li>
              <li><strong>Educational Logging:</strong> Detailed console output explaining error types and solutions</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render main plugin content with tabs
   */
  private renderContent(): JSX.Element {
    const { title = "API Service Bridge Example", description = "Demonstrates CRUD operations and external API connectivity with comprehensive error handling" } = this.props;

    return (
      <div className="plugin-template-content">
        <div className="plugin-header">
          <h3>🔌 {title}</h3>
          <p>{description}</p>
          {this.state.status && (
            <div className="status-display">
              <small>Status: {this.state.status}</small>
            </div>
          )}
        </div>

        {this.renderTabNavigation()}
        
        <div className="tab-container">
          {this.state.activeTab === 'learning' && this.renderLearningTab()}
          {this.state.activeTab === 'service' && this.renderServiceTab()}
          {this.state.activeTab === 'external' && this.renderExternalTab()}
        </div>
      </div>
    );
  }

  render(): JSX.Element {
    const { currentTheme, isInitializing, error } = this.state;

    return (
      <div className={`plugin-template ${currentTheme === 'dark' ? 'dark-theme' : ''}`}>
        {isInitializing ? (
          this.renderLoading()
        ) : error ? (
          this.renderError()
        ) : (
          this.renderContent()
        )}
      </div>
    );
  }
}

export default ApiExample;