import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScannedCodeContext } from '../context/ScannedCodeContext';
import { useScanContext } from '../context/ScanContext';
import { formatCodeForDisplay } from '../api';
import ReportIssueModal from '../components/ReportIssueModal/ReportIssueModal';
import { Box, Stack, Button, Card, CardContent, Typography } from '../components/ui';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: oldData } = useScannedCodeContext();
  const { data: scanData } = useScanContext();
  const [showReportModal, setShowReportModal] = useState(false);

  const handleRegistrarCaja = () => navigate('/registrar-caja');
  const handleReportClick = () => setShowReportModal(true);

  const renderData = () => {
    if (scanData) {
      return (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>Último Código Procesado</Typography>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" component="span">{formatCodeForDisplay(scanData.data?.codigo || '')}</Typography>
                <Typography variant="body2" color="text.secondary" component="span">
                  {scanData.data?.tipo === 'BOX' ? 'Caja' : 'Pallet'}
                </Typography>
              </Box>
              <Typography variant="body2"><strong>Ubicación:</strong> {scanData.data?.ubicacion}</Typography>
              <Typography variant="body2"><strong>Estado:</strong> {scanData.data?.estado ? scanData.data.estado.charAt(0).toUpperCase() + scanData.data.estado.slice(1) : 'Desconocido'}</Typography>
              <Typography variant="body2"><strong>Mensaje:</strong> {scanData.message}</Typography>
            </CardContent>
          </Card>
        </Box>
      );
    }
    if (oldData) {
      return (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>Último Código Escaneado</Typography>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>{formatCodeForDisplay(oldData.codigo)}</Typography>
              {oldData.producto && <Typography variant="body2"><strong>Producto:</strong> {oldData.producto.nombre}</Typography>}
              {oldData.ubicacion && <Typography variant="body2"><strong>Ubicación:</strong> {oldData.ubicacion.almacen} - {oldData.ubicacion.zona}</Typography>}
              <Typography variant="body2"><strong>Estado:</strong> {oldData.estado.charAt(0).toUpperCase() + oldData.estado.slice(1)}</Typography>
            </CardContent>
          </Card>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      <Stack direction="column" spacing={2} useFlexGap flexWrap="wrap">
        <Button variant="contained" onClick={handleRegistrarCaja} fullWidth>
          Escanear Nueva Caja
        </Button>
        <Button variant="outlined" onClick={() => navigate('/consultar-codigo')} fullWidth>
          Consultar Código
        </Button>
        <Button variant="outlined" onClick={() => navigate('/crear-caja-custom')} fullWidth>
          Crear Caja Custom
        </Button>
        <Button variant="outlined" onClick={() => navigate('/enviar-pallet-transito')} fullWidth>
          Enviar Pallet a Transito
        </Button>
        <Button variant="outlined" onClick={() => navigate('/enviar-carro-transito')} fullWidth>
          Enviar Carro a Transito
        </Button>
        <Button variant="outlined" onClick={() => navigate('/pallets-activos')} fullWidth>
          Pallets Activos
        </Button>
        <Button variant="outlined" onClick={() => navigate('/crear-pallet')} fullWidth>
          Crear Pallet
        </Button>
        <Button variant="outlined" onClick={handleReportClick} fullWidth>
          Registrar Problema
        </Button>
      </Stack>
      {renderData()}
      <ReportIssueModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} />
    </Box>
  );
};

export default Dashboard;
