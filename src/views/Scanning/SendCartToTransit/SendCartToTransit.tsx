import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitMoveCart } from '../../../api';
import './SendCartToTransit.css';

/**
 * Validates if a code is a valid cart code (16 digits)
 */
const isValidCartCode = (code: string): boolean => {
  if (!code || typeof code !== 'string') return false;
  const cleanCode = code.trim();
  return /^\d{16}$/.test(cleanCode);
};

const SendCartToTransit: React.FC = () => {
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

    if (!isValidCartCode(cleanCode)) {
      setError('Código de carro inválido. Debe tener 16 dígitos.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await submitMoveCart(cleanCode, 'TRANSITO');
      setSuccessMessage(result.message || 'Carro movido exitosamente');
      setCodigo('');
      if (scanMode && inputRef.current) {
        inputRef.current.focus();
      }
    } catch (err: any) {
      setError(err.message || 'Error al mover el carro');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const isCodeValid = isValidCartCode(codigo);
  const showValidationError = codigo.length > 0 && !isCodeValid && codigo.length < 16;
  const showLengthError = codigo.length > 0 && codigo.length === 14;

  return (
    <div className='send-pallet-content'>
      <div className='send-pallet-header'>
        <button onClick={handleBack} className='back-btn'>
          ← Volver
        </button>
        <h1>Enviar Carro a TRANSITO</h1>
        <p>Escanea o ingresa el código del carro (16 dígitos)</p>

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
              <p>Carro enviado a TRANSITO</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className='scan-form'>
        <div className='form-section'>
          <div className='form-group'>
            <label htmlFor='codigo' className='form-label'>
              Código de Carro
            </label>
            <input
              ref={inputRef}
              type='text'
              id='codigo'
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                scanMode
                  ? 'Escanea códigos consecutivamente...'
                  : 'Escanea o ingresa código de 16 dígitos'
              }
              className={`form-input code-input ${
                showValidationError || showLengthError ? 'error' : ''
              } ${scanMode ? 'scanner-mode' : ''}`}
              disabled={loading}
              autoFocus
              maxLength={16}
            />

            {showLengthError && (
              <span className='validation-error'>
                Este código parece ser de un pallet (14 dígitos). Solo se permiten códigos de carro
                (16 dígitos).
              </span>
            )}

            {showValidationError && !showLengthError && (
              <span className='validation-error'>
                El código debe tener 16 dígitos numéricos.
              </span>
            )}

            {codigo.length > 0 && isCodeValid && (
              <span className='validation-success'>
                ✓ Código válido - Presiona Enter para enviar
              </span>
            )}
          </div>

          <div className='info-box'>
            <h4>Información</h4>
            <ul>
              <li>• Ubicación destino: <strong>TRANSITO</strong></li>
              <li>• Solo códigos de carro (16 dígitos)</li>
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
          <p>Enviando carro...</p>
        </div>
      )}
    </div>
  );
};

export default SendCartToTransit;

