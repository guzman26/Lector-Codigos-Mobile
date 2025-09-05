import type { CodeValidationResult } from '../api/types';

/**
 * Validates if a code is a valid box code (16 digits)
 * Format: D-SS-AA-OO-E-T-CC-F-C-CCC
 * D=Día, SS=Semana, AA=Año, OO=Operario, E=Empacadora, T=Turno, CC=Calibre, F=Formato, C=Empresa, CCC=Contador
 */
export const isValidBoxCode = (code: string): boolean => {
  if (!code || typeof code !== 'string') return false;

  // Remove any whitespace
  const cleanCode = code.trim();

  // Check if it's exactly 16 digits
  return /^\d{16}$/.test(cleanCode);
};

/**
 * Detailed validation for box code with component analysis
 * Returns specific validation results for each component
 */
export const validateBoxCodeDetailed = (code: string): {
  isValid: boolean;
  errorMessage?: string;
  components?: {
    dia: string;
    semana: string;
    año: string;
    operario: string;
    empacadora: string;
    turno: string;
    calibre: string;
    formato: string;
    empresa: string;
    contador: string;
  };
} => {
  if (!code || typeof code !== 'string') {
    return {
      isValid: false,
      errorMessage: 'El código es requerido',
    };
  }

  const cleanCode = code.trim();

  if (cleanCode.length !== 16) {
    return {
      isValid: false,
      errorMessage: `El código debe tener exactamente 16 dígitos (actual: ${cleanCode.length})`,
    };
  }

  if (!/^\d{16}$/.test(cleanCode)) {
    return {
      isValid: false,
      errorMessage: 'El código debe contener solo números',
    };
  }

  // Parse components
  const dia = cleanCode.substr(0, 1);
  const semana = cleanCode.substr(1, 2);
  const año = cleanCode.substr(3, 2);
  const operario = cleanCode.substr(5, 2);
  const empacadora = cleanCode.substr(7, 1);
  const turno = cleanCode.substr(8, 1);
  const calibre = cleanCode.substr(9, 2);
  const formato = cleanCode.substr(11, 1);
  const empresa = cleanCode.substr(12, 1);
  const contador = cleanCode.substr(13, 3);

  // Basic range validations
  const diaNum = parseInt(dia);
  const semanaNum = parseInt(semana);

  if (diaNum < 1 || diaNum > 7) {
    return {
      isValid: false,
      errorMessage: 'Día de la semana debe estar entre 1 y 7',
    };
  }

  if (semanaNum < 1 || semanaNum > 53) {
    return {
      isValid: false,
      errorMessage: 'Semana debe estar entre 01 y 53',
    };
  }

  return {
    isValid: true,
    components: {
      dia,
      semana,
      año,
      operario,
      empacadora,
      turno,
      calibre,
      formato,
      empresa,
      contador,
    },
  };
};

/**
 * Detailed validation for pallet code with component analysis
 * Returns specific validation results for each component
 */
export const validatePalletCodeDetailed = (code: string): {
  isValid: boolean;
  errorMessage?: string;
  components?: {
    dia_semana: string;
    semana: string;
    año: string;
    horario_proceso: string;
    calibre: string;
    formato_caja: string;
    empresa: string;
    contador: string;
  };
} => {
  if (!code || typeof code !== 'string') {
    return {
      isValid: false,
      errorMessage: 'El código es requerido',
    };
  }

  const cleanCode = code.trim();

  if (cleanCode.length !== 14) {
    return {
      isValid: false,
      errorMessage: `El código debe tener exactamente 14 dígitos (actual: ${cleanCode.length})`,
    };
  }

  if (!/^\d{14}$/.test(cleanCode)) {
    return {
      isValid: false,
      errorMessage: 'El código debe contener solo números',
    };
  }

  // Parse components according to the new format
  // 1 diaSemana (0), 2 semana (1-2), 2 año (3-4), 1 turno (5), 2 calibre (6-7), 1 formato (8), 2 empresa (9-10), 3 contador (11-13)
  const dia_semana = cleanCode.slice(0, 1);
  const semana = cleanCode.slice(1, 3);
  const año = `20${cleanCode.slice(3, 5)}`;
  const horario_codigo = cleanCode.slice(5, 6);
  const horario_proceso = horario_codigo === '1' ? 'Mañana' : 'Tarde';
  const calibre = cleanCode.slice(6, 8);
  const formato_caja = cleanCode.slice(8, 9);
  const empresa = cleanCode.slice(9, 11);
  const contador = cleanCode.slice(11, 14);

  // Basic range validations
  const diaNum = parseInt(dia_semana);
  const semanaNum = parseInt(semana);
  const añoNum = parseInt(cleanCode.slice(3, 5));

  if (diaNum < 1 || diaNum > 7) {
    return {
      isValid: false,
      errorMessage: 'Día de la semana debe estar entre 1 y 7',
    };
  }

  if (semanaNum < 1 || semanaNum > 53) {
    return {
      isValid: false,
      errorMessage: 'Semana debe estar entre 01 y 53',
    };
  }

  if (añoNum < 0 || añoNum > 99) {
    return {
      isValid: false,
      errorMessage: 'Año debe estar entre 00 y 99',
    };
  }

  return {
    isValid: true,
    components: {
      dia_semana,
      semana,
      año,
      horario_proceso,
      calibre,
      formato_caja,
      empresa,
      contador,
    },
  };
};

