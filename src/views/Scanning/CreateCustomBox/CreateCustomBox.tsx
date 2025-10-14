import React, { useState, useRef, useEffect } from 'react';
import { processScan } from '../../../api';
import { validateScannedCode } from '../../../utils/validators';
import './CreateCustomBox.css';
import { useNavigate } from 'react-router-dom';

interface ScannedBoxEntry {
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
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Scanning state
  const [currentScanCode, setCurrentScanCode] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [scanError, setScanError] = useState('');
  const [scanSuccess, setScanSuccess] = useState('');
  const [scanLoading, setScanLoading] = useState(false);
  
  // Scanned entries
  const [scannedEntries, setScannedEntries] = useState<ScannedBoxEntry[]>([]);
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Auto-focus input when scanning
  useEffect(() => {
    if (isScanning && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isScanning]);

  const handleScanSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!currentScanCode.trim()) {
      setScanError('Por favor ingrese un código');
      return;
    }

    const validation = validateScannedCode(currentScanCode);
    if (!validation.isValid) {
      setScanError(validation.errorMessage || 'Código inválido');
      return;
    }

    if (validation.type !== 'box') {
      setScanError('Solo se pueden escanear códigos de caja (16 dígitos)');
      return;
    }

    // Check if code already exists
    const existingEntry = scannedEntries.find(entry => entry.boxCode === currentScanCode.trim());
    if (existingEntry) {
      setScanError('Este código ya ha sido escaneado');
      return;
    }

    setScanLoading(true);
    setScanError('');
    setScanSuccess('');

    try {
      // Add the scanned code with default egg count of 0
      const newEntry: ScannedBoxEntry = {
        boxCode: currentScanCode.trim(),
        eggCount: 0
      };
      
      setScannedEntries(prev => [...prev, newEntry]);
      setCurrentScanCode('');
      setScanSuccess(`Código ${newEntry.boxCode} agregado exitosamente`);
      
      // Clear success message after 2 seconds
      setTimeout(() => {
        setScanSuccess('');
      }, 2000);
    } catch (error) {
      console.error('Error adding scanned code:', error);
      setScanError('Error al agregar el código escaneado');
    } finally {
      setScanLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScanSubmit();
    }
  };

  const removeScannedEntry = (index: number) => {
    setScannedEntries(prev => prev.filter((_, i) => i !== index));
  };

  const updateEggCount = (index: number, newCount: number) => {
    setScannedEntries(prev => 
      prev.map((entry, i) => 
        i === index ? { ...entry, eggCount: newCount } : entry
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (scannedEntries.length === 0) {
      setSubmitError('Debe escanear al menos una caja');
      return;
    }

    // Validate all entries have positive egg counts
    const invalidEntry = scannedEntries.find(entry => entry.eggCount <= 0);
    if (invalidEntry) {
      setSubmitError('Todas las cajas deben tener una cantidad de huevos mayor a 0');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Use the first scanned code as the main box code
      const mainBoxCode = scannedEntries[0].boxCode;
      
      // Prepare customInfo from all scanned entries
      const customInfo: Array<[string, number]> = scannedEntries.map(
        entry => [entry.boxCode, entry.eggCount]
      );

      console.log('🔍 Sending request with data:', {
        codigo: mainBoxCode,
        ubicacion: 'PACKING',
        tipo: 'BOX',
        customInfo,
        customInfoLength: customInfo.length,
        customInfoType: typeof customInfo,
        customInfoIsArray: Array.isArray(customInfo),
      });

      const response = await processScan({
        codigo: mainBoxCode,
        ubicacion: 'PACKING', // Always PACKING
        tipo: 'BOX',
        customInfo,
      });

      console.log('🔍 API Response:', response);

      // Check if the response indicates success
      if (response.success && response.data) {
        alert('Caja personalizada creada exitosamente');
        // Reset form
        setScannedEntries([]);
        setCurrentScanCode('');
        setIsScanning(true);
        onSuccess?.();
      } else {
        // Handle different error scenarios
        let errorMessage = 'Error al crear la caja personalizada';
        
        if (response.error) {
          errorMessage = response.error;
        } else if (response.data && typeof response.data === 'object' && 'message' in response.data) {
          // Check if the data contains an error message
          const data = response.data as any;
          if (data.message && !data.success) {
            errorMessage = data.message;
          }
        }
        
        console.error('❌ API returned error:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating custom box:', error);
      setSubmitError(error instanceof Error ? error.message : 'Error inesperado al crear la caja');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    navigate('/dashboard');
  };

  const canSubmit = scannedEntries.length > 0 && !isSubmitting;

  return (
    <div className="create-custom-box">
      <div className="create-custom-box__header">
        <h2>Crear Caja Personalizada</h2>
        <p>Escanee códigos de caja y especifique la cantidad de huevos para cada una</p>
      </div>

      <div className="create-custom-box__content">
        {/* Scanning Section */}
        <div className="scanning-section">
          <h3>Escanear Códigos de Caja</h3>
          
          <form onSubmit={handleScanSubmit} className="scan-form">
            <div className="form-group">
              <label htmlFor="scanCode">Código de Caja</label>
              <input
                ref={inputRef}
                type="text"
                id="scanCode"
                value={currentScanCode}
                onChange={(e) => setCurrentScanCode(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escanee código de 16 dígitos"
                maxLength={16}
                disabled={scanLoading || isSubmitting}
                className={scanError ? 'error' : ''}
              />
              {scanError && (
                <span className="error-message">{scanError}</span>
              )}
              {scanSuccess && (
                <span className="success-message">{scanSuccess}</span>
              )}
            </div>
            
            <button
              type="submit"
              className="btn btn--primary"
              disabled={scanLoading || isSubmitting || !currentScanCode.trim()}
            >
              {scanLoading ? 'Agregando...' : 'Agregar'}
            </button>
          </form>
        </div>

        {/* Scanned Entries Section */}
        {scannedEntries.length > 0 && (
          <div className="scanned-entries">
            <h3>Cajas Escaneadas ({scannedEntries.length})</h3>
            
            <div className="entries-list">
              {scannedEntries.map((entry, index) => (
                <div key={index} className="entry-item">
                  <div className="entry-info">
                    <div className="entry-code">
                      <strong>Código:</strong> {entry.boxCode}
                    </div>
                    <div className="entry-count">
                      <label htmlFor={`eggCount_${index}`}>Cantidad de Huevos:</label>
                      <input
                        type="number"
                        id={`eggCount_${index}`}
                        value={entry.eggCount}
                        onChange={(e) => updateEggCount(index, parseInt(e.target.value) || 0)}
                        min="1"
                        max="999"
                        disabled={isSubmitting}
                        className={entry.eggCount <= 0 ? 'error' : ''}
                        placeholder="Ingrese cantidad"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeScannedEntry(index)}
                    className="btn btn--danger btn--small"
                    disabled={isSubmitting}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Error */}
        {submitError && (
          <div className="error-message error-message--submit">
            {submitError}
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn--secondary"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn--primary"
            disabled={!canSubmit}
          >
            {isSubmitting ? 'Creando...' : 'Crear Caja Personalizada'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCustomBox;
