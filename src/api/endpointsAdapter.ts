/**
 * Backward-Compatible Endpoints Adapter
 * 
 * This file provides backward-compatible wrappers around the new consolidated API.
 * It maintains the same function signatures as the original endpoints while using
 * the new Clean Architecture backend.
 */

import { apiClient } from './apiClient';
import { consolidatedApi } from './consolidatedClient';
import {
  validateScannedCode,
  validateIssueDescription,
} from '../utils/validators';
import type {
  GetInfoFromScannedCodeRequest,
  ScannedCodeInfo,
  PostIssueRequest,
  IssueReportResult,
  RegisterBoxRequest,
  RegisterBoxResult,
  ProcessScanRequest,
  ProcessScanResult,
  TogglePalletStatusRequest,
  TogglePalletStatusResult,
  ApiResponse,
  MovePalletRequest,
  MovePalletResult,
  GetActivePalletsParams,
  GetActivePalletsResult,
  ClosePalletResult,
  CreateBoxParams,
  CreatePalletParams,
  GetPalletsParams,
} from './types';

/**
 * Configuration flag to enable/disable new consolidated API
 * Set to true to use the new Clean Architecture endpoints
 * Set to false to use legacy endpoints (for gradual migration)
 */
const USE_CONSOLIDATED_API = import.meta.env.VITE_USE_CONSOLIDATED_API === 'true';

/**
 * Gets information from a scanned code (box or pallet)
 * UPDATED: Now uses consolidated /inventory endpoint
 */
export const getInfoFromScannedCode = async (
  request: GetInfoFromScannedCodeRequest
): Promise<ApiResponse<ScannedCodeInfo>> => {
  // Client-side validation
  const validation = validateScannedCode(request.codigo);

  if (!validation.isValid) {
    throw new apiClient.ApiClientError(
      validation.errorMessage || 'Código inválido',
      'VALIDATION_ERROR'
    );
  }

  // Development mode mock (if enabled)
  const shouldUseMockMode =
    import.meta.env.DEV &&
    (!import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_API_URL.includes('localhost') ||
      import.meta.env.VITE_USE_MOCK_API === 'true');

  if (shouldUseMockMode) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockResponse: ScannedCodeInfo = {
      codigo: request.codigo.trim(),
      pkTipo: validation.type === 'box' ? 'BOX' : 'PALLET',
      tipo: validation.type === 'box' ? 'caja' : 'pallet',
      producto: {
        id: 'PROD-001',
        nombre: 'Huevos Frescos',
        descripcion: 'Huevos de gallina frescos',
      },
      ubicacion: {
        almacen: 'Almacén Principal',
        zona: 'Zona A',
        posicion: 'A1-B2-C3',
      },
      estado: 'activo',
      timestamp: new Date().toISOString(),
      scannedAt: new Date().toISOString(),
      fecha_registro: new Date().toISOString(),
      contador: Math.floor(Math.random() * 300) + 100 + '',
      operario: 'Operario Demo',
      empacadora: 'Empacadora 1',
      formato_caja: '30 Huevos',
      fechaCreacion: new Date().toISOString(),
      ultimaActualizacion: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockResponse,
      message: 'Información obtenida exitosamente (modo desarrollo)',
    };
  }

  // Use new consolidated API
  if (USE_CONSOLIDATED_API) {
    try {
      const resource = validation.type === 'box' ? 'box' : 'pallet';
      const response = await consolidatedApi.inventory[resource].get({
        codigo: request.codigo.trim(),
      });

      return response as ApiResponse<ScannedCodeInfo>;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('🔄 Consolidated API failed, falling back to mock');
        return getInfoFromScannedCode(request); // Recursive call will hit mock mode
      }
      throw error;
    }
  }

  // Legacy endpoint fallback
  try {
    const response = await apiClient.get<ScannedCodeInfo>(
      '/getInfoFromScannedCode',
      { codigo: request.codigo.trim() }
    );

    return response;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('🔄 Legacy API failed, falling back to mock');
      return getInfoFromScannedCode(request);
    }
    throw error;
  }
};

/**
 * Posts an issue report
 * UPDATED: Now uses consolidated /admin endpoint
 */
