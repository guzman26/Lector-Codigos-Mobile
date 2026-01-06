import React, { useState, useEffect, useRef } from 'react';
import { ScannedCodeInfo } from '../../../api/types';
import { validateScannedCode } from '../../../utils/validators';
import { submitPalletStatusToggle } from '../../../api';
import './ConsultarCodigo.css';
import { useNavigate } from 'react-router-dom';
import { useScannedCodeContext } from '../../../context/ScannedCodeContext';

interface ConsultaResult extends ScannedCodeInfo {
  timestamp: string;
  palletStatus?: 'abierto' | 'cerrado';
}

const ConsultarCodigo: React.FC = () => {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConsultaResult | null>(null);
  const [recentSearches, setRecentSearches] = useState<ConsultaResult[]>([]);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { getCodeInfo, data } = useScannedCodeContext();
  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('consultar-codigo-history');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.warn('Error loading search history:', e);
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveToHistory = (searchResult: ConsultaResult) => {
    const updated = [
      searchResult,
      ...recentSearches.filter(r => r.codigo !== searchResult.codigo),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('consultar-codigo-history', JSON.stringify(updated));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!codigo.trim()) {
      setError('Por favor ingresa un código');
      return;
    }

    // Client-side validation
    const validation = validateScannedCode(codigo);
    if (!validation.isValid) {
      setError(validation.errorMessage || 'Código inválido');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await getCodeInfo(codigo.trim());
      console.log('🔍 Data:', data);
      if (data) {
        const resultWithTimestamp: ConsultaResult = {
          ...data,
          timestamp: new Date().toISOString(),
        };
        console.log('🔍 Result with timestamp:', resultWithTimestamp);
        setResult(resultWithTimestamp);
        saveToHistory(resultWithTimestamp);
      } else {
        setError('No se encontró información para este código');
      }
      setCodigo(''); // Clear input after successful search
    } catch (err: any) {
      console.error('Error consultando código:', err);
      setError(err.message || 'Error al consultar el código');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = (searchResult: ConsultaResult) => {
    setResult(searchResult);
    setError(null);
    inputRef.current?.focus();
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleTogglePalletStatus = async (codigo: string) => {
    if (!result || result.pkTipo !== 'PALLET') return;

    setToggleLoading(true);
    setToggleError(null);

    try {
      const toggleResult = await submitPalletStatusToggle(codigo);
      
      // Update the result with the new status
      setResult(prev => prev ? {
        ...prev,
        palletStatus: toggleResult.estadoNuevo,
        ultimaActualizacion: toggleResult.fechaActualizacion
      } : null);

      // Show success message briefly
      setToggleError(`✅ ${toggleResult.mensaje}`);
      setTimeout(() => setToggleError(null), 3000);

    } catch (err: any) {
      console.error('Error toggling pallet status:', err);
      setToggleError(err.message || 'Error al cambiar el estado del pallet');
    } finally {
      setToggleLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInMinutes < 1) {
        return 'hace unos segundos';
      } else if (diffInMinutes < 60) {
        return `hace ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`;
      } else if (diffInHours < 24) {
        return `hace ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`;
      } else if (diffInDays < 30) {
        return `hace ${diffInDays} día${diffInDays !== 1 ? 's' : ''}`;
      } else {
        return date.toLocaleDateString('es-ES');
      }
    } catch {
      return 'Fecha inválida';
    }
  };

  const getStatusClass = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activo':
        return 'status-active';
      case 'inactivo':
        return 'status-inactive';
      case 'bloqueado':
        return 'status-blocked';
      default:
        return 'status-unknown';
    }
  };

  const renderActionButtons = (item: ConsultaResult) => {
    if (item.pkTipo === 'BOX') {
      return (
        <div className='action-buttons'>
          <button className='btn-modern btn-primary'>
            📦 Mover Caja
          </button>
          <button className='btn-modern btn-secondary'>
            ℹ️ Ver Detalles
          </button>
          <button className='btn-modern btn-secondary'>
            🔄 Actualizar
          </button>
        </div>
      );
    } else {
      const currentStatus = item.palletStatus || 'cerrado';
      const isOpen = currentStatus === 'abierto';
      
      return (
        <div className='action-buttons'>
          <button className='btn-modern btn-primary'>
            🚛 Mover Pallet
          </button>
          <button className='btn-modern btn-secondary'>
            📋 Ver Contenido
          </button>
          <button 
            className={`btn-modern ${isOpen ? 'btn-danger' : 'btn-success'}`}
            onClick={() => handleTogglePalletStatus(item.codigo)}
            disabled={toggleLoading}
          >
            {toggleLoading ? (
              <>
                <div className='spinner-small'></div>
                Cambiando...
              </>
            ) : isOpen ? (
              '🔒 Cerrar Pallet'
            ) : (
              '🔓 Abrir Pallet'
            )}
          </button>
          <button className='btn-modern btn-secondary'>
            🔄 Actualizar
          </button>
        </div>
      );
    }
  };

  return (
    <div className='consultar-codigo'>
      {/* Header */}
      <div className='header'>
        <button onClick={handleBack} className='back-btn'>
          ← Volver
        </button>
        <div className='header-content'>
          <div className='header-icon'>
            🔍
          </div>
          <h1>Consultar Código</h1>
          <p>Ingresa un código para consultar información detallada</p>
        </div>
      </div>

      {/* Search Section */}
      <div className='search-section'>
        <form onSubmit={handleSubmit} className='search-form'>
          <div className='search-container'>
            <div className='input-wrapper'>
              <span className='search-icon'>🔍</span>
              <input
                ref={inputRef}
                type='text'
                value={codigo}
                onChange={e => setCodigo(e.target.value)}
                placeholder='Escanea o ingresa el código (12 o 15 dígitos)'
                className='search-input'
                disabled={loading}
                autoFocus
              />
              {codigo && (
                <button 
                  type="button" 
                  className='clear-btn'
                  onClick={() => setCodigo('')}
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type='submit'
              className='search-button'
              disabled={loading || !codigo.trim()}
            >
              {loading ? (
                <div className='spinner'></div>
              ) : (
                <>
                  🔍 Buscar
                </>
              )}
            </button>
          </div>
          {error && (
            <div className='error-message'>
              ⚠️ {error}
            </div>
          )}
        </form>
      </div>

      {/* Search Result */}
      {result && (
        <div className='result-section'>
          {/* Code Header Card */}
          <div className='code-card'>
            <div className='code-header'>
              <div className='code-info'>
                <h2 className='code-value'>{result.codigo}</h2>
                <span className='code-timestamp'>
                  🕒 Consultado {formatDate(result.timestamp)}
                </span>
              </div>
              <div className='code-badges'>
                <span className={`badge badge-type ${result.pkTipo === 'BOX' ? 'badge-box' : 'badge-pallet'}`}>
                  {result.pkTipo === 'BOX' ? '📦 Caja' : '🚛 Pallet'}
                </span>
                <span className={`badge badge-status ${getStatusClass(result.estado)}`}>
                  {result.estado}
                </span>
                {result.pkTipo === 'PALLET' && (
                  <span className={`badge badge-pallet-status ${result.palletStatus === 'abierto' ? 'badge-open' : 'badge-closed'}`}>
                    {result.palletStatus === 'abierto' ? '🔓 Abierto' : '🔒 Cerrado'}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Info Tags */}
            <div className='quick-tags'>
              <span className='tag'>
                👤 Operario: {result.operario || 'N/A'}
              </span>
              <span className='tag'>
                🏭 Empacadora: {result.empacadora || 'N/A'}
              </span>
              <span className='tag'>
                📦 Formato: {result.formato_caja || 'N/A'}
              </span>
            </div>
          </div>

          {/* Toggle Message */}
          {toggleError && (
            <div className={`alert ${toggleError.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>
              <div className='alert-content'>
                {toggleError}
              </div>
            </div>
          )}

          {/* Information Grid */}
          <div className='info-grid'>
            {/* Product Information */}
            {result.producto && (
              <div className='info-card'>
                <div className='info-header'>
                  <span>📋</span>
                  <h3>Información del Producto</h3>
                </div>
                <div className='info-content'>
                  <div className='info-row'>
                    <span className='label'>ID:</span>
                    <span className='value'>{result.producto.id}</span>
                  </div>
                  <div className='info-row'>
                    <span className='label'>Nombre:</span>
                    <span className='value'>{result.producto.nombre}</span>
                  </div>
                  {result.producto.descripcion && (
                    <div className='info-row full-width'>
                      <span className='label'>Descripción:</span>
                      <span className='value'>{result.producto.descripcion}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tracking Information */}
            <div className='info-card'>
              <div className='info-header'>
                <span>📅</span>
                <h3>Seguimiento</h3>
              </div>
              <div className='info-content'>
                <div className='info-row'>
                  <span className='label'>Creado:</span>
                  <span className='value'>{formatDate(result.fecha_registro)}</span>
                </div>
                <div className='info-row'>
                  <span className='label'>Actualizado:</span>
                  <span className='value'>{formatDate(result.scannedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='actions-section'>
            {renderActionButtons(result)}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className='recent-section'>
          <div className='section-header'>
            <span>📝</span>
            <h3>Búsquedas Recientes</h3>
          </div>
          <div className='recent-grid'>
            {recentSearches.map((item, index) => (
              <div
                key={`${item.codigo}-${index}`}
                className='recent-card'
                onClick={() => handleQuickSearch(item)}
              >
                <div className='recent-header'>
                  <span className='recent-code'>{item.codigo}</span>
                  <span className={`recent-badge ${item.pkTipo === 'BOX' ? 'badge-box' : 'badge-pallet'}`}>
                    {item.pkTipo === 'BOX' ? '📦' : '🚛'}
                  </span>
                </div>
                <div className='recent-info'>
                  <p className='recent-product'>{item.producto?.nombre || 'Producto sin nombre'}</p>
                  <span className='recent-time'>{formatDate(item.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultarCodigo;


