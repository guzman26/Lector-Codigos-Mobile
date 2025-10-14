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
  /**
   * Some components rely on a lowercase `tipo` field (e.g. 'caja' | 'pallet').
   * It is marked optional to keep backward-compatibility with pkTipo.
   */
  tipo?: 'caja' | 'pallet' | 'BOX' | 'PALLET';
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
  // Opcional: timestamps adicionales (historial eliminado)
  fechaCreacion?: string;
  ultimaActualizacion?: string;
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

/**
 * Move Pallet Request
 */
export interface MovePalletRequest {
  codigo: string; // 13-digit pallet code
  ubicacion: string; // Nueva ubicación (ej. TRANSITO)
}

/**
 * Move Pallet Response
 */
export interface MovePalletResult {
  success: boolean;
  message: string;
  data?: {
    codigo: string;
    ubicacion: string;
    estado: string;
    timestamp: string;
    [key: string]: any;
  };
}

/**
 * Get Active Pallets - Query params
 */
export interface GetActivePalletsParams {
  ubicacion?: string; // e.g., PACKING
  limit?: number; // page size
  lastKey?: string; // pagination token (preferred)
  lastEvaluatedKey?: string; // legacy alias supported by backend
}

/**
 * Active Pallet item (minimal, flexible shape)
 */
export interface ActivePallet {
  codigo: string; // 14-digit pallet code per backend
  estado?: 'open' | 'closed' | string;
  ubicacion?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

/**
 * Get Active Pallets - Response
 */
export interface GetActivePalletsResult {
  items: ActivePallet[];
  lastKey?: string; // preferred
  lastEvaluatedKey?: string; // legacy alias
}

/**
 * Close Pallet response (minimal)
 */
export interface ClosePalletResult {
  codigo: string;
  estadoAnterior?: string;
  estadoNuevo?: string;
  mensaje?: string;
  fechaActualizacion?: string;
}

/**
 * ===================================================================
 * NEW CLEAN ARCHITECTURE TYPES
 * ===================================================================
 */

/**
 * Consolidated API Request format for Clean Architecture backend
 */
export interface ConsolidatedApiRequest<P = any> {
  resource: string; // e.g., 'box', 'pallet', 'order', 'customer', 'issue'
  action: string; // e.g., 'get', 'create', 'update', 'delete', 'move', 'close'
  params: P;
}

/**
 * Standardized API Response from Clean Architecture backend
 */
export interface StandardApiResponse<T = any> {
  status: 'success' | 'fail' | 'error';
  message: string;
  data?: T;
  meta: {
    requestId: string;
    timestamp: string;
    [key: string]: any;
  };
}

/**
 * Pagination parameters for list queries
 */
export interface PaginationParams {
  limit?: number;
  lastKey?: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  count: number;
  nextKey?: string | null;
}

/**
 * Filter options for queries
 */
export interface FilterParams {
  calibre?: string;
  formato?: string;
  empresa?: string;
  horario?: string;
  codigoPrefix?: string;
  [key: string]: any;
}

/**
 * ===================================================================
 * INVENTORY RESOURCE TYPES
 * ===================================================================
 */

/**
 * Box resource - Get action params
 */
export interface GetBoxesParams {
  ubicacion?: 'PACKING' | 'BODEGA' | 'TRANSITO' | 'PREVENTA' | 'VENTA' | 'UNSUBSCRIBED';
  filters?: FilterParams;
  pagination?: PaginationParams;
  codigo?: string; // For getting single box by code
}

/**
 * Box resource - Create action params
 */
export interface CreateBoxParams {
  codigo: string;
  calibre: string;
  formato: string;
  empresa: string;
  ubicacion: string;
  operario?: string;
  horario?: string;
  customInfo?: string;
}

/**
 * Box resource - Assign action params
 */
export interface AssignBoxParams {
  boxCode: string;
  palletCode: string;
}

/**
 * Box resource - Move action params
 */
export interface MoveBoxParams {
  codigo: string;
  ubicacion: string;
}

/**
 * Pallet resource - Get action params
 */
export interface GetPalletsParams {
  estado?: 'open' | 'closed' | 'dismantled';
  ubicacion?: string;
  pagination?: PaginationParams;
  codigo?: string; // For getting single pallet by code
}

/**
 * Pallet resource - Create action params
 */
export interface CreatePalletParams {
  codigo: string; // Base code (11 digits)
  ubicacion?: string;
  maxBoxes?: number;
  calibre?: string;
  formato?: string;
  empresa?: string;
}

/**
 * Pallet resource - Close action params
 */
export interface ClosePalletParams {
  codigo: string;
}

/**
 * Pallet resource - Move action params
 */
export interface MovePalletParams {
  codigo: string;
  ubicacion: string;
}

/**
 * ===================================================================
 * SALES RESOURCE TYPES
 * ===================================================================
 */

/**
 * Order resource - Get action params
 */
export interface GetOrdersParams {
  filters?: {
    state?: 'DRAFT' | 'CONFIRMED' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED';
    customerId?: string;
    startDate?: string;
    endDate?: string;
  };
  pagination?: PaginationParams;
  id?: string; // For getting single order by ID
}

/**
 * Order resource - Create action params
 */
export interface CreateOrderParams {
  customerId: string;
  type: 'Venta' | 'Reposición' | 'Donación' | 'Inutilizado' | 'Ración';
  items: Array<{ palletCode: string }>;
  notes?: string;
  metadata?: Record<string, any>;
}

/**
 * Customer resource - Get action params
 */
export interface GetCustomersParams {
  filters?: {
    status?: 'ACTIVE' | 'INACTIVE' | 'DELETED';
    search?: string;
  };
  pagination?: PaginationParams;
  id?: string; // For getting single customer by ID
}

/**
 * Customer resource - Create action params
 */
export interface CreateCustomerParams {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  contactPerson?: string;
  metadata?: Record<string, any>;
}

/**
 * ===================================================================
 * ADMIN RESOURCE TYPES
 * ===================================================================
 */

/**
 * Issue resource - Get action params
 */
export interface GetIssuesParams {
  filters?: {
    status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
    ubicacion?: string;
    startDate?: string;
    endDate?: string;
  };
  pagination?: PaginationParams;
  id?: string; // For getting single issue by ID
}

/**
 * Issue resource - Create action params
 */
export interface CreateIssueParams {
  descripcion: string;
  boxCode?: string;
  type?: 'DEFECT' | 'DAMAGE' | 'OTHER';
  ubicacion?: string;
}

/**
 * Issue resource - Update action params
 */
export interface UpdateIssueParams {
  issueId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  resolution?: string;
}

/**
 * Report resource - Generate action params
 */
export interface GenerateReportParams {
  type: 'inventory' | 'sales' | 'audit' | 'daily-production';
  filters?: {
    startDate?: string;
    endDate?: string;
    ubicacion?: string;
    date?: string;
  };
  format?: 'excel' | 'json';
}
