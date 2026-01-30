import React, { useEffect, useMemo, useState } from 'react';
import { closePallet, getActivePallets, formatCodeForDisplay } from '../../../api';
import { getErrorMessage } from '../../../utils/errorHandler';
import type {
  ActivePallet,
  GetActivePalletsResult,
} from '../../../api/types';
import {
  Box,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Chip,
} from '../../../components/ui';

const DEFAULT_PAGE_SIZE = 50;

const PalletsList: React.FC = () => {
  const [items, setItems] = useState<ActivePallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastKey, setLastKey] = useState<string | undefined>(undefined);
  const [isClosing, setIsClosing] = useState<string | null>(null);

  const canLoadMore = useMemo(() => Boolean(lastKey), [lastKey]);

  const fetchPage = async (append = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getActivePallets({
        ubicacion: 'PACKING',
        limit: DEFAULT_PAGE_SIZE,
        lastKey: append ? lastKey : undefined,
      });

      if (!res.success) {
        throw new Error(res.error || 'No se pudo obtener los pallets');
      }

      const data = res.data as GetActivePalletsResult;
      setItems(prev => (append ? [...prev, ...(data?.items || [])] : data?.items || []));
      setLastKey(data?.lastKey || data?.lastEvaluatedKey);
    } catch (e: unknown) {
      setError(getErrorMessage(e, 'Error al cargar los pallets'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setItems([]);
    setLastKey(undefined);
    fetchPage(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = async (codigo: string) => {
    if (!codigo) return;
    setIsClosing(codigo);
    setError(null);
    try {
      const res = await closePallet(codigo);
      if (!res.success) {
        throw new Error(res.error || 'No se pudo cerrar el pallet');
      }
      setItems(prev => prev.filter(p => p.codigo !== codigo));
    } catch (e: unknown) {
      setError(getErrorMessage(e, 'Error al cerrar el pallet'));
    } finally {
      setIsClosing(null);
    }
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} mb={2}>
        <Typography variant="h5">Pallets Activos</Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => fetchPage(false)}
          disabled={loading}
        >
          {loading ? 'Cargando…' : 'Refrescar'}
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {items.length === 0 && !loading && (
        <Typography color="text.secondary">No hay pallets activos</Typography>
      )}

      <Stack spacing={2}>
        {items.map((pallet) => (
          <Card key={pallet.codigo} variant="outlined">
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
                <Typography variant="h6">{formatCodeForDisplay(pallet.codigo)}</Typography>
                <Stack direction="row" spacing={1}>
                  {pallet.estado && (
                    <Chip label={pallet.estado} size="small" variant="outlined" />
                  )}
                  {pallet.ubicacion && (
                    <Chip label={pallet.ubicacion} size="small" variant="outlined" />
                  )}
                </Stack>
              </Stack>
              <Stack direction="row" spacing={2} sx={{ mt: 1 }} flexWrap="wrap">
                {pallet.createdAt && (
                  <Typography variant="caption" color="text.secondary">
                    Creado: {new Date(pallet.createdAt).toLocaleString()}
                  </Typography>
                )}
                {pallet.updatedAt && (
                  <Typography variant="caption" color="text.secondary">
                    Actualizado: {new Date(pallet.updatedAt).toLocaleString()}
                  </Typography>
                )}
              </Stack>
              <Box sx={{ mt: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  onClick={() => handleClose(pallet.codigo)}
                  disabled={isClosing === pallet.codigo}
                  title="Cerrar pallet"
                >
                  {isClosing === pallet.codigo ? 'Cerrando…' : 'Cerrar'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => fetchPage(true)}
          disabled={loading || !canLoadMore}
        >
          {loading ? 'Cargando…' : canLoadMore ? 'Cargar más' : 'No hay más resultados'}
        </Button>
      </Box>
    </Box>
  );
};

export default PalletsList;
