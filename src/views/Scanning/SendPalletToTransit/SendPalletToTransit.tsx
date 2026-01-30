import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateScannedCode } from '../../../utils/validators';
import { getErrorMessage } from '../../../utils/errorHandler';
import { submitMovePallet } from '../../../api';
import { useScanMode } from '../../../hooks/useScanMode';
import {
  PALLET_CODE_LENGTH,
  TRANSIT_LOCATION,
} from '../../../api/inventoryConstants';
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  Alert,
} from '../../../components/ui';

const SendPalletToTransit: React.FC = () => {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { scanMode, toggleScanMode, inputRef } = useScanMode();

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
      const result = await submitMovePallet(cleanCode, TRANSIT_LOCATION);
      setSuccessMessage(result.message || 'Pallet movido exitosamente');
      setCodigo('');
      if (scanMode && inputRef.current) {
        inputRef.current.focus();
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Error al mover el pallet'));
    } finally {
      setLoading(false);
    }
  };

  const validation = validateScannedCode(codigo);
  const showValidationError = codigo.length > 0 && !validation.isValid;
  const showTypeError =
    codigo.length > 0 && validation.isValid && validation.type !== 'pallet';

  return (
    <Box>
      <Stack spacing={2} mb={2}>
        <Button variant="outlined" size="small" onClick={handleBack}>
          ← Volver
        </Button>
        <Typography variant="h5">Enviar Pallet a {TRANSIT_LOCATION}</Typography>
        <Typography variant="body2" color="text.secondary">
          Escanea o ingresa el código del pallet ({PALLET_CODE_LENGTH} dígitos)
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
          <Typography variant="body2">Pallet enviado a {TRANSIT_LOCATION}</Typography>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={1} mb={2}>
          <TextField
            inputRef={inputRef}
            label="Código de Pallet"
            value={codigo}
            onChange={e => setCodigo(e.target.value)}
            placeholder={
              scanMode
                ? 'Escanea códigos consecutivamente...'
                : `Escanea o ingresa código de ${PALLET_CODE_LENGTH} dígitos`
            }
            error={showValidationError || showTypeError}
            helperText={
              showValidationError
                ? validation.errorMessage
                : showTypeError
                  ? `Este código es de una caja. Solo se permiten códigos de pallet (${PALLET_CODE_LENGTH} dígitos).`
                  : codigo.length > 0 &&
                      validation.isValid &&
                      validation.type === 'pallet'
                    ? '✓ Código válido - Presiona Enter para enviar'
                    : undefined
            }
            disabled={loading}
            autoFocus
            inputProps={{ maxLength: PALLET_CODE_LENGTH }}
            fullWidth
          />
        </Stack>

        <Typography variant="body2" color="text.secondary" component="div" sx={{ mb: 2 }}>
          <strong>Ubicación destino:</strong> {TRANSIT_LOCATION} · Solo códigos de pallet ({PALLET_CODE_LENGTH} dígitos) ·
          Presiona Enter para procesar
          {scanMode ? (
            <span> · Modo Scanner: campo siempre enfocado</span>
          ) : (
            <span> · Activa Modo Scanner para escaneo con dispositivo físico</span>
          )}
        </Typography>

        <Button
          type="submit"
          variant="contained"
          disabled={loading || !codigo.trim()}
          fullWidth
        >
          {loading ? 'Enviando pallet...' : `Enviar a ${TRANSIT_LOCATION}`}
        </Button>
      </form>
    </Box>
  );
};

export default SendPalletToTransit;