export const postIssue = async (
  request: PostIssueRequest
): Promise<ApiResponse<IssueReportResult>> => {
  const validation = validateIssueDescription(request.descripcion);

  if (!validation.isValid) {
    throw new apiClient.ApiClientError(
      validation.errorMessage || 'Descripción inválida',
      'VALIDATION_ERROR'
    );
  }

  const shouldUseMockMode =
    import.meta.env.DEV &&
    (!import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_API_URL.includes('localhost') ||
      import.meta.env.VITE_USE_MOCK_API === 'true');

  if (shouldUseMockMode) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      success: true,
      data: {
        id: `RPT-${Date.now()}`,
        mensaje: 'Reporte recibido exitosamente (modo desarrollo)',
        fechaReporte: new Date().toISOString(),
        estado: 'recibido',
      },
      message: 'Reporte enviado correctamente',
    };
  }

  // Use new consolidated API
  if (USE_CONSOLIDATED_API) {
    try {
      const response = await consolidatedApi.admin.issue.create({
        descripcion: request.descripcion.trim(),
      });

      return response as ApiResponse<IssueReportResult>;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('🔄 Consolidated API failed, falling back to mock');
        return postIssue(request);
      }
      throw error;
    }
  }

  // Legacy endpoint fallback
  try {
    const response = await apiClient.post<IssueReportResult>('/postIssue', {
      descripcion: request.descripcion.trim(),
    });

    return response;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('🔄 Legacy API failed, falling back to mock');
      return postIssue(request);
    }
    throw error;
  }
};

/**
 * Register a new box
 * UPDATED: Now uses consolidated /inventory endpoint
 */
export const registerBox = async (
  request: RegisterBoxRequest
): Promise<ApiResponse<RegisterBoxResult>> => {
  const validation = validateScannedCode(request.codigo);

  if (!validation.isValid || validation.type !== 'box') {
    throw new apiClient.ApiClientError(
      'El código debe ser de una caja (16 dígitos)',
      'VALIDATION_ERROR'
    );
  }

  if (!request.producto?.trim()) {
    throw new apiClient.ApiClientError(
      'El producto es obligatorio',
      'VALIDATION_ERROR'
    );
  }

  // Use new consolidated API
  if (USE_CONSOLIDATED_API) {
    try {
      const params: CreateBoxParams = {
        codigo: request.codigo.trim(),
        calibre: '01', // Default or extracted from request
        formato: '1', // Default or extracted from request
        empresa: '1', // Default or extracted from request
        ubicacion: request.ubicacion || 'PACKING',
        operario: request.producto.trim(),
      };

      const response = await consolidatedApi.inventory.box.create(params);

      // Adapt response to match RegisterBoxResult
      if (response.success && response.data) {
        return {
          success: true,
          data: {
            id: (response.data as any).codigo || `BOX-${Date.now()}`,
            codigo: request.codigo.trim(),
            mensaje: response.message || 'Caja registrada exitosamente',
            fechaRegistro: new Date().toISOString(),
            estado: 'registrado',
          },
          message: response.message,
        };
      }

      return response as ApiResponse<RegisterBoxResult>;
    } catch (error) {
      if (error instanceof apiClient.ApiClientError) {
        throw error;
      }
      throw new apiClient.ApiClientError(
        'Error al registrar la caja',
        'REQUEST_FAILED',
        error
      );
    }
  }

  // Legacy endpoint fallback
  try {
    const response = await apiClient.post<RegisterBoxResult>('/registerBox', {
      codigo: request.codigo.trim(),
      producto: request.producto.trim(),
      lote: request.lote?.trim(),
      fechaVencimiento: request.fechaVencimiento,
      ubicacion: request.ubicacion,
      observaciones: request.observaciones?.trim(),
    });

    return response;
  } catch (error) {
    if (error instanceof apiClient.ApiClientError) {
      throw error;
    }
    throw new apiClient.ApiClientError(
      'Error al registrar la caja',
      'REQUEST_FAILED',
      error
    );
  }
};

/**
 * Process a scan (box or pallet)
 * UPDATED: Now uses consolidated /inventory endpoint
 */
