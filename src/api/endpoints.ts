import { apiClient } from './apiClient';
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
} from './types';

/**
 * Gets information from a scanned code
 * Validates the code before making the request
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

  // Development mode: simulate API response (also used as fallback if real API fails)
  const shouldUseMockMode =
    import.meta.env.DEV &&
    (!import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_API_URL.includes('localhost') ||
      import.meta.env.VITE_USE_MOCK_API === 'true');

  if (shouldUseMockMode) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock response for scanned code info
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
      contador: Math.floor(Math.random() * 300) + 100 + '', // Random egg count between 100-400
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

  // Make the API request
  try {
    const response = await apiClient.get<ScannedCodeInfo>(
      '/getInfoFromScannedCode',
      { codigo: request.codigo.trim() }
    );

    return response;
  } catch (error) {
    console.error('❌ Get info from scanned code request failed:', error);

    // In development, if the real API fails, fall back to mock mode
    if (import.meta.env.DEV) {
      console.warn('🔄 Falling back to mock mode due to API failure');

      const fallbackResponse: ScannedCodeInfo = {
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
        contador: '150', // Default egg count
        operario: 'Operario Demo',
        empacadora: 'Empacadora 1',
        formato_caja: '30 Huevos',
        fechaCreacion: new Date().toISOString(),
        ultimaActualizacion: new Date().toISOString(),
      };

      return {
        success: true,
        data: fallbackResponse,
        message: 'Información obtenida (fallback)',
      };
    }

    // Re-throw with more context if needed
    if (error instanceof apiClient.ApiClientError) {
      throw error;
    }

    throw new apiClient.ApiClientError(
      'Error al obtener información del código escaneado',
      'REQUEST_FAILED',
      error
    );
  }
};

/**
 * Posts an issue report to the server
 * Validates the description before making the request
 */
export const postIssue = async (
  request: PostIssueRequest
): Promise<ApiResponse<IssueReportResult>> => {
  // Client-side validation
  const validation = validateIssueDescription(request.descripcion);

  if (!validation.isValid) {
    throw new apiClient.ApiClientError(
      validation.errorMessage || 'Descripción inválida',
      'VALIDATION_ERROR'
    );
  }

  // Development mode: simulate API response (also used as fallback if real API fails)
  const shouldUseMockMode =
    import.meta.env.DEV &&
    (!import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_API_URL.includes('localhost') ||
      import.meta.env.VITE_USE_MOCK_API === 'true');

  if (shouldUseMockMode) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate success response
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

  // Make the API request
  try {
    const response = await apiClient.post<IssueReportResult>('/postIssue', {
      descripcion: request.descripcion.trim(),
    });

    return response;
  } catch (error) {
    console.error('❌ API Request failed:', error);

    // In development, if the real API fails, fall back to mock mode
    if (import.meta.env.DEV) {
      console.warn('🔄 Falling back to mock mode due to API failure');

      // Simulate success response as fallback
      return {
        success: true,
        data: {
          id: `RPT-FALLBACK-${Date.now()}`,
          mensaje: 'Reporte recibido (fallback - API no disponible)',
          fechaReporte: new Date().toISOString(),
          estado: 'recibido',
        },
        message: 'Reporte enviado correctamente (modo fallback)',
      };
    }

    // Re-throw with more context if needed
    if (error instanceof apiClient.ApiClientError) {
      throw error;
    }

    throw new apiClient.ApiClientError(
      'Error al enviar el reporte',
      'REQUEST_FAILED',
      error
    );
  }
};

/**
 * Alternative method that returns only the data or throws an error
 * Useful for simpler error handling in components
 */
