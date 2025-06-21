// API Base URL with development fallback
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// API Client and Configuration
export { apiClient, ApiClientError } from './apiClient';

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
} from './types';

// Endpoints
export {
  endpoints,
  getInfoFromScannedCode,
  registerBox,
  submitBoxRegistration,
  processScan,
  submitScan,
} from './endpoints';

// Utilities (re-export for convenience)
export {
  validateScannedCode,
  isValidBoxCode,
  isValidPalletCode,
  sanitizeCode,
  formatCodeForDisplay,
} from '../utils/validators';