export const processScan = async (
  request: ProcessScanRequest
): Promise<ApiResponse<ProcessScanResult>> => {
  const validation = validateScannedCode(request.codigo);

  if (!validation.isValid) {
    throw new apiClient.ApiClientError(
      validation.errorMessage || 'Código inválido',
      'VALIDATION_ERROR'
    );
  }

  const validLocations = ['PACKING', 'BODEGA', 'VENTA', 'TRANSITO'];
  if (!validLocations.includes(request.ubicacion)) {
    throw new apiClient.ApiClientError(
      'Ubicación inválida',
      'VALIDATION_ERROR'
    );
  }

  const tipo = request.tipo || (validation.type === 'box' ? 'BOX' : 'PALLET');

  // Use new consolidated API
  if (USE_CONSOLIDATED_API) {
    try {
      const resource = tipo === 'BOX' ? 'box' : 'pallet';
      const response = await consolidatedApi.inventory[resource].move({
        codigo: request.codigo.trim(),
        ubicacion: request.ubicacion,
      });

      // Adapt response
      if (response.success) {
        return {
          success: true,
          data: {
            success: true,
            message: response.message || 'Procesado exitosamente',
            data: {
              codigo: request.codigo.trim(),
              tipo: tipo as 'BOX' | 'PALLET',
              ubicacion: request.ubicacion,
              estado: 'activo',
              timestamp: new Date().toISOString(),
            },
          },
          message: response.message,
        };
      }

      return response as ApiResponse<ProcessScanResult>;
    } catch (error) {
      if (error instanceof apiClient.ApiClientError) {
        throw error;
      }
      throw new apiClient.ApiClientError(
        'Error al procesar el escaneo',
        'REQUEST_FAILED',
        error
      );
    }
  }

  // Legacy endpoint fallback
  try {
    const response = await apiClient.post<ProcessScanResult>(
      '/procesar-escaneo',
      {
        codigo: request.codigo.trim(),
        ubicacion: request.ubicacion,
        tipo,
        palletCodigo: request.palletCodigo,
        scannedCodes: request.scannedCodes,
        customInfo: request.customInfo,
      }
    );

    return response;
  } catch (error) {
    if (error instanceof apiClient.ApiClientError) {
      throw error;
    }
    throw new apiClient.ApiClientError(
      'Error al procesar el escaneo',
      'REQUEST_FAILED',
      error
    );
  }
};

/**
 * Creates a new pallet
 * UPDATED: Now uses consolidated /inventory endpoint
 */
export const createPallet = async (
  codigo: string,
  maxBoxes?: number
): Promise<ApiResponse<any>> => {
  const base = (codigo || '').trim();
  if (!/^\d{11}$/.test(base)) {
    throw new apiClient.ApiClientError(
      'El código base debe tener 11 dígitos',
      'VALIDATION_ERROR'
    );
  }

  // Use new consolidated API
  if (USE_CONSOLIDATED_API) {
    try {
      const params: CreatePalletParams = {
        codigo: base,
        maxBoxes,
      };

      const response = await consolidatedApi.inventory.pallet.create(params);
      return response;
    } catch (error) {
      if (error instanceof apiClient.ApiClientError) {
        throw error;
      }
      throw new apiClient.ApiClientError(
        'Error al crear el pallet',
        'REQUEST_FAILED',
        error
      );
    }
  }

  // Legacy endpoint fallback
  try {
    const body: any = { codigo: base };
    if (maxBoxes !== undefined) {
      body.maxBoxes = maxBoxes;
    }
    const response = await apiClient.post<any>('/createPallet', body);
    return response;
  } catch (error) {
    if (error instanceof apiClient.ApiClientError) {
      throw error;
    }
    throw new apiClient.ApiClientError(
      'Error al crear el pallet',
      'REQUEST_FAILED',
      error
    );
  }
};

/**
 * Toggle pallet status (open/closed)
 * UPDATED: Now uses consolidated /inventory endpoint
 */
export const togglePalletStatus = async (
  request: TogglePalletStatusRequest
): Promise<ApiResponse<TogglePalletStatusResult>> => {
  const validation = validateScannedCode(request.codigo);

  if (!validation.isValid || validation.type !== 'pallet') {
    throw new apiClient.ApiClientError(
      'El código debe ser un código de pallet válido',
      'VALIDATION_ERROR'
    );
  }

  // Use new consolidated API
  if (USE_CONSOLIDATED_API) {
    try {
      const response = await consolidatedApi.inventory.pallet.close({
        codigo: request.codigo.trim(),
      });

      // Adapt response
      if (response.success && response.data) {
        const data = response.data as any;
        return {
          success: true,
          data: {
            codigo: request.codigo.trim(),
            estadoAnterior: data.estadoAnterior || 'abierto',
            estadoNuevo: data.estadoNuevo || 'cerrado',
            mensaje: response.message || 'Estado actualizado',
            fechaActualizacion: new Date().toISOString(),
          },
          message: response.message,
        };
      }

      return response as ApiResponse<TogglePalletStatusResult>;
    } catch (error) {
      if (error instanceof apiClient.ApiClientError) {
        throw error;
      }
      throw new apiClient.ApiClientError(
        'Error al cambiar el estado del pallet',
        'REQUEST_FAILED',
        error
      );
    }
  }

  // Legacy endpoint fallback
  try {
    const response = await apiClient.post<TogglePalletStatusResult>(
      '/closePallet',
      { codigo: request.codigo.trim() }
    );
    return response;
  } catch (error) {
    if (error instanceof apiClient.ApiClientError) {
      throw error;
    }
    throw new apiClient.ApiClientError(
      'Error al cambiar el estado del pallet',
      'REQUEST_FAILED',
      error
    );
  }
};