export const submitIssueReport = async (
  descripcion: string
): Promise<IssueReportResult> => {
  const response = await postIssue({ descripcion });

  // Handle different response formats from the API
  // Check if response indicates success (either explicit success flag or presence of data)
  const isSuccessful =
    response.success !== false &&
    (response.data ||
      (response as any).issueNumber ||
      (response as any).message);

  if (!isSuccessful) {
    throw new apiClient.ApiClientError(
      response.error || 'No se pudo enviar el reporte',
      'NO_DATA'
    );
  }

  // Return the appropriate data based on response structure
  if (response.data) {
    return response.data;
  }

  // If data is null but we have other response fields, construct our own result
  if ((response as any).issueNumber || (response as any).message) {
    return {
      id: (response as any).issueNumber || `RPT-${Date.now()}`,
      mensaje: (response as any).message || 'Reporte enviado exitosamente',
      fechaReporte: new Date().toISOString(),
      estado: 'recibido',
    };
  }

  // Fallback
  return {
    mensaje: 'Reporte enviado exitosamente',
    fechaReporte: new Date().toISOString(),
    estado: 'recibido',
  };
};

/**
 * Register a new box in the system
 * Validates the box code and required fields before making the request
 */
export const registerBox = async (
  request: RegisterBoxRequest
): Promise<ApiResponse<RegisterBoxResult>> => {
  // Client-side validation
  const validation = validateScannedCode(request.codigo);

  if (!validation.isValid) {
    throw new apiClient.ApiClientError(
      validation.errorMessage || 'Código de caja inválido',
      'VALIDATION_ERROR'
    );
  }

  if (validation.type !== 'box') {
    throw new apiClient.ApiClientError(
      'El código debe ser de una caja (15 dígitos)',
      'VALIDATION_ERROR'
    );
  }

  if (!request.producto?.trim()) {
    throw new apiClient.ApiClientError(
      'El producto es obligatorio',
      'VALIDATION_ERROR'
    );
  }

  // Development mode: simulate API response
  const shouldUseMockMode =
    import.meta.env.DEV &&
    (!import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_API_URL.includes('localhost') ||
      import.meta.env.VITE_USE_MOCK_API === 'true');

  if (shouldUseMockMode) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate success response
    return {
      success: true,
      data: {
        id: `BOX-${Date.now()}`,
        codigo: request.codigo.trim(),
        mensaje: 'Caja registrada exitosamente (modo desarrollo)',
        fechaRegistro: new Date().toISOString(),
        estado: 'registrado',
      },
      message: 'Caja registrada correctamente',
    };
  }

  // Make the API request
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
    console.error('❌ API Request failed:', error);

    // In development, if the real API fails, fall back to mock mode
    if (import.meta.env.DEV) {
      console.warn('🔄 Falling back to mock mode due to API failure');

      // Simulate success response as fallback
      return {
        success: true,
        data: {
          id: `BOX-FALLBACK-${Date.now()}`,
          codigo: request.codigo.trim(),
          mensaje: 'Caja registrada (fallback - API no disponible)',
          fechaRegistro: new Date().toISOString(),
          estado: 'registrado',
        },
        message: 'Caja registrada correctamente (modo fallback)',
      };
    }

    // Re-throw with more context if needed
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
 * Alternative method that returns only the data or throws an error
 * Useful for simpler error handling in components
 */
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
 * Process a scanned code (box or pallet) with location
 * This is the main endpoint for scanning operations
 */
