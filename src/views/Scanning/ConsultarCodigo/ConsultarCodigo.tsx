import React, { useState, useEffect, useRef } from 'react';
import { ScannedCodeInfo } from '../../../api/types';
import { validateScannedCode } from '../../../utils/validators';
import { formatDate } from '../../../utils/dateFormatters';
import { getErrorMessage } from '../../../utils/errorHandler';
import { submitPalletStatusToggle } from '../../../api';
import { useNavigate } from 'react-router-dom';
import { useScannedCodeContext } from '../../../context/ScannedCodeContext';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import {
  Box,
  Stack,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Typography,
  Alert,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemButton,
} from '../../../components/ui';

interface ConsultaResult extends ScannedCodeInfo {
  timestamp: string;
  palletStatus?: 'abierto' | 'cerrado';
}

const ConsultarCodigo: React.FC = () => {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConsultaResult | null>(null);
  const [recentSearches, setRecentSearches] = useLocalStorage<ConsultaResult[]>(
    'consultar-codigo-history',
    []
  );
  const [toggleLoading, setToggleLoading] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { getCodeInfo, data } = useScannedCodeContext();

  const saveToHistory = (searchResult: ConsultaResult) => {
    setRecentSearches((prev) => {
      const updated = [
        searchResult,
        ...prev.filter(r => r.codigo !== searchResult.codigo),
      ].slice(0, 5);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim()) {
      setError('Por favor ingresa un código');
      return;
    }
    const validation = validateScannedCode(codigo);
    if (!validation.isValid) {
      setError(validation.errorMessage || 'Código inválido');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await getCodeInfo(codigo.trim());
      if (data) {
        const resultWithTimestamp: ConsultaResult = { ...data, timestamp: new Date().toISOString() };
        setResult(resultWithTimestamp);
        saveToHistory(resultWithTimestamp);
      } else {
        setError('No se encontró información para este código');
      }
      setCodigo('');
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Error al consultar el código'));
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

  const handleBack = () => navigate('/dashboard');

  const handleTogglePalletStatus = async (codigoPallet: string) => {
    if (!result || result.pkTipo !== 'PALLET') return;
    setToggleLoading(true);
    setToggleError(null);
    try {
      const toggleResult = await submitPalletStatusToggle(codigoPallet);
      setResult(prev => prev ? {
        ...prev,
        palletStatus: toggleResult.estadoNuevo,
        ultimaActualizacion: toggleResult.fechaActualizacion
      } : null);
      setToggleError(`✅ ${toggleResult.mensaje}`);
      setTimeout(() => setToggleError(null), 3000);
    } catch (err: unknown) {
      setToggleError(getErrorMessage(err, 'Error al cambiar el estado del pallet'));
    } finally {
      setToggleLoading(false);
    }
  };


  const renderActionButtons = (item: ConsultaResult) => {
    if (item.pkTipo === 'BOX') {
      return (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button variant="contained" size="small">📦 Mover Caja</Button>
          <Button variant="outlined" size="small">ℹ️ Ver Detalles</Button>
          <Button variant="outlined" size="small">🔄 Actualizar</Button>
        </Stack>
      );
    }
    const currentStatus = item.palletStatus || 'cerrado';
    const isOpen = currentStatus === 'abierto';
    return (
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Button variant="contained" size="small">🚛 Mover Pallet</Button>
        <Button variant="outlined" size="small">📋 Ver Contenido</Button>
        <Button
          variant="contained"
          size="small"
          color={isOpen ? 'error' : 'success'}
          onClick={() => handleTogglePalletStatus(item.codigo)}
          disabled={toggleLoading}
        >
          {toggleLoading ? 'Cambiando...' : isOpen ? '🔒 Cerrar Pallet' : '🔓 Abrir Pallet'}
        </Button>
        <Button variant="outlined" size="small">🔄 Actualizar</Button>
      </Stack>
    );
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Button onClick={handleBack} variant="outlined" size="small">← Volver</Button>
        <Box>
          <Typography variant="h5">🔍 Consultar Código</Typography>
          <Typography variant="body2" color="text.secondary">Ingresa un código para consultar información detallada</Typography>
        </Box>
      </Stack>

      <form onSubmit={handleSubmit}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="flex-start" mb={2}>
          <TextField
            inputRef={inputRef}
            size="small"
            fullWidth
            value={codigo}
            onChange={e => setCodigo(e.target.value)}
            placeholder="Escanea o ingresa el código (12 o 15 dígitos)"
            disabled={loading}
            InputProps={{
              startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
              endAdornment: codigo ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setCodigo('')} aria-label="limpiar">✕</IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
          <Button type="submit" variant="contained" disabled={loading || !codigo.trim()}>
            {loading ? 'Buscando...' : '🔍 Buscar'}
          </Button>
        </Stack>
        {error && <Alert severity="error" sx={{ mb: 2 }}>⚠️ {error}</Alert>}
      </form>

      {result && (
        <Box mt={3}>
          {toggleError && (
            <Alert severity={toggleError.startsWith('✅') ? 'success' : 'error'} sx={{ mb: 2 }}>{toggleError}</Alert>
          )}
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" flexWrap="wrap" gap={1} alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="h6">{result.codigo}</Typography>
                <Typography variant="caption" color="text.secondary">🕒 Consultado {formatDate(result.timestamp)}</Typography>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={result.pkTipo === 'BOX' ? '📦 Caja' : '🚛 Pallet'} size="small" />
                <Chip label={result.estado} size="small" variant="outlined" />
                {result.pkTipo === 'PALLET' && (
                  <Chip label={result.palletStatus === 'abierto' ? '🔓 Abierto' : '🔒 Cerrado'} size="small" variant="outlined" />
                )}
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                <Chip size="small" label={`👤 Operario: ${result.operario || 'N/A'}`} variant="outlined" />
                <Chip size="small" label={`🏭 Empacadora: ${result.empacadora || 'N/A'}`} variant="outlined" />
                <Chip size="small" label={`📦 Formato: ${result.formato_caja || 'N/A'}`} variant="outlined" />
              </Stack>
            </CardContent>
          </Card>

          <Grid container spacing={2}>
            {result.producto && (
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>📋 Información del Producto</Typography>
                    <Typography variant="body2"><strong>ID:</strong> {result.producto.id}</Typography>
                    <Typography variant="body2"><strong>Nombre:</strong> {result.producto.nombre}</Typography>
                    {result.producto.descripcion && <Typography variant="body2"><strong>Descripción:</strong> {result.producto.descripcion}</Typography>}
                  </CardContent>
                </Card>
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>📅 Seguimiento</Typography>
                  <Typography variant="body2"><strong>Creado:</strong> {formatDate(result.fecha_registro)}</Typography>
                  <Typography variant="body2"><strong>Actualizado:</strong> {formatDate(result.scannedAt)}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>Acciones</Typography>
            {renderActionButtons(result)}
          </Box>
        </Box>
      )}

      {recentSearches.length > 0 && (
        <Box mt={3}>
          <Typography variant="subtitle1" gutterBottom>📝 Búsquedas Recientes</Typography>
          <List dense>
            {recentSearches.map((item, index) => (
              <ListItem key={`${item.codigo}-${index}`} disablePadding>
                <ListItemButton onClick={() => handleQuickSearch(item)}>
                  <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">{item.codigo}</Typography>
                    <Chip size="small" label={item.pkTipo === 'BOX' ? '📦' : '🚛'} />
                    <Typography variant="caption" color="text.secondary">{item.producto?.nombre || 'Producto sin nombre'}</Typography>
                    <Typography variant="caption">{formatDate(item.timestamp)}</Typography>
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default ConsultarCodigo;
