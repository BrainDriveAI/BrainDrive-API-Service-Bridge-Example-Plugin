# ServiceExample_API - Developer Guide

## 📚 Complete Guide to BrainDrive API Service Bridge

This guide provides comprehensive documentation for developers learning to use BrainDrive's API Service Bridge. The ServiceExample_API plugin serves as a working demonstration of all key concepts and patterns for both internal backend operations and external API connectivity.

## 🎯 Learning Objectives

After studying this plugin and guide, you will understand:

1. **API Service Bridge Architecture** - How BrainDrive's API system works
2. **Service Integration Patterns** - Proper ways to connect to BrainDrive services
3. **CRUD Operations** - Create, Read, Update, Delete operations with backend
4. **External API Testing** - Connectivity testing for external services
5. **Error Handling** - Comprehensive error handling for API operations
6. **Best Practices** - Production-ready patterns and techniques
7. **Common Pitfalls** - What to avoid and how to debug issues

## 🏗️ Architecture Overview

### API Service Bridge Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Your Plugin   │    │  API Service    │    │  BrainDrive     │
│                 │    │     Bridge      │    │    Backend      │
│ 1. Create       │───▶│ 2. Authenticate │───▶│ 3. Process      │
│    Request      │    │    & Route      │    │    Request      │
│                 │    │                 │    │                 │
│ 4. Handle       │◀───│ 5. Deliver      │◀───│ 6. Return       │
│    Response     │    │    Response     │    │    Response     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### External API Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Your Plugin   │    │  API Service    │    │  External API   │
│                 │    │     Bridge      │    │   (e.g. REST)   │
│ 1. Create       │───▶│ 2. Proxy        │───▶│ 3. Process      │
│    Request      │    │    Request      │    │    Request      │
│                 │    │                 │    │                 │
│ 4. Handle       │◀───│ 5. Return       │◀───│ 6. Send         │
│    Response     │    │    Response     │    │    Response     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Components

1. **API Service Bridge** - Provided by BrainDrive through `props.services.api`
2. **Plugin API Service** - Your wrapper around the bridge (see `apiService.ts`)
3. **Request Structure** - Standardized format for all API requests
4. **Response Handling** - Consistent response processing and error handling

## 🔧 Implementation Guide

### Step 1: Service Integration

```typescript
// In your component constructor (from ApiExample.tsx)
constructor(props: PluginTemplateProps) {
  super(props);
  
  // Initialize API example state
  this.state = {
    isLoading: false,
    error: '',
    currentTheme: 'light',
    isInitializing: true,
    isServiceConnected: false,
    activeTab: 'learning',
    status: 'Initializing API Service Bridge...',
    data: {
      apiServiceConnected: false,
      demoItems: [],
      externalApiStatus: 'unknown',
      requestCount: 0
    }
  };
}

// In componentDidMount (from ApiExample.tsx)
async componentDidMount() {
  console.log('[API-DEMO] 🔄 Component mounting - initializing services');

  // Initialize API Service Bridge
  if (this.props.services.api) {
    apiServiceWrapper.setServiceBridge(this.props.services.api);
    console.log('[API-DEMO] ✅ API Service Bridge connected');
    console.log('[API-DEMO] 📚 LEARNING: You can now make authenticated API requests');
  }

  // Load initial data
  await this.loadInitialData();
}

// Handle service availability changes
componentDidUpdate(prevProps: PluginTemplateProps) {
  if (prevProps.services?.api !== this.props.services?.api) {
    console.log('[API-DEMO] 📚 LEARNING: API Service availability changed, reinitializing...');
    this.initializeApiService();
  }
}

// Initialize API Service (from ApiExample.tsx)
initializeApiService = () => {
  try {
    if (this.props.services?.api) {
      apiServiceWrapper.setServiceBridge(this.props.services.api);
      this.setState({
        status: '✅ API Service connected and ready',
        isServiceConnected: true
      });
      console.log('[API-DEMO] 📚 LEARNING: API Service Bridge connected and ready');
    } else {
      this.setState({
        status: '⏳ Waiting for API Service to become available...',
        isServiceConnected: false
      });
    }
  } catch (error) {
    this.setState({
      status: `❌ API Service initialization failed: ${error.message}`,
      isServiceConnected: false
    });
  }
};
```

