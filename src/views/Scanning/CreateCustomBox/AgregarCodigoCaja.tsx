import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateScannedCode } from '../../../utils/validators';
import { useScanMode } from '../../../hooks/useScanMode';
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  Alert,
} from '../../../components/ui';

const TITLE = 'Agregar código de caja';
const DESCRIPTION = 'Escanea o ingresa el código de caja (16 dígitos). Este será el primer código de la caja custom.';

const AgregarCodigoCaja: React.FC = () => {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { scanMode, toggleScanMode, inputRef } = useScanMode();

  const handleBack = () => navigate('/dashboard');

  const handleSiguiente = () => {
    const cleanCode = codigo.trim();
    if (!cleanCode) {
      setError('El código es obligatorio');
      return;
    }

    const validation = validateScannedCode(cleanCode);
    if (!validation.isValid || validation.type !== 'box') {
      setError(validation.errorMessage || 'El código debe ser de caja (16 dígitos)');
      return;
    }

    setError(null);
    navigate('/crear-caja-custom/lineas', { state: { codigoCaja: cleanCode } });
  };

  const validation = validateScannedCode(codigo);
  const showError = codigo.length > 0 && (!validation.isValid || validation.type !== 'box');
  const canSiguiente = codigo.trim().length > 0 && validation.isValid && validation.type === 'box';

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
          onClick={() => toggleScanMode()}
        >
          {scanMode ? '📱 Modo Scanner: ON' : '⚡ Modo Scanner: OFF'}
        </Button>
        {scanMode && (
          <Typography variant="caption" color="text.secondary">
            🔍 El campo permanecerá enfocado para escaneo
          </Typography>
        )}
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Stack spacing={2} mb={2}>
        <TextField
          inputRef={inputRef}
          label="Código de caja"
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
          placeholder={scanMode ? 'Escanea...' : '16 dígitos'}
          error={showError}
          helperText={
            showError
              ? validation.errorMessage || 'Solo códigos de caja (16 dígitos)'
              : undefined
          }
          autoFocus
          inputProps={{ maxLength: 16 }}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleSiguiente}
          disabled={!canSiguiente}
          fullWidth
        >
          Siguiente
        </Button>
      </Stack>
    </Box>
  );
};

export default AgregarCodigoCaja;
