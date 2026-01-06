import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateScannedCode } from '../../../utils/validators';
import { submitMovePallet } from '../../../api';
import './SendPalletToTransit.css';

const SendPalletToTransit: React.FC = () => {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleScanMode = () => setScanMode(prev => !prev);

  useEffect(() => {
    if (scanMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [scanMode]);

  const handleBack = () => navigate('/dashboard');

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const cleanCode = codigo.trim();
    if (!cleanCode) return;

    const validation = validateScannedCode(cleanCode);
    if (!validation.isValid || validation.type !== 'pallet') {
      setError(validation.errorMessage || 'Código de pallet inválido');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await submitMovePallet(cleanCode, 'TRANSITO');
      setSuccessMessage(result.message || 'Pallet movido exitosamente');
      setCodigo('');
      if (scanMode && inputRef.current) {
        inputRef.current.focus();
      }
    } catch (err: any) {
      setError(err.message || 'Error al mover el pallet');
    } finally {
      setLoading(false);
    }
  };

  const validation = validateScannedCode(codigo);
  const showValidationError = codigo.length > 0 && !validation.isValid;
  const showTypeError =
    codigo.length > 0 && validation.isValid && validation.type !== 'pallet';

  return (
    <div className='send-pallet-content'>
      <div className='send-pallet-header'>
        <button onClick={handleBack} className='back-btn'>
          ← Volver
        </button>
        <h1>Enviar Pallet a TRANSITO</h1>
        <p>Escanea o ingresa el código del pallet (14 dígitos)</p>

        {/* Toggle Scanner Mode */}
        <div className='scanner-mode-toggle'>
          <button
            onClick={toggleScanMode}
            className={`toggle-btn ${scanMode ? 'active' : ''}`}
            disabled={loading}
          >
            <span className='toggle-icon'>{scanMode ? '📱' : '⚡'}</span>
            <span className='toggle-text'>
              {scanMode ? 'Modo Scanner: ON' : 'Modo Scanner: OFF'}
            </span>
          </button>
          {scanMode && (
            <p className='scanner-mode-info'>
              🔍 Modo scanner activo - El campo permanecerá enfocado para escaneo
              consecutivo
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className='error-section'>
          <div className='error-message'>
            <span className='error-icon'>⚠️</span>
            <span className='error-text'>{error}</span>
            <button onClick={() => setError(null)} className='error-close'>
              ✕
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className='success-section'>
          <div className='success-message'>
            <span className='success-icon'>✅</span>
            <div className='success-content'>
              <h3>{successMessage}</h3>
              <p>Pallet enviado a TRANSITO</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className='scan-form'>
        <div className='form-section'>
          <div className='form-group'>
            <label htmlFor='codigo' className='form-label'>
              Código de Pallet
            </label>
            <input
              ref={inputRef}
              type='text'
              id='codigo'
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              placeholder={
                scanMode
                  ? 'Escanea códigos consecutivamente...'
                  : 'Escanea o ingresa código de 14 dígitos'
              }
              className={`form-input code-input ${
                showValidationError || showTypeError ? 'error' : ''
              } ${scanMode ? 'scanner-mode' : ''}`}
              disabled={loading}
              autoFocus
              maxLength={14}
            />

            {showValidationError && (
              <span className='validation-error'>
                {validation.errorMessage}
              </span>
            )}

            {showTypeError && (
              <span className='validation-error'>
                Este código es de una caja. Solo se permiten códigos de pallet
                (14 dígitos).
              </span>
            )}

            {codigo.length > 0 &&
              validation.isValid &&
              validation.type === 'pallet' && (
                <span className='validation-success'>
                  ✓ Código válido - Presiona Enter para enviar
                </span>
              )}
          </div>

          <div className='info-box'>
            <h4>Información</h4>
            <ul>
              <li>• Ubicación destino: <strong>TRANSITO</strong></li>
              <li>• Solo códigos de pallet (14 dígitos)</li>
              <li>• Presiona <kbd>Enter</kbd> para procesar</li>
              {scanMode ? (
                <li>
                  • <strong>Modo Scanner:</strong> Campo siempre enfocado para
                  escaneo consecutivo
                </li>
              ) : (
                <li>
                  • Activa el <strong>Modo Scanner</strong> para escaneo con
                  dispositivo físico
                </li>
              )}
            </ul>
          </div>
        </div>
      </form>

      {loading && (
        <div className='loading-overlay'>
          <div className='loading-spinner'></div>
          <p>Enviando pallet...</p>
        </div>
      )}
    </div>
  );
};

export default SendPalletToTransit;