### Step 2: CRUD Operations

#### Create Operation

```typescript
// Creating a new item (from ApiExample.tsx)
private handleCreateItem = async (): Promise<void> => {
  // Set loading state
  this.setState({ isLoading: true, error: '' });
  
  try {
    console.log('[API-DEMO] 📚 LEARNING: Starting item creation with proper error handling');
    console.log('[API-DEMO] 🔄 Setting loading state for better UX');
    
    // Create item data with validation
    const itemData = {
      name: `Demo Item ${Date.now()}`,
      description: `Created at ${new Date().toLocaleTimeString()}`,
      value: Math.floor(Math.random() * 100),
      timestamp: new Date().toISOString()
    };
    
    console.log('[API-DEMO] 📚 LEARNING: Sending POST request to create item');
    const result = await demoApiService.createItem(itemData);
    
    if (result.success) {
      // Refresh the items list
      await this.handleRefreshItems();
      console.log('[API-DEMO] ✅ Item created successfully');
      
      this.setState({ 
        status: '✅ Item created successfully!',
        error: ''
      });
      
      // Clear status after 3 seconds
      setTimeout(() => {
        this.setState({ status: 'Ready for API operations' });
      }, 3000);
    } else {
      throw new Error(result.error || 'Failed to create item');
    }
  } catch (error: any) {
    console.error('[API-DEMO] ❌ Failed to create item:', error);
    const errorMessage = this.extractErrorMessage(error);
    
    this.setState({ 
      error: `Failed to create item: ${errorMessage}`,
      status: 'Error occurred - check console for details'
    });
    
    // Educational error logging
    this.logErrorEducation(error, 'CREATE');
  } finally {
    this.setState({ isLoading: false });
  }
};
```

#### Read Operation

```typescript
// Reading items (from demoApiService.ts)
export const getItems = async (): Promise<ApiResponse<DemoItem[]>> => {
  try {
    console.log('[API-DEMO] 📚 LEARNING: Fetching demo items (GET request)');
    console.log('[API-DEMO] 📤 GET Request #' + (requestCounter++));
    
    const response = await apiServiceWrapper.get('/demo/items');
    
    console.log('[API-DEMO] ✅ GET Response #' + requestCounter);
    console.log('[API-DEMO] ✅ Retrieved', response.data?.length || 0, 'items successfully');
    console.log('[API-DEMO] 📚 LEARNING: GET request demonstrates reading data from backend');
    
    return {
      success: true,
      data: response.data || [],
      message: 'Items retrieved successfully'
    };
  } catch (error: any) {
    console.error('[API-DEMO] ❌ Failed to fetch items:', error);
    return {
      success: false,
      error: `Failed to fetch items: ${error.message}`,
      data: []
    };
  }
};
```

#### Update Operation

```typescript
// Updating an item (from ApiExample.tsx)
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
```

#### Delete Operation

```typescript
// Deleting an item (from demoApiService.ts)
export const deleteItem = async (id: string): Promise<ApiResponse<void>> => {
  try {
    console.log('[API-DEMO] 📚 LEARNING: Deleting item (DELETE request)');
    console.log('[API-DEMO] 🗑️ DELETE Request #' + (requestCounter++));
    
    await apiServiceWrapper.delete(`/demo/items/${id}`);
    
    console.log('[API-DEMO] ✅ DELETE Response #' + requestCounter);
    console.log('[API-DEMO] ✅ Item deleted successfully');
    console.log('[API-DEMO] 📚 LEARNING: DELETE request demonstrates removing data from backend');
    
    return {
      success: true,
      message: 'Item deleted successfully'
    };
  } catch (error: any) {
    console.error('[API-DEMO] ❌ Failed to delete item:', error);
    return {
      success: false,
      error: `Failed to delete item: ${error.message}`
    };
  }
};
```

