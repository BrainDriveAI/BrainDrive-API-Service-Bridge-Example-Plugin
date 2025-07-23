/**
 * Demo API Service for ServiceExample_API plugin
 * 
 * This service handles CRUD operations for the demo items endpoint,
 * providing a clean interface for the components to interact with the backend.
 */

import { apiServiceWrapper } from './apiService';
import {
  DemoItem,
  CreateItemRequest,
  UpdateItemRequest,
  DemoItemsResponse,
  DemoItemResponse,
  DemoStatus,
  DemoHealthResponse
} from '../types/api';
import { OperationResult } from '../types/demo';

export class DemoApiService {
  private baseUrl = '/api/v1/demo';

  constructor() {
    console.log('[API-DEMO] 📚 LEARNING: DemoApiService initialized for CRUD operations');
  }

  /**
   * Get all demo items for the current user
   */
  async getItems(): Promise<OperationResult<DemoItem[]>> {
    const startTime = Date.now();
    
    try {
      console.log('[API-DEMO] 📚 LEARNING: Fetching demo items (GET request)');
      
      const response = await apiServiceWrapper.get<DemoItemsResponse>(`${this.baseUrl}/items`);
      const endTime = Date.now();
      
      console.log(`[API-DEMO] ✅ Retrieved ${response.data.count} items successfully`);
      console.log('[API-DEMO] 📚 LEARNING: GET request demonstrates reading data from backend');
      
      return {
        success: true,
        data: response.data.data,
        timing: {
          startTime,
          endTime,
          duration: endTime - startTime
        }
      };
    } catch (error) {
      const endTime = Date.now();
      console.error('[API-DEMO] ❌ Failed to fetch items:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch items',
        timing: {
          startTime,
          endTime,
          duration: endTime - startTime
        }
      };
    }
  }

  /**
   * Create a new demo item
   */
  async createItem(itemData: CreateItemRequest): Promise<OperationResult<DemoItem>> {
    const startTime = Date.now();
    
    try {
      // Validate input
      if (!itemData.name?.trim()) {
        throw new Error('Item name is required');
      }

      console.log('[API-DEMO] 📚 LEARNING: Creating new item (POST request)');
      console.log('[API-DEMO] Data to create:', itemData);
      
      const response = await apiServiceWrapper.post<DemoItemResponse>(
        `${this.baseUrl}/items`, 
        itemData
      );
      const endTime = Date.now();
      
      console.log('[API-DEMO] ✅ Item created successfully:', response.data.data);
      console.log('[API-DEMO] 📚 LEARNING: POST request demonstrates creating new data');
      
      return {
        success: true,
        data: response.data.data,
        timing: {
          startTime,
          endTime,
          duration: endTime - startTime
        }
      };
    } catch (error) {
      const endTime = Date.now();
      console.error('[API-DEMO] ❌ Failed to create item:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create item',
        timing: {
          startTime,
          endTime,
          duration: endTime - startTime
        }
      };
    }
  }

  /**
   * Update an existing demo item
   */
  async updateItem(id: string, itemData: UpdateItemRequest): Promise<OperationResult<DemoItem>> {
    const startTime = Date.now();
    
    try {
      if (!id) {
        throw new Error('Item ID is required');
      }

      console.log('[API-DEMO] 📚 LEARNING: Updating item (PUT request)');
      console.log('[API-DEMO] Item ID:', id);
      console.log('[API-DEMO] Update data:', itemData);
      
      const response = await apiServiceWrapper.put<DemoItemResponse>(
        `${this.baseUrl}/items/${id}`, 
        itemData
      );
      const endTime = Date.now();
      
      console.log('[API-DEMO] ✅ Item updated successfully:', response.data.data);
      console.log('[API-DEMO] 📚 LEARNING: PUT request demonstrates updating existing data');
      
      return {
        success: true,
        data: response.data.data,
        timing: {
          startTime,
          endTime,
          duration: endTime - startTime
        }
      };
    } catch (error) {
      const endTime = Date.now();
      console.error('[API-DEMO] ❌ Failed to update item:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update item',
        timing: {
          startTime,
          endTime,
          duration: endTime - startTime
        }
      };
    }
  }

  /**
   * Delete a demo item
   */
  async deleteItem(id: string): Promise<OperationResult<void>> {
    const startTime = Date.now();
    
    try {
      if (!id) {
        throw new Error('Item ID is required');
      }

      console.log('[API-DEMO] 📚 LEARNING: Deleting item (DELETE request)');
      console.log('[API-DEMO] Item ID:', id);
      
      await apiServiceWrapper.delete(`${this.baseUrl}/items/${id}`);
      const endTime = Date.now();
      
      console.log('[API-DEMO] ✅ Item deleted successfully');
      console.log('[API-DEMO] 📚 LEARNING: DELETE request demonstrates removing data');
      
      return {
        success: true,
        timing: {
          startTime,
          endTime,
          duration: endTime - startTime
        }
      };
    } catch (error) {
      const endTime = Date.now();
      console.error('[API-DEMO] ❌ Failed to delete item:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete item',
        timing: {
          startTime,
          endTime,
          duration: endTime - startTime
        }
      };
    }
  }

  /**
   * Get demo API status and statistics
   */
  async getStatus(): Promise<OperationResult<DemoStatus>> {
    const startTime = Date.now();
    
    try {
      console.log('[API-DEMO] 📚 LEARNING: Getting API status (GET request)');
      
      const response = await apiServiceWrapper.get<DemoStatus>(`${this.baseUrl}/status`);
      const endTime = Date.now();
      
      console.log('[API-DEMO] ✅ Status retrieved successfully:', response.data);
      console.log('[API-DEMO] 📚 LEARNING: Status endpoint provides API health information');
      
      return {
        success: true,
        data: response.data,
        timing: {
          startTime,
          endTime,
          duration: endTime - startTime
        }
      };
    } catch (error) {
      const endTime = Date.now();
      console.error('[API-DEMO] ❌ Failed to get status:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get status',
        timing: {
          startTime,
          endTime,
          duration: endTime - startTime
        }
      };
    }
  }

  /**
   * Health check (no authentication required)
   */
  async healthCheck(): Promise<OperationResult<DemoHealthResponse>> {
    const startTime = Date.now();
    
    try {
      console.log('[API-DEMO] 📚 LEARNING: Performing health check (GET request, no auth)');
      
      const response = await apiServiceWrapper.get<DemoHealthResponse>(`${this.baseUrl}/health`);
      const endTime = Date.now();
      
      console.log('[API-DEMO] ✅ Health check successful:', response.data);
      console.log('[API-DEMO] 📚 LEARNING: Health check endpoint tests basic connectivity');
      
      return {
        success: true,
        data: response.data,
        timing: {
          startTime,
          endTime,
          duration: endTime - startTime
        }
      };
    } catch (error) {
      const endTime = Date.now();
      console.error('[API-DEMO] ❌ Health check failed:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Health check failed',
        timing: {
          startTime,
          endTime,
          duration: endTime - startTime
        }
      };
    }
  }

  /**
   * Validate item data before sending to server
   */
  validateItemData(data: CreateItemRequest | UpdateItemRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if ('name' in data && data.name !== undefined) {
      if (!data.name.trim()) {
        errors.push('Name is required');
      } else if (data.name.length > 100) {
        errors.push('Name must be 100 characters or less');
      }
    }

    if ('description' in data && data.description !== undefined) {
      if (data.description.length > 500) {
        errors.push('Description must be 500 characters or less');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get service statistics
   */
  getServiceStats() {
    return apiServiceWrapper.getStats();
  }
}

// Export singleton instance
export const demoApiService = new DemoApiService();