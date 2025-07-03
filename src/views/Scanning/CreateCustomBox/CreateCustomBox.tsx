import React, { useState } from 'react';
import { processScan } from '../../../api/endpoints';
import { validateScannedCode } from '../../../utils/validators';
import './CreateCustomBox.css';
import { useNavigate } from 'react-router-dom';

interface CustomBoxEntry {
  boxCode: string;
  eggCount: number;
}

interface CreateCustomBoxProps {
  onSuccess?: () => void;
}

export const CreateCustomBox: React.FC<CreateCustomBoxProps> = ({
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [mainBoxCode, setMainBoxCode] = useState('');
  const [ubicacion, setUbicacion] = useState('PACKING');
  const [palletCodigo, setPalletCodigo] = useState('');
  const [customEntries, setCustomEntries] = useState<CustomBoxEntry[]>([
    { boxCode: '', eggCount: 0 },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onCancel = () => {
    navigate('/dashboard');
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate main box code
    const mainCodeValidation = validateScannedCode(mainBoxCode);
    if (!mainCodeValidation.isValid) {
      newErrors.mainBoxCode = mainCodeValidation.errorMessage || 'Código inválido';
    }

    // Validate pallet code if provided
    if (palletCodigo) {
      const palletValidation = validateScannedCode(palletCodigo);
      if (!palletValidation.isValid || palletValidation.type !== 'pallet') {
        newErrors.palletCodigo = 'Código de pallet inválido (debe tener 13 dígitos)';
      }
    }

    // Validate custom entries
    customEntries.forEach((entry, index) => {
      if (entry.boxCode) {
        const validation = validateScannedCode(entry.boxCode);
        if (!validation.isValid) {
          newErrors[`customEntry_${index}_code`] = 'Código inválido';
        }
      }
      
      if (entry.eggCount < 0 || entry.eggCount > 999) {
        newErrors[`customEntry_${index}_count`] = 'Cantidad debe estar entre 0 y 999';
      }
    });

    // At least one custom entry should have data
    const hasValidCustomEntry = customEntries.some(
      entry => entry.boxCode.trim() && entry.eggCount > 0
    );
    
    if (!hasValidCustomEntry) {
      newErrors.customEntries = 'Debe agregar al menos una entrada de seguimiento de huevos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addCustomEntry = () => {
    setCustomEntries([...customEntries, { boxCode: '', eggCount: 0 }]);
  };

  const removeCustomEntry = (index: number) => {
    if (customEntries.length > 1) {
      const newEntries = customEntries.filter((_, i) => i !== index);
      setCustomEntries(newEntries);
    }
  };

  const updateCustomEntry = (index: number, field: keyof CustomBoxEntry, value: string | number) => {
    const newEntries = [...customEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setCustomEntries(newEntries);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Filter out empty entries and prepare customInfo
      const validCustomEntries = customEntries.filter(
        entry => entry.boxCode.trim() && entry.eggCount > 0
      );

      const customInfo: Array<[string, number]> = validCustomEntries.map(
        entry => [entry.boxCode.trim(), entry.eggCount]
      );

      const response = await processScan({
        codigo: mainBoxCode.trim(),
        ubicacion,
        tipo: 'BOX',
        palletCodigo: palletCodigo.trim() || undefined,
        customInfo,
      });

      if (response.success) {
        alert('Caja personalizada creada exitosamente');
        // Reset form
        setMainBoxCode('');
        setPalletCodigo('');
        setCustomEntries([{ boxCode: '', eggCount: 0 }]);
        onSuccess?.();
      } else {
        throw new Error(response.error || 'Error al crear la caja personalizada');
      }
    } catch (error) {
      console.error('Error creating custom box:', error);
      setErrors({
        submit: error instanceof Error ? error.message : 'Error inesperado al crear la caja',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ubicaciones = ['PACKING', 'BODEGA', 'VENTA', 'TRANSITO'];

  return (
    <div className="create-custom-box">
      <div className="create-custom-box__header">
        <h2>Crear Caja Personalizada</h2>
        <p>Registre información personalizada de seguimiento de huevos</p>
      </div>

      <form onSubmit={handleSubmit} className="create-custom-box__form">
        {/* Main Box Code */}
        <div className="form-group">
          <label htmlFor="mainBoxCode">Código de Caja Principal *</label>
          <input
            type="text"
            id="mainBoxCode"
            value={mainBoxCode}
            onChange={(e) => setMainBoxCode(e.target.value)}
            placeholder="Ingrese código de 16 dígitos (DSSAA-OOET-CCFC-CCC)"
            maxLength={16}
            className={errors.mainBoxCode ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.mainBoxCode && (
            <span className="error-message">{errors.mainBoxCode}</span>
          )}
        </div>

        {/* Location */}
        <div className="form-group">
          <label htmlFor="ubicacion">Ubicación *</label>
          <select
            id="ubicacion"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            disabled={isLoading}
          >
            {ubicaciones.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Pallet Code */}
        <div className="form-group">
          <label htmlFor="palletCodigo">Código de Pallet (Opcional)</label>
          <input
            type="text"
            id="palletCodigo"
            value={palletCodigo}
            onChange={(e) => setPalletCodigo(e.target.value)}
            placeholder="Ingrese código de 13 dígitos (DSSAA-HCCF-E-CCC)"
            maxLength={13}
            className={errors.palletCodigo ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.palletCodigo && (
            <span className="error-message">{errors.palletCodigo}</span>
          )}
        </div>

        {/* Custom Entries */}
        <div className="custom-entries">
          <div className="custom-entries__header">
            <h3>Información de Seguimiento de Huevos</h3>
            <button
              type="button"
              onClick={addCustomEntry}
              className="btn btn--secondary btn--small"
              disabled={isLoading}
            >
              + Agregar Entrada
            </button>
          </div>

          {customEntries.map((entry, index) => (
            <div key={index} className="custom-entry">
              <div className="custom-entry__fields">
                <div className="form-group">
                  <label htmlFor={`boxCode_${index}`}>Código de Caja</label>
                  <input
                    type="text"
                    id={`boxCode_${index}`}
                    value={entry.boxCode}
                    onChange={(e) => updateCustomEntry(index, 'boxCode', e.target.value)}
                    placeholder="Código de 16 dígitos"
                    maxLength={16}
                    className={errors[`customEntry_${index}_code`] ? 'error' : ''}
                    disabled={isLoading}
                  />
                  {errors[`customEntry_${index}_code`] && (
                    <span className="error-message">{errors[`customEntry_${index}_code`]}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor={`eggCount_${index}`}>Cantidad de Huevos</label>
                  <input
                    type="number"
                    id={`eggCount_${index}`}
                    value={entry.eggCount}
                    onChange={(e) => updateCustomEntry(index, 'eggCount', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    max="999"
                    className={errors[`customEntry_${index}_count`] ? 'error' : ''}
                    disabled={isLoading}
                  />
                  {errors[`customEntry_${index}_count`] && (
                    <span className="error-message">{errors[`customEntry_${index}_count`]}</span>
                  )}
                </div>

                {customEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCustomEntry(index)}
                    className="btn btn--danger btn--small"
                    disabled={isLoading}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}

          {errors.customEntries && (
            <span className="error-message">{errors.customEntries}</span>
          )}
        </div>

        {/* Submit Errors */}
        {errors.submit && (
          <div className="error-message error-message--submit">
            {errors.submit}
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn--secondary"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={isLoading}
          >
            {isLoading ? 'Creando...' : 'Crear Caja Personalizada'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomBox;