export const processScan = async (
  request: ProcessScanRequest
): Promise<ApiResponse<ProcessScanResult>> => {
  // Client-side validation
  const validation = validateScannedCode(request.codigo);

  if (!validation.isValid) {
    throw new apiClient.ApiClientError(
      validation.errorMessage || 'Código inválido',
      'VALIDATION_ERROR'
    );
  }

  // Validate location
  const validLocations = ['PACKING', 'BODEGA', 'VENTA', 'TRANSITO'];
  if (!validLocations.includes(request.ubicacion)) {
    throw new apiClient.ApiClientError(
      'Ubicación inválida. Debe ser una de: PACKING, BODEGA, VENTA, TRANSITO',
      'VALIDATION_ERROR'
    );
  }

  // Auto-determine type if not provided
  const tipo = request.tipo || (validation.type === 'box' ? 'BOX' : 'PALLET');

  // Validate business rules
  if (tipo === 'PALLET' && request.ubicacion === 'PACKING') {
    throw new apiClient.ApiClientError(
      'Los pallets no pueden moverse directamente a PACKING',
      'BUSINESS_RULE_ERROR'
    );
  }

  const shouldUseMockMode =
    import.meta.env.DEV &&
    (!import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_API_URL.includes('localhost') ||
      import.meta.env.VITE_USE_MOCK_API === 'true');

  if (shouldUseMockMode) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Mock response based on type and location
    const mockResponse: ProcessScanResult = {
      success: true,
      message: `${tipo === 'BOX' ? 'Caja' : 'Pallet'} procesada exitosamente`,
      data: {
        codigo: request.codigo.trim(),
        tipo: tipo as 'BOX' | 'PALLET',
        ubicacion: request.ubicacion,
        estado: 'activo',
        timestamp: new Date().toISOString(),
        operation:
          tipo === 'BOX' && request.ubicacion === 'PACKING'
            ? 'register_egg'
            : 'move',
        palletCodigo: request.palletCodigo,
      },
    };

    return {
      success: true,
      data: mockResponse,
      message: mockResponse.message,
    };
  }

  // Make the API request
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
    console.error('❌ Process scan request failed:', error);

    // In development, if the real API fails, fall back to mock mode
    if (import.meta.env.DEV) {
      console.warn('🔄 Falling back to mock mode due to API failure');

      const fallbackResponse: ProcessScanResult = {
        success: true,
        message: `${tipo === 'BOX' ? 'Caja' : 'Pallet'} procesada (fallback)`,
        data: {
          codigo: request.codigo.trim(),
          tipo: tipo as 'BOX' | 'PALLET',
          ubicacion: request.ubicacion,
          estado: 'activo',
          timestamp: new Date().toISOString(),
          operation: 'fallback',
        },
      };

      return {
        success: true,
        data: fallbackResponse,
        message: fallbackResponse.message,
      };
    }

    // Re-throw with more context if needed
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
 * Alternative method that returns only the data or throws an error
 * Useful for simpler error handling in components
 */
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

/**
 * Creates a new pallet
 * Validates the pallet code before making the request
 */