/**
 * Move a pallet to a new location
 * UPDATED: Now uses consolidated /inventory endpoint
 */
export const movePallet = async (
  request: MovePalletRequest
): Promise<ApiResponse<MovePalletResult>> => {
  const validation = validateScannedCode(request.codigo);

  if (!validation.isValid || validation.type !== 'pallet') {
    throw new apiClient.ApiClientError(
      'El código debe ser un código de pallet válido (14 dígitos)',
      'VALIDATION_ERROR'
    );
  }

  const validLocations = ['PACKING', 'TRANSITO', 'BODEGA', 'PREVENTA', 'VENTA'];
  if (!validLocations.includes(request.ubicacion)) {
    throw new apiClient.ApiClientError(
      'Ubicación inválida',
      'VALIDATION_ERROR'
    );
  }

  // Use new consolidated API
  if (USE_CONSOLIDATED_API) {
    try {
      const response = await consolidatedApi.inventory.pallet.move({
        codigo: request.codigo.trim(),
        ubicacion: request.ubicacion,
      });

      // Adapt response
      if (response.success) {
        return {
          success: true,
          data: {
            success: true,
            message: response.message || 'Pallet movido exitosamente',
            data: {
              codigo: request.codigo.trim(),
              ubicacion: request.ubicacion,
              estado: 'activo',
              timestamp: new Date().toISOString(),
            },
          },
          message: response.message,
        };
      }

      return response as ApiResponse<MovePalletResult>;
    } catch (error) {
      if (error instanceof apiClient.ApiClientError) {
        throw error;
      }
      throw new apiClient.ApiClientError(
        'Error al mover el pallet',
        'REQUEST_FAILED',
        error
      );
    }
  }

  // Legacy endpoint fallback
  try {
    const response = await apiClient.post<MovePalletResult>('/movePallet', {
      codigo: request.codigo.trim(),
      ubicacion: request.ubicacion,
    });
    return response;
  } catch (error) {
    if (error instanceof apiClient.ApiClientError) {
      throw error;
    }
    throw new apiClient.ApiClientError(
      'Error al mover el pallet',
      'REQUEST_FAILED',
      error
    );
  }
};

/**
 * Get a paginated list of active pallets
 * UPDATED: Now uses consolidated /inventory endpoint
 */
export const getActivePallets = async (
  params: GetActivePalletsParams = { ubicacion: 'PACKING', limit: 50 }
): Promise<ApiResponse<GetActivePalletsResult>> => {
  const { ubicacion = 'PACKING', limit = 50, lastKey, lastEvaluatedKey } = params;

  // Use new consolidated API
  if (USE_CONSOLIDATED_API) {
    try {
      const queryParams: GetPalletsParams = {
        estado: 'open',
        ubicacion,
        pagination: {
          limit,
          lastKey: lastKey || lastEvaluatedKey,
        },
      };

      const response = await consolidatedApi.inventory.pallet.get(queryParams);

      // Adapt response
      if (response.success && response.data) {
        const data = response.data as any;
        return {
          success: true,
          data: {
            items: data.items || [],
            lastKey: data.nextKey,
            lastEvaluatedKey: data.nextKey,
          },
          message: response.message,
        };
      }

      return response as ApiResponse<GetActivePalletsResult>;
    } catch (error) {
      if (error instanceof apiClient.ApiClientError) {
        throw error;
      }
      throw new apiClient.ApiClientError(
        'Error al obtener pallets activos',
        'REQUEST_FAILED',
        error
      );
    }
  }

  // Legacy endpoint fallback
  try {
    const response = await apiClient.get<GetActivePalletsResult>(
      '/getActivePallets',
      {
        ubicacion,
        limit,
        ...(lastKey ? { lastKey } : {}),
        ...(lastEvaluatedKey ? { lastEvaluatedKey } : {}),
      }
    );
    return response;
  } catch (error) {
    if (error instanceof apiClient.ApiClientError) {
      throw error;
    }
    throw new apiClient.ApiClientError(
      'Error al obtener pallets activos',
      'REQUEST_FAILED',
      error
    );
  }
};

