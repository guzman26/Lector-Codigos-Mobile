// API Types and Interfaces

/**
 * Base API Response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * API Error structure
 */
export interface ApiError {
  message: string;
  code?: string | number;
  details?: unknown;
}

/**
 * Request configuration options
 */
export interface RequestConfig {
  timeout?: number;
  headers?: Record<string, string>;
  retries?: number;
}

/**
 * Scanned Code Info Request
 */
export interface GetInfoFromScannedCodeRequest {
  codigo: string;
}

/**
 * Scanned Code Info Response
 */
export interface ScannedCodeInfo {
  codigo: string;
  pkTipo: 'BOX' | 'PALLET';
  producto?: {
    id: string;
    nombre: string;
    descripcion?: string;
  };
  ubicacion?: {
    almacen: string;
    zona: string;
    posicion?: string;
  };
  estado: 'activo' | 'inactivo' | 'bloqueado';
  timestamp: string;
  scannedAt: string;
  fecha_registro: string;
  informacionAdicional?: Record<string, unknown>;
  contador: string;
  operario: string;
  empacadora: string;
  formato_caja: string;
}

/**
 * Code validation result
 */
export interface CodeValidationResult {
  isValid: boolean;
  type?: 'box' | 'pallet';
  errorMessage?: string;
}

/**
 * Report Issue Request
 */
export interface PostIssueRequest {
  descripcion: string;
}

/**
 * Report Issue Response
 */
export interface IssueReportResult {
  id?: string;
  mensaje?: string;
  fechaReporte?: string;
  estado?: 'recibido' | 'en_proceso' | 'resuelto';
  // Propiedades adicionales que puede devolver la API real
  issueNumber?: string;
  message?: string;
  [key: string]: any; // Para propiedades adicionales no esperadas
}

/**
 * Register Box Request
 */
export interface RegisterBoxRequest {
  codigo: string;
  producto: string;
  lote?: string;
  fechaVencimiento?: string;
  ubicacion?: string;
  observaciones?: string;
}

/**
 * Register Box Response
 */
export interface RegisterBoxResult {
  id: string;
  codigo: string;
  mensaje: string;
  fechaRegistro: string;
  estado: 'registrado' | 'pendiente' | 'error';
}

/**
 * Process Scan Request
 */
export interface ProcessScanRequest {
  codigo: string;
  ubicacion: string;
  tipo?: 'BOX' | 'PALLET';
  palletCodigo?: string;
  scannedCodes?: string;
  customInfo?: Array<[string, number]>; // [boxCode, eggCount]
}

/**
 * Process Scan Response
 */
export interface ProcessScanResult {
  success: boolean;
  message: string;
  data?: {
    codigo: string;
    tipo: 'BOX' | 'PALLET';
    ubicacion: string;
    estado: string;
    timestamp: string;
    [key: string]: any;
  };
}

/**
 * Toggle Pallet Status Request
 */
export interface TogglePalletStatusRequest {
  codigo: string;
}

/**
 * Toggle Pallet Status Response
 */
export interface TogglePalletStatusResult {
  codigo: string;
  estadoAnterior: 'abierto' | 'cerrado';
  estadoNuevo: 'abierto' | 'cerrado';
  mensaje: string;
  fechaActualizacion: string;
}
