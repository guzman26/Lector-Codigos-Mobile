import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../../../utils/errorHandler';
import { submitMoveCart } from '../../../api';
import { useScanMode } from '../../../hooks/useScanMode';
import {
  CART_CODE_LENGTH,
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

const TITLE = 'Enviar Carro a TRANSITO';
const DESCRIPTION = `Escanea o ingresa el código del carro (${CART_CODE_LENGTH} dígitos)`;
const LABEL = 'Código de Carro';
const PLACEHOLDER_SCAN = 'Escanea códigos consecutivamente...';
const PLACEHOLDER_MANUAL = `Escanea o ingresa código de ${CART_CODE_LENGTH} dígitos`;
const ERROR_INVALID_CODE = `El código debe tener ${CART_CODE_LENGTH} dígitos numéricos`;
const SUCCESS_DEFAULT = 'Carro movido exitosamente';
const SUCCESS_DEST = 'Carro enviado a TRANSITO';
const SUBMIT_LABEL = 'Enviar a TRANSITO';
const SUBMIT_LOADING = 'Enviando carro...';
const ERROR_DEFAULT = 'Error al mover el carro';
const HELPER_VALID = '✓ Código válido - Presiona Enter para enviar';

const cartCodeRegex = new RegExp(`^\\d{${CART_CODE_LENGTH}}$`);

function isValidCartCode(code: string): boolean {
  return cartCodeRegex.test(code.trim());
}

const SendCartToTransit: React.FC = () => {
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

    if (!isValidCartCode(cleanCode)) {
      setError(ERROR_INVALID_CODE);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await submitMoveCart(cleanCode, TRANSIT_LOCATION);
      setSuccessMessage(result.message || SUCCESS_DEFAULT);
      setCodigo('');
      if (scanMode && inputRef.current) {
        inputRef.current.focus();
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, ERROR_DEFAULT));
    } finally {
      setLoading(false);
    }
  };

  const showValidationError = codigo.length > 0 && !isValidCartCode(codigo);
  const isValid = codigo.length > 0 && isValidCartCode(codigo);

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
            🔍 Modo scanner activo - El campo permanecerá enfocado para escaneo
            consecutivo
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
          <Typography variant="body2">{SUCCESS_DEST}</Typography>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={1} mb={2}>
          <TextField
            inputRef={inputRef}
            label={LABEL}
            value={codigo}
            onChange={e => setCodigo(e.target.value)}
            placeholder={
              scanMode ? PLACEHOLDER_SCAN : PLACEHOLDER_MANUAL
            }
            error={showValidationError}
            helperText={
              showValidationError
                ? ERROR_INVALID_CODE
                : isValid
                  ? HELPER_VALID
                  : undefined
            }
            disabled={loading}
            autoFocus
            inputProps={{ maxLength: CART_CODE_LENGTH }}
            fullWidth
          />
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          component="div"
          sx={{ mb: 2 }}
        >
          <strong>Ubicación destino:</strong> {TRANSIT_LOCATION} · Solo códigos
          de carro ({CART_CODE_LENGTH} dígitos) · Presiona Enter para procesar
          {scanMode ? (
            <span> · Modo Scanner: campo siempre enfocado</span>
          ) : (
            <span>
              {' '}
              · Activa Modo Scanner para escaneo con dispositivo físico
            </span>
          )}
        </Typography>

        <Button
          type="submit"
          variant="contained"
          disabled={loading || !codigo.trim()}
          fullWidth
        >
          {loading ? SUBMIT_LOADING : SUBMIT_LABEL}
        </Button>
      </form>
    </Box>
  );
};

export default SendCartToTransit;