/**
 * Close a pallet by its code
 * UPDATED: Now uses consolidated /inventory endpoint
 */
export const closePallet = async (
  codigo: string
): Promise<ApiResponse<ClosePalletResult>> => {
  const clean = (codigo || '').trim();
  if (!/^[0-9]{13,14}$/.test(clean)) {
    console.warn('closePallet: código con formato inusual');
  }

  // Use new consolidated API
  if (USE_CONSOLIDATED_API) {
    try {
      const response = await consolidatedApi.inventory.pallet.close({
        codigo: clean,
      });

      // Adapt response
      if (response.success && response.data) {
        const data = response.data as any;
        return {
          success: true,
          data: {
            codigo: clean,
            estadoAnterior: data.estadoAnterior || 'open',
            estadoNuevo: data.estadoNuevo || 'closed',
            mensaje: response.message,
            fechaActualizacion: new Date().toISOString(),
          },
          message: response.message,
        };
      }

      return response as ApiResponse<ClosePalletResult>;
    } catch (error) {
      if (error instanceof apiClient.ApiClientError) {
        throw error;
      }
      throw new apiClient.ApiClientError(
        'Error al cerrar el pallet',
        'REQUEST_FAILED',
        error
      );
    }
  }

  // Legacy endpoint fallback
  try {
    const response = await apiClient.post<ClosePalletResult>('/closePallet', {
      codigo: clean,
    });
    return response;
  } catch (error) {
    if (error instanceof apiClient.ApiClientError) {
      throw error;
    }
    throw new apiClient.ApiClientError(
      'Error al cerrar el pallet',
      'REQUEST_FAILED',
      error
    );
  }
};

/**
 * Simplified wrapper functions for easier use in components
 */
export const submitIssueReport = async (
  descripcion: string
): Promise<IssueReportResult> => {
  const response = await postIssue({ descripcion });

  if (!response.success || !response.data) {
    throw new apiClient.ApiClientError(
      response.error || 'No se pudo enviar el reporte',
      'NO_DATA'
    );
  }

  return response.data;
};

export const submitBoxRegistration = async (
  boxData: RegisterBoxRequest
): Promise<RegisterBoxResult> => {
  const response = await registerBox(boxData);

  if (!response.success || !response.data) {
    throw new apiClient.ApiClientError(
      response.error || 'No se pudo registrar la caja',
      'NO_DATA'
    );
  }

  return response.data;
};

export const submitScan = async (
  scanData: ProcessScanRequest
): Promise<ProcessScanResult> => {
  const response = await processScan(scanData);

  if (!response.success || !response.data) {
    throw new apiClient.ApiClientError(
      response.error || 'No se pudo procesar el escaneo',
      'NO_DATA'
    );
  }

  return response.data;
};

export const submitPalletStatusToggle = async (
  codigo: string
): Promise<TogglePalletStatusResult> => {
  const response = await togglePalletStatus({ codigo });

  if (!response.success || !response.data) {
    throw new apiClient.ApiClientError(
      response.error || 'No se pudo cambiar el estado del pallet',
      'NO_DATA'
    );
  }

  return response.data;
};

export const submitMovePallet = async (
  codigo: string,
  ubicacion: string = 'TRANSITO'
): Promise<MovePalletResult> => {
  const response = await movePallet({ codigo, ubicacion });

  if (!response.success || !response.data) {
    throw new apiClient.ApiClientError(
      response.error || 'No se pudo mover el pallet',
      'NO_DATA'
    );
  }

  return response.data;
};

/**
 * Endpoints object for easy access (backward compatible)
 */
export const endpoints = {
  getInfoFromScannedCode,
  postIssue,
  submitIssueReport,
  registerBox,
  submitBoxRegistration,
  processScan,
  submitScan,
  createPallet,
  togglePalletStatus,
  submitPalletStatusToggle,
  movePallet,
  submitMovePallet,
} as const;

/**
 * Pallets helpers
 */
export const pallets = {
  getActivePallets,
  closePallet,
};

