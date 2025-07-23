/**
 * API-related type definitions for ServiceExample_API plugin
 */

// Core API response wrapper
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  responseTime: number;
  timestamp: string;
}

// API error interface
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

// External API check result
export interface ApiCheckResult {
  url: string;
  status: 'online' | 'offline' | 'error' | 'checking';
  responseTime: number | null;
  timestamp: string;
  statusCode: number | null;
  error: string | null;
}

// Demo item interfaces (matching backend)
export interface DemoItem {
  id: string;
  name: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateItemRequest {
  name: string;
  description: string;
}

export interface UpdateItemRequest {
  name?: string;
  description?: string;
}

export interface DemoItemsResponse {
  data: DemoItem[];
  count: number;
  message: string;
}

export interface DemoItemResponse {
  data: DemoItem;
  message: string;
}

export interface DemoStatus {
  status: string;
  user_item_count: number;
  total_items: number;
  server_time: string;
  user_id: string;
  message: string;
}

export interface DemoHealthResponse {
  status: string;
  timestamp: string;
  service: string;
  version: string;
}

// API operation status
export type ApiOperationStatus = 'idle' | 'loading' | 'success' | 'error';

// Request timing information
export interface RequestTiming {
  startTime: number;
  endTime: number;
  duration: number;
}