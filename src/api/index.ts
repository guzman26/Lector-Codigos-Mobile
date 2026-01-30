// API Base URL (defined in config to avoid circular imports)
export { API_BASE_URL } from './config';

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
  CustomInfoEntry,
  CreateCustomBoxCustomInfo,
} from './types';

// Endpoints (Clean Architecture)
export {
  endpoints,
  getInfoFromScannedCode,
  registerBox,
  submitBoxRegistration,
  createCustomBox,
  submitCreateCustomBox,
  processScan,
  submitScan,
  movePallet,
  submitMovePallet,
  moveCart,
  submitMoveCart,
  postIssue,
  submitIssueReport,
  createPallet,
  togglePalletStatus,
  submitPalletStatusToggle,
} from './endpoints';

// Pallets helpers
export { pallets, getActivePallets, closePallet } from './endpoints';

// Utilities (re-export for convenience)
export {
  validateScannedCode,
  isValidBoxCode,
  isValidPalletCode,
  sanitizeCode,
  formatCodeForDisplay,
} from '../utils/validators';
