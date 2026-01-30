/**
 * API Endpoints - Clean Architecture
 * 
 * Wrappers simplificados alrededor de la API consolidada.
 * Mantiene las mismas firmas de funciones para compatibilidad con componentes existentes.
 */

import { apiClient } from './apiClient';
import { consolidatedApi } from './consolidatedClient';
import {
  VALID_INVENTORY_LOCATIONS,
  PALLET_CODE_LENGTH,
  CART_CODE_LENGTH,
} from './inventoryConstants';
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
 * Gets information from a scanned code (box or pallet)
 */
export const getInfoFromScannedCode = async (
  request: GetInfoFromScannedCodeRequest
): Promise<ApiResponse<ScannedCodeInfo>> => {
  const validation = validateScannedCode(request.codigo);

  if (!validation.isValid) {
    throw new apiClient.ApiClientError(
      validation.errorMessage || 'Código inválido',
      'VALIDATION_ERROR'
    );
  }

  // Mock mode for development
  const shouldUseMockMode = import.meta.env.VITE_USE_MOCK_API === 'true';

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

  // Use consolidated API
  const resource = validation.type === 'box' ? 'box' : 'pallet';
  const response = await consolidatedApi.inventory[resource].get({
    codigo: request.codigo.trim(),
  });

  return response as ApiResponse<ScannedCodeInfo>;
};

/**
 * Posts an issue report
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

  const shouldUseMockMode = import.meta.env.VITE_USE_MOCK_API === 'true';

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

  const response = await consolidatedApi.admin.issue.create({
    descripcion: request.descripcion.trim(),
  });

  return response as ApiResponse<IssueReportResult>;
};

/**
 * Register a new box
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

  const params: CreateBoxParams = {
    codigo: request.codigo.trim(),
    calibre: '01', // Default
    formato: '1',  // Default
    empresa: '1',  // Default
    ubicacion: request.ubicacion || 'PACKING',
    operario: request.producto.trim(),
  };

  const response = await consolidatedApi.inventory.box.create(params);

  // Adapt response
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
};

/**
 * Process a scan (box or pallet)
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
  const resource = tipo === 'BOX' ? 'box' : 'pallet';
  
  // Special case: if customInfo is provided, this is a custom box creation
  // We need to create the box first, then assign it to a single-box pallet
  if (request.customInfo && Array.isArray(request.customInfo) && request.customInfo.length > 0) {
    console.log('🎨 Creating custom box with customInfo:', request.customInfo);
    
    // Parse box code to get calibre, formato, empresa
    const codigo = request.codigo.trim();
    
    // Create the box first
    const createParams: CreateBoxParams = {
      codigo,
      calibre: codigo.substr(9, 2),
      formato: codigo.substr(11, 1),
      empresa: codigo.substr(12, 1),
      ubicacion: request.ubicacion,
      customInfo: JSON.stringify(request.customInfo),
    };
    
    const createResponse = await consolidatedApi.inventory.box.create(createParams);
    
    if (!createResponse.success) {
      // If creation fails because box already exists, try to move it instead
      if (createResponse.error?.includes('already exists')) {
        const moveResponse = await consolidatedApi.inventory.box.move({
          codigo: request.codigo.trim(),
          ubicacion: request.ubicacion,
        });
        return moveResponse as any;
      }
      return createResponse as any;
    }
    
    return {
      success: true,
      data: {
        success: true,
        message: 'Caja personalizada creada exitosamente',
        data: {
          codigo: request.codigo.trim(),
          tipo: 'BOX' as const,
          ubicacion: request.ubicacion,
          estado: 'activo',
          timestamp: new Date().toISOString(),
          customInfo: request.customInfo,
        },
      },
      message: 'Caja personalizada creada exitosamente',
    };
  }
  
  // Normal flow: move existing box/pallet
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
};

/**
 * Creates a new pallet
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

  const params: CreatePalletParams = {
    codigo: base,
    maxBoxes,
  };

  const response = await consolidatedApi.inventory.pallet.create(params);
  return response;
};

/**
 * Toggle pallet status (open/closed)
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
};

/**
 * Validates codigo and ubicacion for move operations. Throws ApiClientError on failure.
 */
function validateMoveToLocation(
  codigo: string,
  ubicacion: string,
  validLocations: readonly string[],
  codeLength: number,
  resourceLabel: string
): void {
  const cleanCode = codigo.trim();
  const regex = new RegExp(`^\\d{${codeLength}}$`);
  if (!regex.test(cleanCode)) {
    throw new apiClient.ApiClientError(
      `El código debe ser un código de ${resourceLabel} válido (${codeLength} dígitos)`,
      'VALIDATION_ERROR'
    );
  }
  if (!validLocations.includes(ubicacion)) {
    throw new apiClient.ApiClientError(
      'Ubicación inválida',
      'VALIDATION_ERROR'
    );
  }
}

/**
 * Move a pallet to a new location
 */
export const movePallet = async (
  request: MovePalletRequest
): Promise<ApiResponse<MovePalletResult>> => {
  validateMoveToLocation(
    request.codigo,
    request.ubicacion,
    VALID_INVENTORY_LOCATIONS,
    PALLET_CODE_LENGTH,
    'pallet'
  );

  const codigo = request.codigo.trim();
  const response = await consolidatedApi.inventory.pallet.move({
    codigo,
    ubicacion: request.ubicacion,
  });

  if (response.success) {
    return {
      success: true,
      data: {
        success: true,
        message: response.message || 'Pallet movido exitosamente',
        data: {
          codigo,
          ubicacion: request.ubicacion,
          estado: 'activo',
          timestamp: new Date().toISOString(),
        },
      },
      message: response.message,
    };
  }

  return response as ApiResponse<MovePalletResult>;
};

