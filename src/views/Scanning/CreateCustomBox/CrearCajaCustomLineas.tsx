import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getErrorMessage } from '../../../utils/errorHandler';
import { submitCreateCustomBox } from '../../../api';
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  Alert,
} from '../../../components/ui';

const DEFAULT_UBICACION = 'PACKING';
const LABEL_UBICACION = 'Ubicación';
const LABEL_CANTIDAD = 'Cantidad (huevos)';
const LABEL_CODIGO = 'Código';
const BTN_AGREGAR = 'Agregar código';
const BTN_QUITAR = 'Quitar';
const BTN_SUBMIT = 'Crear caja';
const BTN_SUBMIT_LOADING = 'Creando...';
const ERROR_LINEA_CANTIDAD = 'La cantidad debe ser >= 0';
const ERROR_LINEA_CODIGO = 'El código no puede estar vacío';
const SUCCESS_DEFAULT = 'Caja custom creada exitosamente';

interface ExtraLine {
  id: string;
  codigo: string;
  cantidad: number;
}

function nextId(): string {
  return `line-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const CrearCajaCustomLineas: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const codigoCaja = (location.state as { codigoCaja?: string } | null)?.codigoCaja;

  const [cantidadPrimera, setCantidadPrimera] = useState<number>(0);
  const [extraLines, setExtraLines] = useState<ExtraLine[]>([]);
  const [ubicacion, setUbicacion] = useState(DEFAULT_UBICACION);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!codigoCaja || codigoCaja.trim().length === 0) {
      navigate('/crear-caja-custom', { replace: true });
    }
  }, [codigoCaja, navigate]);

  const handleBack = () => navigate('/crear-caja-custom');

  const addLine = () => {
    setExtraLines(prev => [...prev, { id: nextId(), codigo: '', cantidad: 0 }]);
  };

  const removeLine = (id: string) => {
    setExtraLines(prev => prev.filter(i => i.id !== id));
  };

  const updateLine = (id: string, field: 'codigo' | 'cantidad', value: string | number) => {
    setExtraLines(prev =>
      prev.map(i => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!codigoCaja || codigoCaja.trim().length === 0) return;

    const qty1 = Number(cantidadPrimera);
    if (Number.isNaN(qty1) || qty1 < 0) {
      setError(ERROR_LINEA_CANTIDAD);
      return;
    }

    const validExtra = extraLines.filter(i => i.codigo.trim() !== '');
    for (const item of validExtra) {
      const num = Number(item.cantidad);
      if (Number.isNaN(num) || num < 0) {
        setError(ERROR_LINEA_CANTIDAD);
        return;
      }
    }
    for (const item of extraLines) {
      if (item.codigo.trim() !== '' && Number.isNaN(Number(item.cantidad))) {
        setError(ERROR_LINEA_CANTIDAD);
        return;
      }
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const customInfo: Array<[string, number]> = [
      [codigoCaja.trim(), qty1],
      ...validExtra.map(i => [i.codigo.trim(), Number(i.cantidad)] as [string, number]),
    ];

    try {
      const result = await submitCreateCustomBox(
        codigoCaja.trim(),
        customInfo,
        ubicacion || DEFAULT_UBICACION
      );
      setSuccessMessage(result.mensaje || SUCCESS_DEFAULT);
      setCantidadPrimera(0);
      setExtraLines([]);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Error al crear la caja custom'));
    } finally {
      setLoading(false);
    }
  };

  const canSubmit =
    codigoCaja &&
    codigoCaja.trim().length > 0 &&
    !Number.isNaN(Number(cantidadPrimera)) &&
    Number(cantidadPrimera) >= 0;

  if (!codigoCaja || codigoCaja.trim().length === 0) {
    return null;
  }

  return (
    <Box>
      <Stack spacing={2} mb={2}>
        <Button variant="outlined" size="small" onClick={handleBack}>
          ← Volver
        </Button>
        <Typography variant="h5">Líneas (cantidad por código)</Typography>
        <Typography variant="body2" color="text.secondary">
          Código de caja: {codigoCaja}
        </Typography>
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
            label={LABEL_CANTIDAD}
            type="number"
            value={cantidadPrimera === 0 ? '' : cantidadPrimera}
            onChange={e => {
              const v = e.target.value;
              setCantidadPrimera(v === '' ? 0 : Number(v));
            }}
            placeholder="0"
            disabled={loading}
            fullWidth
            inputProps={{ min: 0, step: 1 }}
          />

          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            Más códigos (opcional)
          </Typography>
          {extraLines.map(item => (
            <Stack
              key={item.id}
              direction="row"
              spacing={1}
              alignItems="flex-start"
              flexWrap="wrap"
            >
              <TextField
                label={LABEL_CODIGO}
                value={item.codigo}
                onChange={e => updateLine(item.id, 'codigo', e.target.value)}
                placeholder="Código"
                disabled={loading}
                size="small"
                sx={{ flex: 1, minWidth: 100 }}
              />
              <TextField
                label={LABEL_CANTIDAD}
                type="number"
                value={item.cantidad === 0 ? '' : item.cantidad}
                onChange={e => {
                  const v = e.target.value;
                  updateLine(item.id, 'cantidad', v === '' ? 0 : Number(v));
                }}
                placeholder="0"
                disabled={loading}
                size="small"
                inputProps={{ min: 0, step: 1 }}
                sx={{ width: 120 }}
              />
              <Button
                type="button"
                variant="outlined"
                size="small"
                onClick={() => removeLine(item.id)}
                disabled={loading}
                sx={{ alignSelf: 'center', mt: 0.5 }}
              >
                {BTN_QUITAR}
              </Button>
            </Stack>
          ))}
          <Button
            type="button"
            variant="outlined"
            size="small"
            onClick={addLine}
            disabled={loading}
          >
            {BTN_AGREGAR}
          </Button>

          <TextField
            label={LABEL_UBICACION}
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
          {loading ? BTN_SUBMIT_LOADING : BTN_SUBMIT}
        </Button>
      </form>
    </Box>
  );
};

export default CrearCajaCustomLineas;
