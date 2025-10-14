// API Base URL with development fallback
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// API Client and Configuration
export { apiClient, ApiClientError } from './apiClient';

// NEW: Consolidated API Client (Clean Architecture)
export { consolidatedApi, inventoryApi, salesApi, adminApi, healthCheck } from './consolidatedClient';

// Types and Interfaces
export type {
  ApiResponse,
  ApiError,
  RequestConfig,
  GetInfoFromScannedCodeRequest,
  ScannedCodeInfo,
  CodeValidationResult,
  RegisterBoxRequest,
  RegisterBoxResult,
  ProcessScanRequest,
  ProcessScanResult,
  // NEW: Clean Architecture Types
  ConsolidatedApiRequest,
  StandardApiResponse,
  PaginationParams,
  PaginatedResponse,
  FilterParams,
  GetBoxesParams,
  CreateBoxParams,
  AssignBoxParams,
  MoveBoxParams,
  GetPalletsParams,
  CreatePalletParams,
  ClosePalletParams,
  MovePalletParams,
  GetOrdersParams,
  CreateOrderParams,
  GetCustomersParams,
  CreateCustomerParams,
  GetIssuesParams,
  CreateIssueParams,
  UpdateIssueParams,
  GenerateReportParams,
} from './types';

// Endpoints (Backward Compatible - uses endpointsAdapter)
export {
  endpoints,
  getInfoFromScannedCode,
  registerBox,
  submitBoxRegistration,
  processScan,
  submitScan,
  movePallet,
  submitMovePallet,
  postIssue,
  submitIssueReport,
  createPallet,
  togglePalletStatus,
  submitPalletStatusToggle,
} from './endpointsAdapter';

// Pallets helpers (Backward Compatible)
export { pallets, getActivePallets, closePallet } from './endpointsAdapter';

// Utilities (re-export for convenience)
export {
  validateScannedCode,
  isValidBoxCode,
  isValidPalletCode,
  sanitizeCode,
  formatCodeForDisplay,
} from '../utils/validators';