/**
 * Get a paginated list of active pallets
 */
export const getActivePallets = async (
  params: GetActivePalletsParams = { ubicacion: 'PACKING', limit: 50 }
): Promise<ApiResponse<GetActivePalletsResult>> => {
  const { ubicacion = 'PACKING', limit = 50, lastKey, lastEvaluatedKey } = params;

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
};

/**
 * Close a pallet by its code
 */
export const closePallet = async (
  codigo: string
): Promise<ApiResponse<ClosePalletResult>> => {
  const clean = (codigo || '').trim();
  if (!/^[0-9]{13,14}$/.test(clean)) {
    console.warn('closePallet: código con formato inusual');
  }

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
};

/**
 * Simplified wrapper functions
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

/**
 * Create a custom box with customInfo (list of [codigo, cantidad de huevos]).
 * Backend creates a single-box pallet for it. Does not send calibre/formato/empresa.
 */
export const createCustomBox = async (
  codigo: string,
  customInfo: Array<[string, number]>,
  ubicacion?: string
): Promise<ApiResponse<RegisterBoxResult>> => {
  const cleanCode = (codigo || '').trim();

  const validation = validateScannedCode(cleanCode);
  if (!validation.isValid || validation.type !== 'box') {
    throw new apiClient.ApiClientError(
      'El código debe ser de caja (16 dígitos)',
      'VALIDATION_ERROR'
    );
  }

  if (!Array.isArray(customInfo) || customInfo.length === 0) {
    throw new apiClient.ApiClientError(
      'Debe haber al menos una línea con código y cantidad',
      'VALIDATION_ERROR'
    );
  }

  for (let i = 0; i < customInfo.length; i++) {
    const [code, qty] = customInfo[i];
    if (typeof code !== 'string' || !code.trim()) {
      throw new apiClient.ApiClientError(
        `Línea ${i + 1}: el código no puede estar vacío`,
        'VALIDATION_ERROR'
      );
    }
    const num = Number(qty);
    if (Number.isNaN(num) || num < 0) {
      throw new apiClient.ApiClientError(
        `Línea ${i + 1}: la cantidad debe ser un número >= 0`,
        'VALIDATION_ERROR'
      );
    }
  }

  const params: CreateBoxParams = {
    codigo: cleanCode,
    ubicacion: ubicacion || 'PACKING',
    customInfo: JSON.stringify(customInfo),
  };

  const response = await consolidatedApi.inventory.box.create(params);

  if (response.success && response.data) {
    return {
      success: true,
      data: {
        id: (response.data as any).codigo || `BOX-${Date.now()}`,
        codigo: cleanCode,
        mensaje: response.message || 'Caja custom creada exitosamente',
        fechaRegistro: new Date().toISOString(),
        estado: 'registrado',
      },
      message: response.message,
    };
  }

  return response as ApiResponse<RegisterBoxResult>;
};

export const submitCreateCustomBox = async (
  codigo: string,
  customInfo: Array<[string, number]>,
  ubicacion?: string
): Promise<RegisterBoxResult> => {
  const response = await createCustomBox(codigo, customInfo, ubicacion);

  if (!response.success || !response.data) {
    throw new apiClient.ApiClientError(
      response.error || 'No se pudo crear la caja custom',
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
 * Move a cart to a new location
 */
export const moveCart = async (
  codigo: string,
  ubicacion: string,
  userId?: string
): Promise<ApiResponse<MovePalletResult>> => {
  const cleanCode = (codigo || '').trim();
  validateMoveToLocation(
    cleanCode,
    ubicacion,
    VALID_INVENTORY_LOCATIONS,
    CART_CODE_LENGTH,
    'carro'
  );

  const params = {
    codigo: cleanCode,
    ubicacion,
    ...(userId && { userId }),
  };
  const response = await consolidatedApi.inventory.cart.move(params);

  if (response.success) {
    return {
      success: true,
      data: {
        success: true,
        message: response.message || 'Carro movido exitosamente',
        data: {
          codigo: cleanCode,
          ubicacion,
          estado: 'activo',
          timestamp: new Date().toISOString(),
        },
      },
      message: response.message,
    };
  }

  return response as ApiResponse<MovePalletResult>;
};

export const submitMoveCart = async (
  codigo: string,
  ubicacion: string = 'TRANSITO',
  userId?: string
): Promise<MovePalletResult> => {
  const response = await moveCart(codigo, ubicacion, userId);

  if (!response.success || !response.data) {
    throw new apiClient.ApiClientError(
      response.error || 'No se pudo mover el carro',
      'NO_DATA'
    );
  }

  return response.data;
};

/**
 * Endpoints object for easy access
 */
export const endpoints = {
  getInfoFromScannedCode,
  postIssue,
  submitIssueReport,
  registerBox,
  submitBoxRegistration,
  createCustomBox,
  submitCreateCustomBox,
  processScan,
  submitScan,
  createPallet,
  togglePalletStatus,
  submitPalletStatusToggle,
  movePallet,
  submitMovePallet,
  moveCart,
  submitMoveCart,
} as const;

/**
 * Pallets helpers
 */
export const pallets = {
  getActivePallets,
  closePallet,
};