### Step 3: External API Testing

```typescript
// External API connectivity testing (from externalApiService.ts)
export const checkCommunityStatus = async (): Promise<ApiResponse<ExternalApiStatus>> => {
  try {
    console.log('[API-DEMO] Testing external API connectivity...');
    console.log('[API-DEMO] 🌐 External API Check #' + (requestCounter++));
    
    const startTime = Date.now();
    
    // Test external API connectivity
    const response = await apiServiceWrapper.get('https://community.braindrive.ai/', {
      timeout: 10000, // 10 second timeout
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    
    const responseTime = Date.now() - startTime;
    
    console.log('[API-DEMO] ✅ External API Check #' + requestCounter + ' - Success');
    console.log('[API-DEMO] ⏱️ Response time:', responseTime + 'ms');
    
    const status: ExternalApiStatus = {
      status: 'online',
      responseTime,
      timestamp: new Date().toISOString(),
      endpoint: 'https://community.braindrive.ai/'
    };
    
    console.log('[API-DEMO] ✅ External API check completed:', status.status);
    
    return {
      success: true,
      data: status,
      message: 'External API is accessible'
    };
  } catch (error: any) {
    console.error('[API-DEMO] ❌ External API check failed:', error);
    
    const status: ExternalApiStatus = {
      status: 'offline',
      responseTime: 0,
      timestamp: new Date().toISOString(),
      endpoint: 'https://community.braindrive.ai/',
      error: error.message
    };
    
    return {
      success: false,
      data: status,
      error: `External API check failed: ${error.message}`
    };
  }
};
```

## 📋 Request/Response Structure

### API Service Wrapper (from apiService.ts)

```typescript
interface ApiServiceWrapper {
  /** Check if the service bridge is connected */
  isServiceConnected(): boolean;
  
  /** Set the service bridge instance */
  setServiceBridge(bridge: any): void;
  
  /** Make a GET request */
  get(url: string, options?: RequestOptions): Promise<ApiResponse>;
  
  /** Make a POST request */
  post(url: string, data?: any, options?: RequestOptions): Promise<ApiResponse>;
  
  /** Make a PUT request */
  put(url: string, data?: any, options?: RequestOptions): Promise<ApiResponse>;
  
  /** Make a DELETE request */
  delete(url: string, options?: RequestOptions): Promise<ApiResponse>;
}
```

### Standard Response Format

```typescript
interface ApiResponse<T = any> {
  /** Whether the operation was successful */
  success: boolean;
  
  /** The response data (if successful) */
  data?: T;
  
  /** Error message (if failed) */
  error?: string;
  
  /** Success message */
  message?: string;
  
  /** HTTP status code */
  status?: number;
  
  /** Additional metadata */
  metadata?: {
    timestamp: string;
    requestId?: string;
    responseTime?: number;
  };
}
```

### Demo Item Structure

```typescript
interface DemoItem {
  /** Unique identifier for the item */
  id: string;
  
  /** Display name of the item */
  name: string;
  
  /** Description of the item */
  description: string;
  
  /** Numeric value associated with the item */
  value: number;
  
  /** ISO timestamp when the item was created */
  timestamp: string;
  
  /** ISO timestamp when the item was last updated */
  updatedAt?: string;
}
```

### Request Options

```typescript
interface RequestOptions {
  /** Request timeout in milliseconds */
  timeout?: number;
  
  /** Custom headers */
  headers?: Record<string, string>;
  
  /** Query parameters */
  params?: Record<string, any>;
  
  /** Whether to include credentials */
  withCredentials?: boolean;
}

// Examples
const defaultOptions = { timeout: 5000 };
const customHeaders = { 
  timeout: 10000, 
  headers: { 'Content-Type': 'application/json' } 
};
const withParams = { 
  params: { page: 1, limit: 10 } 
};
```

## 🚨 Error Handling

### Enhanced Error Handling Patterns

