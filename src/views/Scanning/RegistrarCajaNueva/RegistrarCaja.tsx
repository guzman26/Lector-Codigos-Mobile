import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateScannedCode } from '../../../utils/validators';
import { getErrorMessage } from '../../../utils/errorHandler';
import { submitBoxRegistration } from '../../../api';
import { useScanMode } from '../../../hooks/useScanMode';
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  Alert,
} from '../../../components/ui';

const TITLE = 'Escanear Nueva Caja';
const DESCRIPTION = 'Escanea o ingresa el código de la caja (16 dígitos) y el producto.';
const DEFAULT_UBICACION = 'PACKING';

const RegistrarCaja: React.FC = () => {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [producto, setProducto] = useState('');
  const [ubicacion, setUbicacion] = useState(DEFAULT_UBICACION);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { scanMode, toggleScanMode, inputRef } = useScanMode();

  const handleBack = () => navigate('/dashboard');

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const cleanCode = codigo.trim();
    if (!cleanCode) {
      setError('El código es obligatorio');
      return;
    }

    const validation = validateScannedCode(cleanCode);
    if (!validation.isValid || validation.type !== 'box') {
      setError(
        validation.errorMessage || 'El código debe ser de caja (16 dígitos)'
      );
      return;
    }

    if (!producto.trim()) {
      setError('El producto es obligatorio');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await submitBoxRegistration({
        codigo: cleanCode,
        producto: producto.trim(),
        ubicacion: ubicacion || DEFAULT_UBICACION,
      });
      setSuccessMessage(result.mensaje || 'Caja registrada exitosamente');
      setCodigo('');
      if (scanMode && inputRef.current) {
        inputRef.current.focus();
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Error al registrar la caja'));
    } finally {
      setLoading(false);
    }
  };

  const validation = validateScannedCode(codigo);
  const showCodeError =
    codigo.length > 0 && (!validation.isValid || validation.type !== 'box');
  const canSubmit =
    codigo.trim().length > 0 &&
    producto.trim().length > 0 &&
    validation.isValid &&
    validation.type === 'box';

  return (
    <Box>
      <Stack spacing={2} mb={2}>
        <Button variant="outlined" size="small" onClick={handleBack}>
          ← Volver
        </Button>
        <Typography variant="h5">{TITLE}</Typography>
        <Typography variant="body2" color="text.secondary">
          {DESCRIPTION}
        </Typography>

        <Button
          variant={scanMode ? 'contained' : 'outlined'}
          size="small"
          onClick={toggleScanMode}
          disabled={loading}
        >
          {scanMode ? '📱 Modo Scanner: ON' : '⚡ Modo Scanner: OFF'}
        </Button>
        {scanMode && (
          <Typography variant="caption" color="text.secondary">
            🔍 Modo scanner activo - El campo código permanecerá enfocado
          </Typography>
        )}
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="subtitle2">{successMessage}</Typography>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2} mb={2}>
          <TextField
            inputRef={inputRef}
            label="Código de caja"
            value={codigo}
            onChange={e => setCodigo(e.target.value)}
            placeholder={
              scanMode
                ? 'Escanea el código...'
                : 'Escanea o ingresa 16 dígitos'
            }
            error={showCodeError}
            helperText={
              showCodeError
                ? validation.errorMessage ||
                  'Solo se permiten códigos de caja (16 dígitos)'
                : undefined
            }
            disabled={loading}
            autoFocus
            inputProps={{ maxLength: 16 }}
            fullWidth
          />
          <TextField
            label="Producto"
            value={producto}
            onChange={e => setProducto(e.target.value)}
            placeholder="Nombre del producto"
            disabled={loading}
            fullWidth
            required
          />
          <TextField
            label="Ubicación"
            value={ubicacion}
            onChange={e => setUbicacion(e.target.value)}
            disabled={loading}
            fullWidth
          />
        </Stack>

        <Button
          type="submit"
          variant="contained"
          disabled={loading || !canSubmit}
          fullWidth
        >
          {loading ? 'Registrando...' : 'Registrar caja'}
        </Button>
      </form>
    </Box>
  );
};

export default RegistrarCaja;
