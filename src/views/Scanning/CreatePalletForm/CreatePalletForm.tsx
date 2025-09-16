/**
 * Create Pallet Form Component
 */
import React from 'react';
import { CreatePalletFormProps } from './PalletForm.types';
import { usePalletForm } from '../../../hooks/usePalletForm';
import { PalletCodePreview } from './PalletCodePreview';
import {
  TURNO_OPTIONS,
  CALIBRE_OPTIONS,
  FORMATO_OPTIONS,
  EMPRESA_OPTIONS,
  FORM_FIELDS,
} from './PalletFormConstants';
import './CreatePalletForm.css';

/**
 * Form for creating a new pallet
 */
export const CreatePalletForm: React.FC<CreatePalletFormProps> = ({
  onPalletCreated,
  onCancel,
}) => {
  const {
    formData,
    errors,
    isSubmitting,
    generatedCode,
    alertMessage,
    alertType,
    handleInputChange,
    handleSubmit,
    resetForm,
  } = usePalletForm(onPalletCreated);

  /**
   * Handle cancel button click
   */
  const handleCancel = () => {
    resetForm();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className='create-pallet-form-container'>
      {alertMessage && alertType && (
        <div className={`alert alert-${alertType}`}>
          <span className='alert-icon'>
            {alertType === 'success' ? '✅' : '⚠️'}
          </span>
          <span className='alert-message'>{alertMessage}</span>
        </div>
      )}

      <form className='create-pallet-form' onSubmit={handleSubmit}>
        <div className='form-header'>
          <h2>🚛 Crear Nuevo Pallet</h2>
          <p>Complete los datos para generar el código del pallet</p>
        </div>

        <div className='code-input-toggle'>
          <label className='toggle-label'>
            <input
              type='checkbox'
              name='useManualCode'
              checked={formData.useManualCode}
              onChange={handleInputChange}
              className='toggle-input'
            />
            <span className='toggle-text'>
              {formData.useManualCode
                ? 'Ingresar código manualmente'
                : 'Generar código automáticamente'}
            </span>
          </label>
        </div>

        {formData.useManualCode ? (
          <div className='manual-code-section'>
            <div className='form-group'>
              <label htmlFor='codigoManual' className='form-label'>
                Código Base del Pallet (11 dígitos) <span className='required'>*</span>
              </label>
              <input
                type='text'
                id='codigoManual'
                name='codigoManual'
                value={formData.codigoManual}
                onChange={handleInputChange}
                placeholder='Ingrese el código base de 11 dígitos'
                className={`form-input ${errors.codigoManual ? 'error' : ''}`}
                maxLength={11}
                pattern='[0-9]{11}'
                required
              />
              {errors.codigoManual && (
                <span className='error-text'>{errors.codigoManual}</span>
              )}
            </div>
          </div>
        ) : (
          <div className='form-grid'>
            <div className='form-group'>
              <label htmlFor='turno' className='form-label'>
                Turno <span className='required'>*</span>
              </label>
              <select
                id='turno'
                name='turno'
                value={formData.turno}
                onChange={handleInputChange}
                className={`form-select ${errors.turno ? 'error' : ''}`}
                required
              >
                {TURNO_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.turno && (
                <span className='error-text'>{errors.turno}</span>
              )}
            </div>

            <div className='form-group'>
              <label htmlFor='maxBoxes' className='form-label'>
                Capacidad de cajas (maxBoxes)
              </label>
              <input
                type='number'
                id='maxBoxes'
                name={FORM_FIELDS.MAX_BOXES}
                value={formData.maxBoxes}
                onChange={handleInputChange}
                className='form-input'
                min={1}
                max={999}
                placeholder='48'
              />
              {errors.maxBoxes && (
                <span className='error-text'>{errors.maxBoxes}</span>
              )}
            </div>
            <div className='form-group'>
              <label htmlFor='calibre' className='form-label'>
                Calibre <span className='required'>*</span>
              </label>
              <select
                id='calibre'
                name='calibre'
                value={formData.calibre}
                onChange={handleInputChange}
                className={`form-select ${errors.calibre ? 'error' : ''}`}
                required
              >
                {CALIBRE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.calibre && (
                <span className='error-text'>{errors.calibre}</span>
              )}
            </div>

            <div className='form-group'>
              <label htmlFor='formato' className='form-label'>
                Formato <span className='required'>*</span>
              </label>
              <select
                id='formato'
                name='formato'
                value={formData.formato}
                onChange={handleInputChange}
                className={`form-select ${errors.formato ? 'error' : ''}`}
                required
              >
                {FORMATO_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.formato && (
                <span className='error-text'>{errors.formato}</span>
              )}
            </div>

            <div className='form-group'>
              <label htmlFor='empresa' className='form-label'>
                Empresa <span className='required'>*</span>
              </label>
              <select
                id='empresa'
                name={FORM_FIELDS.EMPRESA}
                value={formData.empresa}
                onChange={handleInputChange}
                className={`form-select ${errors.empresa ? 'error' : ''}`}
                required
              >
                {EMPRESA_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.empresa && (
                <span className='error-text'>{errors.empresa}</span>
              )}
            </div>
          </div>
        )}

        {generatedCode && <PalletCodePreview code={generatedCode} />}

        <div className='form-buttons'>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>

          <button
            type='submit'
            className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting || !generatedCode}
          >
            {isSubmitting ? (
              <>
                <span className='loading-spinner'></span>
                Creando...
              </>
            ) : (
              'Crear Pallet'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePalletForm;