```typescript
// Comprehensive error extraction (from ApiExample.tsx)
private extractErrorMessage(error: any): string {
  console.log('[API-DEMO] 📚 LEARNING: Extracting user-friendly error message');
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.response?.status) {
    return `HTTP ${error.response.status}: ${this.getHttpErrorMessage(error.response.status)}`;
  }
  
  return 'An unexpected error occurred';
}

// HTTP error message mapping
private getHttpErrorMessage(status: number): string {
  switch (status) {
    case 400: return 'Bad Request - Invalid data provided';
    case 401: return 'Unauthorized - Authentication required';
    case 403: return 'Forbidden - Insufficient permissions';
    case 404: return 'Not Found - Resource does not exist';
    case 422: return 'Validation Error - Data validation failed';
    case 500: return 'Internal Server Error - Server encountered an error';
    case 503: return 'Service Unavailable - Server temporarily unavailable';
    default: return 'Unknown error occurred';
  }
}
```

### Educational Error Logging

```typescript
// Educational error analysis (from ApiExample.tsx)
private logErrorEducation(error: any, operation: string): void {
  console.group(`[API-DEMO] 📚 LEARNING: ${operation} Error Analysis`);
  
  console.log('🔍 Error Details:', {
    type: typeof error,
    message: error?.message,
    status: error?.response?.status,
    data: error?.response?.data
  });
  
  // Categorize error type
  if (error?.code === 'NETWORK_ERROR') {
    console.log('📚 Error Category: Network Error');
    console.log('📚 Common Causes: Internet connection, DNS issues, server down');
    console.log('📚 Recommended Action: Check connection, retry with exponential backoff');
  } else if (error?.response?.status >= 400 && error?.response?.status < 500) {
    console.log('📚 Error Category: Client Error (4xx)');
    console.log('📚 Common Causes:', this.getHttpErrorCauses(error.response.status));
    console.log('📚 Recommended Action:', this.getHttpErrorAction(error.response.status));
  } else if (error?.response?.status >= 500) {
    console.log('📚 Error Category: Server Error (5xx)');
    console.log('📚 Common Causes:', this.getHttpErrorCauses(error.response.status));
    console.log('📚 Recommended Action:', this.getHttpErrorAction(error.response.status));
  } else {
    console.log('📚 Error Category: Unknown/Unexpected Error');
    console.log('📚 Recommended Action: Log error details and implement appropriate fallback');
  }
  
  console.groupEnd();
}
```

### Error Recovery Patterns

```typescript
// Retry mechanism for failed requests (example pattern)
const requestWithRetry = async (
  requestFn: () => Promise<any>, 
  maxRetries = 3,
  baseDelay = 1000
) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      console.warn(`[API-DEMO] Request attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        throw error; // Final attempt failed
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`[API-DEMO] 📚 LEARNING: Retrying in ${delay}ms (exponential backoff)`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Usage example
try {
  const result = await requestWithRetry(
    () => demoApiService.getItems(),
    3, // max retries
    1000 // base delay
  );
} catch (error) {
  console.error('[API-DEMO] All retry attempts failed:', error);
}
```

## 🎨 UI Patterns

### Connection Status Indicator

```typescript
// Visual indicator for API service connection (from ApiExample.tsx)
<div className="status-display">
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <div style={{
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: this.state.data?.apiServiceConnected ? '#4caf50' : '#f44336'
    }} />
    <span style={{ fontSize: '10px', color: '#666' }}>
      {this.state.data?.apiServiceConnected ? 'API Connected' : 'API Disconnected'}
    </span>
  </div>
  <small>Status: {this.state.status}</small>
