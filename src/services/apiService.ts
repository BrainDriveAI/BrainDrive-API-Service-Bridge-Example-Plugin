/**
 * API Service Bridge Wrapper for ServiceExample_API plugin
 * 
 * This service provides a wrapper around the BrainDrive API Service Bridge
 * with enhanced error handling, logging, and educational features.
 */

import { ApiResponse, ApiError, RequestTiming } from '../types/api';

export class ApiServiceWrapper {
  private apiService: any = null;
  private isConnected: boolean = false;
  private requestCount: number = 0;

  constructor() {
    console.log('[API-DEMO] 📚 LEARNING: ApiServiceWrapper initialized');
  }

  /**
   * Set the API Service Bridge instance
   */
  setServiceBridge(service: any): void {
    this.apiService = service;
    this.isConnected = true;
    console.log('[API-DEMO] ✅ API Service Bridge connected');
    console.log('[API-DEMO] 📚 LEARNING: You can now make authenticated API requests');
  }

  /**
   * Check if the service is connected
   */
  isServiceConnected(): boolean {
    return this.isConnected && this.apiService !== null;
  }

  /**
   * Get request statistics
   */
  getStats(): { requestCount: number; isConnected: boolean } {
    return {
      requestCount: this.requestCount,
      isConnected: this.isConnected
    };
  }

  /**
   * Make a GET request
   */
  async get<T>(path: string, options?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('GET', path, undefined, options);
  }

  /**
   * Make a POST request
   */
  async post<T>(path: string, data?: any, options?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('POST', path, data, options);
  }

  /**
   * Make a PUT request
   */
  async put<T>(path: string, data?: any, options?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('PUT', path, data, options);
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(path: string, options?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('DELETE', path, undefined, options);
  }

  /**
   * Core request method with comprehensive error handling and logging
   */
  private async makeRequest<T>(
    method: string,
    path: string,
    data?: any,
    options?: any
  ): Promise<ApiResponse<T>> {
    if (!this.isServiceConnected()) {
      const error = new Error('API Service not connected');
      console.error('[API-DEMO] ❌ API Service not connected');
      throw this.createApiError(error, 503, 'SERVICE_NOT_CONNECTED');
    }

    this.requestCount++;
    const requestId = `req-${this.requestCount}`;
    const startTime = Date.now();

    console.group(`[API-DEMO] 📤 ${method} Request #${this.requestCount}`);
    console.log('Path:', path);
    console.log('Request ID:', requestId);
    if (data) {
      console.log('Data:', data);
    }
    console.log('📚 LEARNING: Making authenticated request through API Service Bridge');
    console.groupEnd();

    try {
      let response: any;

      // Make the appropriate request based on method
      switch (method.toUpperCase()) {
        case 'GET':
          response = await this.apiService.get(path, options);
          break;
        case 'POST':
          response = await this.apiService.post(path, data, options);
          break;
        case 'PUT':
          response = await this.apiService.put(path, data, options);
          break;
        case 'DELETE':
          response = await this.apiService.delete(path, options);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      console.group(`[API-DEMO] ✅ ${method} Response #${this.requestCount}`);
      console.log('Status: Success');
      console.log('Response Time:', `${responseTime}ms`);
      console.log('Response Data:', response);
      console.log('📚 LEARNING: Request completed successfully with authentication');
      console.groupEnd();

      return {
        data: response,
        status: 200, // Assume success if no error thrown
        responseTime,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      console.group(`[API-DEMO] ❌ ${method} Error #${this.requestCount}`);
      console.log('Error:', error);
      console.log('Response Time:', `${responseTime}ms`);
      console.log('📚 LEARNING: Error handling in action - check error details');
      console.groupEnd();

      throw this.handleApiError(error, responseTime);
    }
  }

  /**
   * Handle and format API errors
   */
  private handleApiError(error: any, responseTime: number): ApiError {
    let apiError: ApiError;

    if (error?.response) {
      // HTTP error response
      const status = error.response.status;
      const message = this.getErrorMessage(status, error.response.data);
      
      apiError = this.createApiError(error, status, this.getErrorCode(status), {
        responseData: error.response.data,
        responseTime
      });

      console.log(`[API-DEMO] 📚 LEARNING: HTTP ${status} error - ${this.getErrorExplanation(status)}`);
    } else if (error?.code === 'ERR_NETWORK') {
      // Network error
      apiError = this.createApiError(error, 0, 'NETWORK_ERROR', { responseTime });
      console.log('[API-DEMO] 📚 LEARNING: Network error - check your connection');
    } else if (error?.message?.includes('timeout')) {
      // Timeout error
      apiError = this.createApiError(error, 408, 'TIMEOUT', { responseTime });
      console.log('[API-DEMO] 📚 LEARNING: Request timeout - server took too long to respond');
    } else {
      // Generic error
      apiError = this.createApiError(error, 500, 'UNKNOWN_ERROR', { responseTime });
      console.log('[API-DEMO] 📚 LEARNING: Unknown error occurred');
    }

    return apiError;
  }

  /**
   * Create a standardized API error
   */
  private createApiError(error: any, status?: number, code?: string, details?: any): ApiError {
    return {
      message: error?.message || 'An unknown error occurred',
      status,
      code,
      details
    };
  }

  /**
   * Get user-friendly error message based on status code
   */
  private getErrorMessage(status: number, responseData?: any): string {
    const serverMessage = responseData?.detail || responseData?.message;
    
    switch (status) {
      case 400:
        return serverMessage || 'Bad request - please check your input';
      case 401:
        return 'Authentication required - please log in';
      case 403:
        return 'Access denied - you don\'t have permission for this action';
      case 404:
        return serverMessage || 'Resource not found';
      case 422:
        return serverMessage || 'Validation error - please check your input';
      case 500:
        return 'Server error - please try again later';
      case 503:
        return 'Service unavailable - please try again later';
      default:
        return serverMessage || `HTTP ${status} error occurred`;
    }
  }

  /**
   * Get error code based on status
   */
  private getErrorCode(status: number): string {
    switch (status) {
      case 400: return 'BAD_REQUEST';
      case 401: return 'UNAUTHORIZED';
      case 403: return 'FORBIDDEN';
      case 404: return 'NOT_FOUND';
      case 422: return 'VALIDATION_ERROR';
      case 500: return 'INTERNAL_SERVER_ERROR';
      case 503: return 'SERVICE_UNAVAILABLE';
      default: return 'HTTP_ERROR';
    }
  }

  /**
   * Get educational explanation for error status codes
   */
  private getErrorExplanation(status: number): string {
    switch (status) {
      case 400:
        return 'Client sent invalid data';
      case 401:
        return 'Authentication token missing or invalid';
      case 403:
        return 'User lacks permission for this resource';
      case 404:
        return 'Requested resource does not exist';
      case 422:
        return 'Request data failed validation';
      case 500:
        return 'Server encountered an internal error';
      case 503:
        return 'Service temporarily unavailable';
      default:
        return 'HTTP error occurred';
    }
  }
}

// Export singleton instance
export const apiServiceWrapper = new ApiServiceWrapper();