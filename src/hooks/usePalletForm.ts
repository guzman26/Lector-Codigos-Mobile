import { useState, useCallback, useEffect } from 'react';
import { createPallet } from '../api';
import { validateScannedCode } from '../utils/validators';
import type {
  PalletFormData,
  PalletFormErrors,
  PalletFormState,
  UsePalletFormReturn,
  PalletCodeParams,
} from '../views/Scanning/CreatePalletForm/PalletForm.types';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FORM_FIELDS,
} from '../views/Scanning/CreatePalletForm/PalletFormConstants';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

const initialFormData: PalletFormData = {
  turno: '',
  calibre: '',
  formato: '',
  empresa: '',
  maxBoxes: '',
  codigoManual: '',
  useManualCode: false,
};

const generatePalletCode = (params: PalletCodeParams): string => {
  const now = dayjs();
  const diaSemana = now.isoWeekday();
  const semana = now.isoWeek().toString().padStart(2, '0');
  const año = now.format('YY');
  const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${diaSemana}${semana}${año}${params.turno}${params.calibre.slice(-1)}${params.formato}${randomPart}`;
};

const validateForm = (formData: PalletFormData): PalletFormErrors => {
  const errors: PalletFormErrors = {};
  if (formData.useManualCode) {
    if (!formData.codigoManual.trim()) {
      errors[FORM_FIELDS.CODIGO_MANUAL] = ERROR_MESSAGES.REQUIRED_FIELD;
    } else {
      const validation = validateScannedCode(formData.codigoManual);
      if (!validation.isValid || validation.type !== 'pallet') {
        errors[FORM_FIELDS.CODIGO_MANUAL] = ERROR_MESSAGES.INVALID_CODE;
      }
    }
  } else {
    if (!formData.turno) errors[FORM_FIELDS.TURNO] = ERROR_MESSAGES.REQUIRED_FIELD;
    if (!formData.calibre) errors[FORM_FIELDS.CALIBRE] = ERROR_MESSAGES.REQUIRED_FIELD;
    if (!formData.formato) errors[FORM_FIELDS.FORMATO] = ERROR_MESSAGES.REQUIRED_FIELD;
    if (!formData.empresa) errors[FORM_FIELDS.EMPRESA] = ERROR_MESSAGES.REQUIRED_FIELD;
  }
  return errors;
};

export const usePalletForm = (
  onPalletCreated?: (palletCode: string) => void
): UsePalletFormReturn => {
  const [state, setState] = useState<PalletFormState>({
    formData: initialFormData,
    errors: {},
    isSubmitting: false,
    generatedCode: null,
    alertMessage: null,
    alertType: null,
  });

  useEffect(() => {
    if (
      !state.formData.useManualCode &&
      state.formData.turno &&
      state.formData.calibre &&
      state.formData.formato
    ) {
      try {
        const code = generatePalletCode({
          turno: state.formData.turno,
          calibre: state.formData.calibre,
          formato: state.formData.formato,
          empresa: state.formData.empresa,
        });
        setState(prev => {
          const { generation, ...restErrors } = prev.errors;
          return { ...prev, generatedCode: code, errors: restErrors };
        });
      } catch {
        setState(prev => ({
          ...prev,
          generatedCode: null,
          errors: { ...prev.errors, generation: ERROR_MESSAGES.CODE_GENERATION_ERROR },
        }));
      }
    } else if (state.formData.useManualCode) {
      setState(prev => ({
        ...prev,
        generatedCode: state.formData.codigoManual || null,
      }));
    } else {
      setState(prev => ({ ...prev, generatedCode: null }));
    }
  }, [
    state.formData.turno,
    state.formData.calibre,
    state.formData.formato,
    state.formData.empresa,
    state.formData.useManualCode,
    state.formData.codigoManual,
  ]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = event.target;
    const checked = type === 'checkbox' ? (event.target as HTMLInputElement).checked : undefined;
    setState(prev => {
      const { [name]: _, ...restErrors } = prev.errors;
      return {
        ...prev,
        formData: {
          ...prev.formData,
          [name]: type === 'checkbox' ? checked : value,
        },
        errors: restErrors,
        alertMessage: null,
        alertType: null,
      };
    });
  }, []);

  const handleToggleManualCode = useCallback(() => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        useManualCode: !prev.formData.useManualCode,
        codigoManual: '',
      },
      errors: {},
      generatedCode: null,
      alertMessage: null,
      alertType: null,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setState({
      formData: initialFormData,
      errors: {},
      isSubmitting: false,
      generatedCode: null,
      alertMessage: null,
      alertType: null,
    });
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const errors = validateForm(state.formData);
      if (Object.keys(errors).length > 0) {
        setState(prev => ({
          ...prev,
          errors,
          alertMessage: ERROR_MESSAGES.FORM_INCOMPLETE,
          alertType: 'error',
        }));
        return;
      }
      const codigoToSubmit = state.formData.useManualCode
        ? state.formData.codigoManual.trim()
        : state.generatedCode;
      if (!codigoToSubmit) {
        setState(prev => ({
          ...prev,
          alertMessage: ERROR_MESSAGES.CODE_GENERATION_ERROR,
          alertType: 'error',
        }));
        return;
      }
      setState(prev => ({ ...prev, isSubmitting: true, alertMessage: null, alertType: null }));
      try {
        const maxBoxesNum = state.formData.maxBoxes ? parseInt(state.formData.maxBoxes, 10) : undefined;
        const response = await createPallet(codigoToSubmit, maxBoxesNum);
        if (response.success) {
          setState(prev => ({
            ...prev,
            isSubmitting: false,
            alertMessage: SUCCESS_MESSAGES.PALLET_CREATED,
            alertType: 'success',
          }));
          if (onPalletCreated) onPalletCreated(codigoToSubmit);
          setTimeout(resetForm, 2000);
        } else {
          throw new Error((response as { error?: string }).error || ERROR_MESSAGES.GENERIC_ERROR);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : ERROR_MESSAGES.UNEXPECTED_ERROR;
        setState(prev => ({
          ...prev,
          isSubmitting: false,
          alertMessage: msg,
          alertType: 'error',
        }));
      }
    },
    [state.formData, state.generatedCode, onPalletCreated, resetForm]
  );

  return {
    ...state,
    handleInputChange,
    handleToggleManualCode,
    handleSubmit,
    resetForm,
  };
};

export default usePalletForm;
