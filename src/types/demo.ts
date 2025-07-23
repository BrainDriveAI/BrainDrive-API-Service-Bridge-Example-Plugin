/**
 * Demo-specific type definitions for ServiceExample_API plugin
 */

import { DemoItem, ApiOperationStatus, ApiCheckResult } from './api';

// Component state interfaces
export interface InternalApiDemoState {
  items: DemoItem[];
  isLoading: boolean;
  error: string;
  status: string;
  editingItem: string | null;
  newItem: { name: string; description: string };
  operationInProgress: string | null;
  operationStatus: ApiOperationStatus;
  lastOperation: string;
  requestCount: number;
}

export interface ExternalApiCheckerState {
  isChecking: boolean;
  lastCheckTime: string | null;
  status: 'unknown' | 'online' | 'offline' | 'error';
  responseTime: number | null;
  error: string;
  checkHistory: ApiCheckResult[];
  autoCheck: boolean;
  checkInterval: number;
  totalChecks: number;
}

export interface ApiStatusDisplayProps {
  status: string;
  isLoading: boolean;
  error: string | null;
  responseData: any;
  requestTime: number | null;
  responseTime: number | null;
  showRawResponse?: boolean;
  operationType?: string;
}

// Form validation interfaces
export interface ItemFormData {
  name: string;
  description: string;
}

export interface ItemFormErrors {
  name?: string;
  description?: string;
}

// Operation result interfaces
export interface OperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timing?: {
    startTime: number;
    endTime: number;
    duration: number;
  };
}
