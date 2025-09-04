import React, { useEffect, useMemo, useState } from 'react';
import { closePallet, getActivePallets, formatCodeForDisplay } from '../../../api';
import type {
  ActivePallet,
  GetActivePalletsResult,
} from '../../../api/types';
import './PalletsList.css';

const DEFAULT_PAGE_SIZE = 50;

const PalletsList: React.FC = () => {
  const [items, setItems] = useState<ActivePallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastKey, setLastKey] = useState<string | undefined>(undefined);
  const [isClosing, setIsClosing] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string>('PACKING');

  const canLoadMore = useMemo(() => Boolean(lastKey), [lastKey]);

  const fetchPage = async (append = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getActivePallets({
        ubicacion: locationFilter || undefined,
        limit: DEFAULT_PAGE_SIZE,
        lastEvaluatedKey: append ? lastKey : undefined,
      });

      if (!res.success) {
        throw new Error(res.error || 'No se pudo obtener los pallets');
      }

      const data = res.data as GetActivePalletsResult;
      setItems(prev => (append ? [...prev, ...(data?.items || [])] : data?.items || []));
      setLastKey(data?.lastEvaluatedKey);
    } catch (e: any) {
      setError(e?.message || 'Error al cargar los pallets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial load or when filter changes
    setItems([]);
    setLastKey(undefined);
    fetchPage(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationFilter]);

  const handleClose = async (codigo: string) => {
    if (!codigo) return;
    setIsClosing(codigo);
    setError(null);
    try {
      const res = await closePallet(codigo);
      if (!res.success) {
        throw new Error(res.error || 'No se pudo cerrar el pallet');
      }
      // Optimistically remove or mark as closed
      setItems(prev => prev.filter(p => p.codigo !== codigo));
    } catch (e: any) {
      setError(e?.message || 'Error al cerrar el pallet');
    } finally {
      setIsClosing(null);
    }
  };

  return (
    <div className='pallets-list-page'>
      <div className='pallets-header'>
        <h2 className='page-title'>Pallets Activos</h2>
        <div className='filters'>
          <label className='filter-item'>
            <span>Ubicación</span>
            <select
              className='select-input'
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
            >
              <option value='PACKING'>PACKING</option>
              <option value='TRANSITO'>TRANSITO</option>
              <option value='BODEGA'>BODEGA</option>
              <option value='VENTA'>VENTA</option>
            </select>
          </label>
          <button
            className='refresh-btn'
            onClick={() => fetchPage(false)}
            disabled={loading}
          >
            {loading ? 'Cargando…' : 'Refrescar'}
          </button>
        </div>
      </div>

      {error && <div className='error-banner'>{error}</div>}

      <div className='pallets-list'>
        {items.length === 0 && !loading && (
          <div className='empty-state'>No hay pallets activos</div>
        )}
        {items.map(pallet => (
          <div className='pallet-card' key={pallet.codigo}>
            <div className='pallet-main'>
              <div className='pallet-code'>
                {formatCodeForDisplay(pallet.codigo)}
              </div>
              <div className='pill-group'>
                {pallet.estado && (
                  <span className={`pill state ${pallet.estado}`}>{pallet.estado}</span>
                )}
                {pallet.ubicacion && (
                  <span className='pill location'>{pallet.ubicacion}</span>
                )}
              </div>
            </div>
            <div className='pallet-meta'>
              {pallet.createdAt && (
                <span className='meta-item'>Creado: {new Date(pallet.createdAt).toLocaleString()}</span>
              )}
              {pallet.updatedAt && (
                <span className='meta-item'>Actualizado: {new Date(pallet.updatedAt).toLocaleString()}</span>
              )}
            </div>
            <div className='actions'>
              <button
                className='close-btn'
                onClick={() => handleClose(pallet.codigo)}
                disabled={isClosing === pallet.codigo}
                title='Cerrar pallet'
              >
                {isClosing === pallet.codigo ? 'Cerrando…' : 'Cerrar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className='pagination'>
        <button
          className='load-more-btn'
          onClick={() => fetchPage(true)}
          disabled={loading || !canLoadMore}
        >
          {loading ? 'Cargando…' : canLoadMore ? 'Cargar más' : 'No hay más resultados'}
        </button>
      </div>
    </div>
  );
};

export default PalletsList;