export const createPallet = async (
  codigo: string,
  maxBoxes: number = 48
): Promise<ApiResponse<any>> => {
  // Client-side validation: codigo is baseCode (11 digits)
  const base = (codigo || '').trim();
  if (!/^\d{11}$/.test(base)) {
    throw new apiClient.ApiClientError(
      'El código base debe tener 11 dígitos',
      'VALIDATION_ERROR'
    );
  }
  if (!Number.isFinite(maxBoxes) || maxBoxes <= 0) {
    throw new apiClient.ApiClientError(
      'maxBoxes debe ser un número positivo',
      'VALIDATION_ERROR'
    );
  }

  // Make the API request
  try {
    const response = await apiClient.post<any>('/createPallet', {
      codigo: base,
      maxBoxes,
    });

    return response;
  } catch (error) {
    console.error('❌ API Request failed:', error);

    // Re-throw with more context if needed
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
 * Toggles the status of a pallet between open and closed
 * Validates the pallet code before making the request
 */
export const togglePalletStatus = async (
  request: TogglePalletStatusRequest
): Promise<ApiResponse<TogglePalletStatusResult>> => {
  // Client-side validation
  const validation = validateScannedCode(request.codigo);

  if (!validation.isValid || validation.type !== 'pallet') {
    throw new apiClient.ApiClientError(
      'El código debe ser un código de pallet válido',
      'VALIDATION_ERROR'
    );
  }

  // Make the API request
  try {
    const response = await apiClient.post<TogglePalletStatusResult>(
      '/closePallet',
      {
        codigo: request.codigo.trim(),
      }
    );

    return response;
  } catch (error) {
    console.error('❌ Toggle pallet status request failed:', error);

    // In development, if the real API fails, fall back to mock mode
    if (import.meta.env.DEV) {
      console.warn('🔄 Falling back to mock mode due to API failure');

      const mockCurrentStatus = 'abierto';
      const newStatus = 'cerrado';

      return {
        success: true,
        data: {
          codigo: request.codigo.trim(),
          estadoAnterior: mockCurrentStatus,
          estadoNuevo: newStatus,
          mensaje: `Pallet ${newStatus} exitosamente (fallback)`,
          fechaActualizacion: new Date().toISOString(),
        },
        message: `Estado del pallet actualizado (modo fallback)`,
      };
    }

    // Re-throw with more context if needed
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
 * Alternative method that returns only the data or throws an error
 * Useful for simpler error handling in components
 */
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

/**
 * Move a pallet and all its boxes to a new location
 */
export const movePallet = async (
  request: MovePalletRequest
): Promise<ApiResponse<MovePalletResult>> => {
  // Client-side validation
  const validation = validateScannedCode(request.codigo);

  if (!validation.isValid || validation.type !== 'pallet') {
    throw new apiClient.ApiClientError(
      'El código debe ser un código de pallet válido (13 dígitos)',
      'VALIDATION_ERROR'
    );
  }

  const validLocations = ['PACKING', 'TRANSITO', 'BODEGA', 'PREVENTA', 'VENTA'];
  if (!validLocations.includes(request.ubicacion)) {
    throw new apiClient.ApiClientError(
      'Ubicación inválida. Debe ser una de: PACKING, TRANSITO, BODEGA, PREVENTA, VENTA',
      'VALIDATION_ERROR'
    );
  }

  const shouldUseMockMode =
    import.meta.env.DEV &&
    (!import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_API_URL.includes('localhost') ||
      import.meta.env.VITE_USE_MOCK_API === 'true');

  if (shouldUseMockMode) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const mockResponse: MovePalletResult = {
      success: true,
      message: `Pallet movido exitosamente a ${request.ubicacion}`,
      data: {
        codigo: request.codigo.trim(),
        ubicacion: request.ubicacion,
        estado: 'activo',
        timestamp: new Date().toISOString(),
      },
    };

    return {
      success: true,
      data: mockResponse,
      message: mockResponse.message,
    };
  }

  // Real API call
  try {
    const response = await apiClient.post<MovePalletResult>('/movePallet', {
      codigo: request.codigo.trim(),
      ubicacion: request.ubicacion,
    });

    return response;
  } catch (error) {
    console.error('❌ Move pallet request failed:', error);

    if (import.meta.env.DEV) {
      console.warn('🔄 Falling back to mock mode due to API failure');

      const fallback: MovePalletResult = {
        success: true,
        message: `Pallet movido (fallback)`,
        data: {
          codigo: request.codigo.trim(),
          ubicacion: request.ubicacion,
          estado: 'activo',
          timestamp: new Date().toISOString(),
        },
      };

      return {
        success: true,
        data: fallback,
        message: fallback.message,
      };
    }

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
 * Wrapper that returns only the MovePalletResult or throws an error
 */
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
 * API endpoints object for easy access
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
 * Get a paginated list of active pallets
 */
export const getActivePallets = async (
  params: GetActivePalletsParams = { ubicacion: 'PACKING', limit: 50 }
): Promise<ApiResponse<GetActivePalletsResult>> => {
  const { ubicacion = 'PACKING', limit = 50, lastKey, lastEvaluatedKey } = params;

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
 */
export const closePallet = async (
  codigo: string
): Promise<ApiResponse<ClosePalletResult>> => {
  // Trim and do minimal sanity check without enforcing length, backend is source of truth
  const clean = (codigo || '').trim();
  if (!/^[0-9]{13,14}$/.test(clean)) {
    // Allow 13 or 14 for compatibility; backend validation will be authoritative
    console.warn('closePallet: código con formato inusual');
  }

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

// Extend exported endpoints object
export const pallets = {
  getActivePallets,
  closePallet,
};