</div>
```

### Loading States with Error Handling

```typescript
// Loading state management (from ApiExample.tsx)
{this.state.isLoading ? (
  <div className="loading-state">
    <div className="loading-spinner"></div>
    <p>Processing request...</p>
  </div>
) : this.state.error ? (
  <div className="error-display">
    <div className="error-icon">⚠️</div>
    <p>{this.state.error}</p>
    <div className="error-suggestions">
      <h6>💡 Troubleshooting Tips:</h6>
      <ul>
        <li>Check your internet connection</li>
        <li>Verify the API service is running</li>
        <li>Try refreshing the page</li>
        <li>Check the browser console for detailed error information</li>
      </ul>
    </div>
  </div>
) : (
  // Normal content
  this.renderContent()
)}
```

### Status Messages with Color Coding

```typescript
// Dynamic status styling based on message type (from CSS)
.status-display {
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 4px;
  font-size: 12px;
  color: #0369a1;
}

.error-display {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
  color: #b91c1c;
  font-size: 14px;
}

.metric-value.success {
  color: #10b981;
  font-weight: 600;
}

.metric-value.error {
  color: #ef4444;
  font-weight: 600;
}
```

## 🔍 Debugging and Monitoring

### Educational Logging

The plugin includes comprehensive logging for learning purposes:

```typescript
// Service initialization logging
console.log('[API-DEMO] 📚 LEARNING: API Service Bridge Example initialized');
console.log('[API-DEMO] 🔄 Component mounting - initializing services');
console.log('[API-DEMO] ✅ API Service Bridge connected');

// Request/response logging
console.log('[API-DEMO] 📚 LEARNING: Fetching demo items (GET request)');
console.log('[API-DEMO] 📤 GET Request #' + requestCounter);
console.log('[API-DEMO] ✅ GET Response #' + requestCounter);

// Error analysis logging
console.group('[API-DEMO] 📚 LEARNING: CREATE Error Analysis');
console.log('🔍 Error Details:', errorDetails);
console.log('📚 Error Category: Client Error (4xx)');
console.groupEnd();
```

### Service Statistics

```typescript
// Track API usage statistics (from components)
interface ApiStatistics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  lastRequestTime: string;
  connectionStatus: 'connected' | 'disconnected' | 'error';
}

// Update statistics after each request
const updateStatistics = (success: boolean, responseTime: number) => {
  this.setState(prevState => ({
    statistics: {
      ...prevState.statistics,
      totalRequests: prevState.statistics.totalRequests + 1,
      successfulRequests: success ? 
        prevState.statistics.successfulRequests + 1 : 
        prevState.statistics.successfulRequests,
      failedRequests: !success ? 
        prevState.statistics.failedRequests + 1 : 
        prevState.statistics.failedRequests,
      lastRequestTime: new Date().toISOString()
    }
  }));
};
```

## ✅ Best Practices

### 1. Service Lifecycle Management

```typescript
// Always check service availability before making requests
if (!apiServiceWrapper.isServiceConnected()) {
  console.warn('[API-DEMO] API Service not connected');
  return { success: false, error: 'API Service not available' };
}

// Handle service reconnection
componentDidUpdate(prevProps: PluginTemplateProps) {
  if (prevProps.services?.api !== this.props.services?.api) {
    this.initializeApiService();
  }
}

// Clean up on unmount
componentWillUnmount() {
  // Cancel any pending requests
  // Clear timers and intervals
  // Clean up event listeners
}
```

### 2. Request Management

```typescript
// Use proper timeout values
const requestOptions = {
  timeout: 10000, // 10 seconds for external APIs
  headers: {
    'Content-Type': 'application/json'
  }
};

// Implement request cancellation for long-running requests
const controller = new AbortController();
const requestOptions = {
  signal: controller.signal,
  timeout: 30000
};

