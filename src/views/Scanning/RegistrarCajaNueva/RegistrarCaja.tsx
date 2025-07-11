import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScanContext } from '../../../context/ScanContext';
import { validateScannedCode } from '../../../utils/validators';
import './RegistrarCaja.css';

const RegistrarCaja: React.FC = () => {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [scanBoxMode, setScanBoxMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data, loading, error, processScan, reset } = useScanContext();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!codigo.trim()) {
      return;
    }

    const validation = validateScannedCode(codigo);
    if (!validation.isValid) {
      return;
    }

    // Si no es una caja, no procesar
    if (validation.type !== 'box') {
      return;
    }

    await processScan({
      codigo: codigo.trim(),
      ubicacion: 'PACKING', // Por defecto PACKING
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const toggleScanBoxMode = () => {
    setScanBoxMode(prev => !prev);
  };

  // Mantener foco en input cuando está en modo scanner
  useEffect(() => {
    if (scanBoxMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [scanBoxMode, codigo]);

  // Limpiar código después de un escaneo exitoso
  useEffect(() => {
    if (data && data.success) {
      const timer = setTimeout(() => {
        setCodigo('');
        // Mantener foco si está en modo scanner
        if (scanBoxMode && inputRef.current) {
          inputRef.current.focus();
        }
      }, 1000); // Reducido a 1 segundo para mejor flujo
      return () => clearTimeout(timer);
    }
  }, [data, scanBoxMode]);

  const validation = validateScannedCode(codigo);
  const showValidationError = codigo.length > 0 && !validation.isValid;
  const showTypeError =
    codigo.length > 0 && validation.isValid && validation.type !== 'box';

  return (
    <div className='registrar-caja-content'>
      <div className='registrar-caja-header'>
        <button onClick={handleBack} className='back-btn'>
          ← Volver
        </button>
        <h1>Escanear Nueva Caja</h1>
        <p>Escanea o ingresa el código de la nueva caja para PACKING</p>

        {/* Toggle Scanner Mode */}
        <div className='scanner-mode-toggle'>
          <button
            onClick={toggleScanBoxMode}
            className={`toggle-btn ${scanBoxMode ? 'active' : ''}`}
            disabled={loading}
          >
            <span className='toggle-icon'>{scanBoxMode ? '📱' : '⚡'}</span>
            <span className='toggle-text'>
              {scanBoxMode ? 'Modo Scanner: ON' : 'Modo Scanner: OFF'}
            </span>
          </button>
          {scanBoxMode && (
            <p className='scanner-mode-info'>
              🔍 Modo scanner activo - El campo permanecerá enfocado para
              escaneo consecutivo
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className='error-section'>
          <div className='error-message'>
            <span className='error-icon'>⚠️</span>
            <span className='error-text'>{error}</span>
            <button onClick={reset} className='error-close'>
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Resultado exitoso */}
      {data && data.success && (
        <div className='success-section'>
          <div className='success-message'>
            <span className='success-icon'>✅</span>
            <div className='success-content'>
              <h3>¡Caja procesada exitosamente!</h3>
              <div className='success-details'>
                <p>
                  <strong>Código:</strong> {data.data?.codigo}
                </p>
                <p>
                  <strong>Ubicación:</strong> {data.data?.ubicacion}
                </p>
                <p>
                  <strong>Estado:</strong> {data.data?.estado}
                </p>
              </div>
              <p className='success-note'>Puede escanear otra caja</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className='scan-form'>
        <div className='form-section'>
          <div className='form-group'>
            <label htmlFor='codigo' className='form-label'>
              Código de Caja
            </label>
            <input
              ref={inputRef}
              type='text'
              id='codigo'
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              onKeyPress={handleKeyPress}
              onBlur={() => {
                // Si está en modo scanner, volver a enfocar después de un breve delay
                if (scanBoxMode) {
                  setTimeout(() => {
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }, 100);
                }
              }}
              placeholder={
                scanBoxMode
                  ? 'Escanea códigos consecutivamente...'
                  : 'Escanea o ingresa código de 16 dígitos'
              }
              className={`form-input code-input ${showValidationError || showTypeError ? 'error' : ''} ${scanBoxMode ? 'scanner-mode' : ''}`}
              disabled={loading}
              autoFocus
              maxLength={16}
            />

            {showValidationError && (
              <span className='validation-error'>
                {validation.errorMessage}
              </span>
            )}

            {showTypeError && (
              <span className='validation-error'>
                Este código es de un pallet. Solo se permiten códigos de caja
                (16 dígitos).
              </span>
            )}

            {codigo.length > 0 &&
              validation.isValid &&
              validation.type === 'box' && (
                <span className='validation-success'>
                  ✓ Código válido - Presiona Enter para procesar
                </span>
              )}
          </div>

          <div className='info-box'>
            <h4>Información</h4>
            <ul>
              <li>
                • Ubicación: <strong>PACKING</strong> (automática)
              </li>
              <li>• Solo códigos de caja (16 dígitos)</li>
              <li>
                • Presiona <kbd>Enter</kbd> para procesar
              </li>
              {scanBoxMode ? (
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

          {/* Códigos de prueba para desarrollo */}
          <div className='test-codes'>
            <p>Códigos de prueba:</p>
            <div className='test-buttons'>
              <button
                type='button'
                onClick={() => setCodigo('1234567890123456')}
                className='test-btn'
                disabled={loading}
              >
                Caja: 1234567890123456
              </button>
              <button
                type='button'
                onClick={() => setCodigo('9876543210987654')}
                className='test-btn'
                disabled={loading}
              >
                Caja: 9876543210987654
              </button>
            </div>
          </div>
        </div>
      </form>

      {loading && (
        <div className='loading-overlay'>
          <div className='loading-spinner'></div>
          <p>Procesando caja...</p>
        </div>
      )}
    </div>
  );
};

export default RegistrarCaja;