/**
 * Validates if a code is a valid pallet code (13 digits)
 * Format: D-SS-AA-H-CC-F-E-CCC
 * D=Día, SS=Semana, AA=Año, H=Horario, CC=Calibre, F=Formato, E=Empresa, CCC=Contador
 */
export const isValidPalletCode = (code: string): boolean => {
  if (!code || typeof code !== 'string') return false;

  // Remove any whitespace
  const cleanCode = code.trim();

  // Check if it's exactly 14 digits
  return /^\d{14}$/.test(cleanCode);
};

/**
 * Validates a scanned code and returns detailed validation result
 */
export const validateScannedCode = (code: string): CodeValidationResult => {
  if (!code || typeof code !== 'string') {
    return {
      isValid: false,
      errorMessage: 'El código es requerido',
    };
  }

  const cleanCode = code.trim();

  if (cleanCode.length === 0) {
    return {
      isValid: false,
      errorMessage: 'El código no puede estar vacío',
    };
  }

  // Check for box code (16 digits)
  if (isValidBoxCode(cleanCode)) {
    return {
      isValid: true,
      type: 'box',
    };
  }

  // Check for pallet code (14 digits)
  if (isValidPalletCode(cleanCode)) {
    return {
      isValid: true,
      type: 'pallet',
    };
  }

  // Invalid code
  return {
    isValid: false,
    errorMessage:
      'El código debe ser válido: código de caja (16 dígitos) o código de pallet (14 dígitos)',
  };
};

/**
 * Sanitizes a code by removing whitespace and non-numeric characters
 */
export const sanitizeCode = (code: string): string => {
  if (!code || typeof code !== 'string') return '';

  return code.replace(/\D/g, ''); // Remove all non-digit characters
};

/**
 * Formats a code for display purposes
 */
export const formatCodeForDisplay = (code: string): string => {
  const clean = sanitizeCode(code);

  if (clean.length === 14) {
    // Format pallet code (14): DSSAA-H-CC-F-EE-CCC
    const part1 = clean.slice(0, 5); // D + SS + AA
    const turno = clean.slice(5, 6); // H
    const calibre = clean.slice(6, 8); // CC
    const formato = clean.slice(8, 9); // F
    const empresa = clean.slice(9, 11); // EE
    const contador = clean.slice(11, 14); // CCC
    return `${part1}-${turno}-${calibre}-${formato}-${empresa}-${contador}`;
  }

  if (clean.length === 16) {
    // Format box code: DSSAA-OOET-CCFC-CCC (Day/Week/Year-Operator/Packer/Shift-Caliber/Format/Company-Counter)
    return clean.replace(/(\d{5})(\d{4})(\d{4})(\d{3})/, '$1-$2-$3-$4');
  }

  return clean;
};

/**
 * Validates issue report description
 */
export const validateIssueDescription = (
  description: string
): { isValid: boolean; errorMessage?: string } => {
  if (!description || typeof description !== 'string') {
    return {
      isValid: false,
      errorMessage: 'La descripción es requerida',
    };
  }

  const trimmed = description.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      errorMessage: 'La descripción no puede estar vacía',
    };
  }

  if (trimmed.length > 1000) {
    return {
      isValid: false,
      errorMessage: 'La descripción no puede exceder los 1000 caracteres',
    };
  }

  if (trimmed.length < 10) {
    return {
      isValid: false,
      errorMessage: 'La descripción debe tener al menos 10 caracteres',
    };
  }

  return {
    isValid: true,
  };
};
