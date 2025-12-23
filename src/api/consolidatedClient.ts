/**
 * Consolidated API Client for Clean Architecture Backend
 * 
 * This client provides a unified interface for interacting with the 
 * consolidated backend endpoints: /inventory, /sales, /admin
 */

import { apiClient } from './apiClient';
import type {
  ConsolidatedApiRequest,
  StandardApiResponse,
  ApiResponse,
} from './types';
import { API_BASE_URL } from './index';

/**
 * Response adapter that converts StandardApiResponse to ApiResponse
 * for backward compatibility with existing code
 */
const adaptResponse = <T>(response: StandardApiResponse<T>): ApiResponse<T> => {
  return {
    success: response.status === 'success',
    data: response.data,
    error: response.status === 'error' || response.status === 'fail' 
      ? response.message 
      : undefined,
    message: response.message,
  };
};

/**
 * Makes a consolidated API request to a specific endpoint
 * 
 * @param endpoint - The consolidated endpoint path (/inventory, /sales, /admin)
 * @param resource - The resource type (box, pallet, order, customer, issue, etc.)
 * @param action - The action to perform (get, create, update, delete, etc.)
 * @param params - Action-specific parameters
 * @returns Promise with the adapted response
 */
const makeConsolidatedRequest = async <T>(
  endpoint: '/inventory' | '/sales' | '/admin',
  resource: string,
  action: string,
  params: any
): Promise<ApiResponse<T>> => {
  const request: ConsolidatedApiRequest = {
    resource,
    action,
    params,
  };

  try {
    // Use the existing apiClient.post which handles retries, timeouts, etc.
    const response = await apiClient.post<T>(endpoint, request);
    
    // If the response is already in ApiResponse format, return it
    if ('success' in response && typeof response.success === 'boolean') {
      return response as ApiResponse<T>;
    }

    // If it's a StandardApiResponse, adapt it
    if ('status' in response && 'meta' in response) {
      return adaptResponse(response as any as StandardApiResponse<T>);
    }

    // Otherwise, return as is
    return response;
  } catch (error) {
    // Re-throw errors from apiClient (they're already ApiClientError)
    throw error;
  }
};

/**
 * ===================================================================
 * INVENTORY ENDPOINT METHODS
 * ===================================================================
 */

/**
 * Inventory API - handles all box and pallet operations
 */
export const inventoryApi = {
  /**
   * Box operations
   */
  box: {
    /**
     * Get boxes with optional filters and pagination
     */
    get: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/inventory', 'box', 'get', params);
    },

    /**
     * Create a new box
     */
    create: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/inventory', 'box', 'create', params);
    },

    /**
     * Assign a box to a pallet
     */
    assign: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/inventory', 'box', 'assign', params);
    },

    /**
     * Unassign a box from its pallet
     */
    unassign: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/inventory', 'box', 'unassign', params);
    },

    /**
     * Move a box to a different location
     */
    move: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/inventory', 'box', 'move', params);
    },

    /**
     * Delete a box
     */
    delete: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/inventory', 'box', 'delete', params);
    },
  },

  /**
   * Pallet operations
   */
  pallet: {
    /**
     * Get pallets with optional filters and pagination
     */
    get: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/inventory', 'pallet', 'get', params);
    },

    /**
     * Create a new pallet
     */
    create: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/inventory', 'pallet', 'create', params);
    },

    /**
     * Close a pallet (prevent further box additions)
     */
    close: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/inventory', 'pallet', 'close', params);
    },

    /**
     * Move a pallet to a different location
     */
    move: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/inventory', 'pallet', 'move', params);
    },

    /**
     * Delete a pallet
     */
    delete: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/inventory', 'pallet', 'delete', params);
    },
  },

  /**
   * Cart operations
   */
  cart: {
    /**
     * Get carts with optional filters and pagination
     */
    get: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/inventory', 'cart', 'get', params);
    },

    /**
     * Move a cart to a different location
     */
    move: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/inventory', 'cart', 'move', params);
    },
  },
};

