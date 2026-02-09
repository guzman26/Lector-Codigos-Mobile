import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitCreateCart } from '../../../api';
import { getErrorMessage } from '../../../utils/errorHandler';
import { useScanMode } from '../../../hooks/useScanMode';
import {
  CART_CODE_LENGTH,
  VALID_INVENTORY_LOCATIONS,
} from '../../../api/inventoryConstants';
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '../../../components/ui';
import type { SelectChangeEvent } from '../../../components/ui';

const TITLE = 'Agregar Carro';
const DESCRIPTION = `Escanea o ingresa el código del carro (${CART_CODE_LENGTH} dígitos) para registrarlo en inventario.`;
const DEFAULT_UBICACION = 'PACKING';

function isValidCartBarcode(code: string): boolean {
  const cleanCode = (code || '').trim();
  if (!new RegExp(`^\\d{${CART_CODE_LENGTH}}$`).test(cleanCode)) {
    return false;
  }

  // Cart format digit: 4, 5 or 6.
  return ['4', '5', '6'].includes(cleanCode.charAt(11));
}

const CreateCartForm: React.FC = () => {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [ubicacion, setUbicacion] = useState(DEFAULT_UBICACION);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const { scanMode, toggleScanMode, inputRef } = useScanMode();

  const handleBack = () => navigate('/dashboard');

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const cleanCode = codigo.trim();
    if (!cleanCode) {
      setError('El código es obligatorio');
      return;
    }

    if (!isValidCartBarcode(cleanCode)) {
      setError('El código debe ser de carro (16 dígitos, formato 4/5/6)');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setCreatedCode(null);

    try {
      const result = await submitCreateCart(cleanCode, ubicacion);
      setSuccessMessage(result.mensaje || 'Carro creado exitosamente');
      setCreatedCode(result.codigo || null);
      setCodigo('');
      if (scanMode && inputRef.current) {
        inputRef.current.focus();
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Error al crear el carro'));
    } finally {
      setLoading(false);
    }
  };

  const showValidationError = codigo.length > 0 && !isValidCartBarcode(codigo);
  const canSubmit = codigo.trim().length > 0 && !showValidationError;

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
            🔍 Modo scanner activo - El campo permanecerá enfocado para escaneo consecutivo
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
          {createdCode && (
            <Typography variant="body2">
              Código creado: <strong>{createdCode}</strong>
            </Typography>
          )}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2} mb={2}>
          <TextField
            inputRef={inputRef}
            label="Código de carro"
            value={codigo}
            onChange={e => setCodigo(e.target.value)}
            placeholder={
              scanMode ? 'Escanea códigos consecutivamente...' : 'Escanea o ingresa 16 dígitos'
            }
            error={showValidationError}
            helperText={
              showValidationError
                ? 'Solo se permiten códigos de carro válidos (16 dígitos, formato 4/5/6)'
                : 'Se usará el código base para registrar el carro'
            }
            disabled={loading}
            autoFocus
            inputProps={{ maxLength: CART_CODE_LENGTH }}
            fullWidth
          />

          <FormControl fullWidth size="small" disabled={loading}>
            <InputLabel>Ubicación</InputLabel>
            <Select
              value={ubicacion}
              label="Ubicación"
              onChange={(e: SelectChangeEvent<string>) => setUbicacion(e.target.value)}
            >
              {VALID_INVENTORY_LOCATIONS.map(location => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Button type="submit" variant="contained" disabled={loading || !canSubmit} fullWidth>
          {loading ? 'Agregando carro...' : 'Agregar carro'}
        </Button>
      </form>
    </Box>
  );
};

export default CreateCartForm;
