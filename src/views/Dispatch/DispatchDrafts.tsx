import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getDraftDispatches,
  updateDispatchPallets,
  formatCodeForDisplay,
} from '../../api';
import type { DispatchRecord } from '../../api/endpoints';
import { validateScannedCode } from '../../utils/validators';
import { getErrorMessage } from '../../utils/errorHandler';
import { useScanMode } from '../../hooks/useScanMode';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '../../components/ui';

const DispatchDrafts: React.FC = () => {
  const navigate = useNavigate();
  const { scanMode, toggleScanMode, inputRef } = useScanMode();

  const [drafts, setDrafts] = useState<DispatchRecord[]>([]);
  const [selectedDraftId, setSelectedDraftId] = useState<string>('');
  const [palletCode, setPalletCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedDraft = useMemo(
    () => drafts.find((item) => item.id === selectedDraftId),
    [drafts, selectedDraftId]
  );

  const loadDrafts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getDraftDispatches({ limit: 50 });
      if (!response.success || !response.data) {
        throw new Error(response.error || 'No se pudieron cargar los borradores');
      }
      const nextDrafts = response.data.items || [];
      setDrafts(nextDrafts);
      if (!nextDrafts.some((item) => item.id === selectedDraftId)) {
        setSelectedDraftId(nextDrafts[0]?.id || '');
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Error al cargar borradores'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDrafts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddPallet = async (event?: React.FormEvent) => {
    event?.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!selectedDraft) {
      setError('Selecciona un borrador antes de agregar pallets');
      return;
    }

    const cleanedCode = palletCode.trim();
    const validation = validateScannedCode(cleanedCode);
    if (!validation.isValid || validation.type !== 'pallet') {
      setError(validation.errorMessage || 'Codigo de pallet invalido');
      return;
    }

    const currentPallets = Array.isArray(selectedDraft.pallets)
      ? selectedDraft.pallets
      : [];

    if (currentPallets.includes(cleanedCode)) {
      setError('El pallet ya esta agregado en este borrador');
      return;
    }

    setIsSaving(true);
    try {
      const updatedPallets = [...currentPallets, cleanedCode];
      const response = await updateDispatchPallets(
        selectedDraft.id,
        updatedPallets,
        'mobile'
      );
      if (!response.success || !response.data) {
        throw new Error(response.error || 'No se pudo actualizar el borrador');
      }

      const updatedDraft = response.data;
      setDrafts((prev) =>
        prev.map((item) =>
          item.id === selectedDraft.id ? { ...item, ...updatedDraft } : item
        )
      );
      setPalletCode('');
      setSuccessMessage(
        `Pallet agregado a ${selectedDraft.folio}. Total: ${updatedPallets.length}`
      );
      if (scanMode && inputRef.current) {
        inputRef.current.focus();
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Error al agregar pallet'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} mb={2}>
        <Button variant="outlined" size="small" onClick={() => navigate('/dashboard')}>
          Volver
        </Button>
        <Button variant="outlined" size="small" onClick={() => void loadDrafts()} disabled={isLoading}>
          {isLoading ? 'Actualizando...' : 'Refrescar'}
        </Button>
      </Stack>

      <Typography variant="h5" gutterBottom>
        Borradores de despacho
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Selecciona un borrador y agrega los pallets escaneados.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      <Stack spacing={2} sx={{ mb: 3 }}>
        {drafts.map((draft) => {
          const isSelected = draft.id === selectedDraftId;
          return (
            <Card key={draft.id} variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                  <Box>
                    <Typography variant="subtitle1">{draft.folio}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Pallets: {Array.isArray(draft.pallets) ? draft.pallets.length : 0}
                    </Typography>
                  </Box>
                  <Button
                    variant={isSelected ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setSelectedDraftId(draft.id)}
                  >
                    {isSelected ? 'Seleccionado' : 'Seleccionar'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      {drafts.length === 0 && !isLoading && (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          No hay borradores DRAFT disponibles.
        </Typography>
      )}

      <Button
        variant={scanMode ? 'contained' : 'outlined'}
        size="small"
        onClick={toggleScanMode}
        disabled={isSaving}
        sx={{ mb: 2 }}
      >
        {scanMode ? 'Modo Scanner: ON' : 'Modo Scanner: OFF'}
      </Button>

      <form onSubmit={handleAddPallet}>
        <Stack spacing={1}>
          <TextField
            inputRef={inputRef}
            label="Codigo de pallet"
            value={palletCode}
            onChange={(e) => setPalletCode(e.target.value)}
            placeholder="Escanea o ingresa codigo de pallet"
            disabled={isSaving || !selectedDraft}
            fullWidth
            autoFocus
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isSaving || !selectedDraft || !palletCode.trim()}
            fullWidth
          >
            {isSaving ? 'Agregando pallet...' : 'Agregar pallet al borrador'}
          </Button>
        </Stack>
      </form>

      {selectedDraft && Array.isArray(selectedDraft.pallets) && selectedDraft.pallets.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Pallets cargados en {selectedDraft.folio}
          </Typography>
          <Stack spacing={1}>
            {selectedDraft.pallets.map((code) => (
              <Typography key={code} variant="body2">
                - {formatCodeForDisplay(code)}
              </Typography>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default DispatchDrafts;