/**
 * ===================================================================
 * SALES ENDPOINT METHODS
 * ===================================================================
 */

/**
 * Sales API - handles orders and customers
 */
export const salesApi = {
  /**
   * Order operations
   */
  order: {
    /**
     * Get orders with optional filters and pagination
     */
    get: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/sales', 'order', 'get', params);
    },

    /**
     * Create a new sales order
     */
    create: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/sales', 'order', 'create', params);
    },

    /**
     * Confirm a sales order
     */
    confirm: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/sales', 'order', 'confirm', params);
    },

    /**
     * Dispatch a sales order
     */
    dispatch: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/sales', 'order', 'dispatch', params);
    },

    /**
     * Complete a sales order
     */
    complete: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/sales', 'order', 'complete', params);
    },

    /**
     * Cancel a sales order
     */
    cancel: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/sales', 'order', 'cancel', params);
    },
  },

  /**
   * Customer operations
   */
  customer: {
    /**
     * Get customers with optional filters and pagination
     */
    get: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/sales', 'customer', 'get', params);
    },

    /**
     * Create a new customer
     */
    create: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/sales', 'customer', 'create', params);
    },

    /**
     * Update customer information
     */
    update: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/sales', 'customer', 'update', params);
    },

    /**
     * Delete a customer
     */
    delete: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/sales', 'customer', 'delete', params);
    },
  },
};

/**
 * ===================================================================
 * ADMIN ENDPOINT METHODS
 * ===================================================================
 */

/**
 * Admin API - handles issues, reports, and configuration
 */
export const adminApi = {
  /**
   * Issue operations
   */
  issue: {
    /**
     * Get issues with optional filters and pagination
     */
    get: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/admin', 'issue', 'get', params);
    },

    /**
     * Create a new issue report
     */
    create: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/admin', 'issue', 'create', params);
    },

    /**
     * Update issue status
     */
    update: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/admin', 'issue', 'update', params);
    },

    /**
     * Delete an issue
     */
    delete: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/admin', 'issue', 'delete', params);
    },
  },

  /**
   * Audit operations
   */
  audit: {
    /**
     * Get audit logs
     */
    get: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/admin', 'audit', 'get', params);
    },

    /**
     * Perform audit on a pallet
     */
    create: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/admin', 'audit', 'create', params);
    },
  },

  /**
   * Report operations
   */
  report: {
    /**
     * Get report data
     */
    get: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/admin', 'report', 'get', params);
    },

    /**
     * Generate a new report
     */
    generate: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/admin', 'report', 'generate', params);
    },
  },

  /**
   * Configuration operations
   */
  config: {
    /**
     * Get system configuration
     */
    get: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/admin', 'config', 'get', params);
    },

    /**
     * Update system configuration
     */
    update: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/admin', 'config', 'update', params);
    },
  },

  /**
   * Bulk operations (dangerous!)
   */
  bulk: {
    /**
     * Delete boxes in bulk
     */
    deleteBoxes: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/admin', 'bulk', 'delete-boxes', params);
    },

    /**
     * Delete pallets in bulk
     */
    deletePallets: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/admin', 'bulk', 'delete-pallets', params);
    },

    /**
     * Delete all pallets and their assigned boxes
     * ⚠️ WARNING: This is a dangerous operation!
     */
    deletePalletsAndBoxes: async <T = any>(params: any): Promise<ApiResponse<T>> => {
      return makeConsolidatedRequest('/admin', 'bulk', 'delete-pallets-and-boxes', params);
    },
  },
};

/**
 * ===================================================================
 * UTILITY METHODS
 * ===================================================================
 */

/**
 * Health check endpoint
 */
export const healthCheck = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return {
      success: response.ok,
      data,
      message: response.ok ? 'Service healthy' : 'Service unhealthy',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to reach health check endpoint',
      message: 'Service unavailable',
    };
  }
};

/**
 * Consolidated API client - single export point
 */
export const consolidatedApi = {
  inventory: inventoryApi,
  sales: salesApi,
  admin: adminApi,
  healthCheck,
};