// Cancel request on component unmount
componentWillUnmount() {
  controller.abort();
}
```

### 3. Error Handling

```typescript
// Always wrap API calls in try-catch blocks
try {
  const result = await apiService.get('/endpoint');
  // Handle success
} catch (error) {
  // Extract user-friendly error message
  const userMessage = this.extractUserFriendlyMessage(error);
  
  // Log technical details for debugging
  console.error('[API-DEMO] Technical error:', error);
  
  // Show user-friendly message
  this.setState({ error: userMessage });
  
  // Provide recovery suggestions
  this.showRecoverySuggestions(error);
}
```

### 4. Loading State Management

```typescript
// Always manage loading states properly
const performApiOperation = async () => {
  this.setState({ isLoading: true, error: '' });
  
  try {
    const result = await apiService.someOperation();
    // Handle success
  } catch (error) {
    // Handle error
  } finally {
    // Always clear loading state
    this.setState({ isLoading: false });
  }
};
```

## ⚠️ Common Pitfalls

### 1. Forgetting Error Handling

```typescript
// ❌ Bad: No error handling
const fetchData = async () => {
  const result = await apiService.get('/data');
  this.setState({ data: result.data });
};

// ✅ Good: Proper error handling
const fetchData = async () => {
  try {
    this.setState({ isLoading: true, error: '' });
    const result = await apiService.get('/data');
    
    if (result.success) {
      this.setState({ data: result.data });
    } else {
      throw new Error(result.error || 'Failed to fetch data');
    }
  } catch (error) {
    const userMessage = this.extractUserFriendlyMessage(error);
    this.setState({ error: userMessage });
    console.error('[API] Fetch failed:', error);
  } finally {
    this.setState({ isLoading: false });
  }
};
```

### 2. Not Checking Service Availability

```typescript
// ❌ Bad: Assuming service is always available
const makeRequest = async () => {
  return await apiService.get('/endpoint');
};

// ✅ Good: Check service availability first
const makeRequest = async () => {
  if (!apiServiceWrapper.isServiceConnected()) {
    throw new Error('API Service not available');
  }
  
  return await apiService.get('/endpoint');
};
```

### 3. Improper Loading State Management

```typescript
// ❌ Bad: Loading state not cleared on error
const fetchData = async () => {
  this.setState({ isLoading: true });
  try {
    const result = await apiService.get('/data');
    this.setState({ data: result.data, isLoading: false });
  } catch (error) {
    this.setState({ error: error.message });
    // Loading state never cleared!
  }
};

// ✅ Good: Always clear loading state
const fetchData = async () => {
  this.setState({ isLoading: true, error: '' });
  try {
    const result = await apiService.get('/data');
    this.setState({ data: result.data });
  } catch (error) {
    this.setState({ error: error.message });
  } finally {
    this.setState({ isLoading: false });
  }
};
```

## 🧪 Testing Patterns

### 1. Component Testing

```typescript
// Test service integration
describe('ApiExample Component', () => {
  it('should initialize API service on mount', () => {
    const mockServices = {
      api: mockApiService
    };
    
    const wrapper = mount(<ApiExample services={mockServices} />);
    
    expect(apiServiceWrapper.setServiceBridge).toHaveBeenCalledWith(mockApiService);
  });
  
  it('should handle API errors gracefully', async () => {
    const mockError = new Error('Network error');
    mockApiService.get.mockRejectedValue(mockError);
    
    const wrapper = mount(<ApiExample services={{ api: mockApiService }} />);
    
    await wrapper.instance().handleRefreshItems();
    
    expect(wrapper.state('error')).toContain('Network error');
    expect(wrapper.state('isLoading')).toBe(false);
  });
});
```

### 2. Service Testing

```typescript
// Test API service wrapper
describe('API Service Wrapper', () => {
  it('should make GET requests correctly', async () => {
    const mockResponse = { data: [{ id: '1', name: 'Test' }] };
    mockBridge.get.mockResolvedValue(mockResponse);
    
    const result = await apiServiceWrapper.get('/test');
    
    expect(mockBridge.get).toHaveBeenCalledWith('/test', undefined);
    expect(result).toEqual(mockResponse);
  });
  
  it('should handle request errors', async () => {
    const mockError = new Error('Request failed');
    mockBridge.get.mockRejectedValue(mockError);
    
    await expect(apiServiceWrapper.get('/test')).rejects.toThrow('Request failed');
  });
});
```

## 📖 Resources

### Code Examples

- **ApiExample.tsx** - Main component demonstrating tabbed interface and error handling
- **apiService.ts** -