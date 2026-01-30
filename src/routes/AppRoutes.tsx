import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../views/Dashboard';
import Configuracion from '../views/Configuracion';
import ConsultarCodigo from '../views/Scanning/ConsultarCodigo/ConsultarCodigo';
import CreatePalletForm from '../views/Scanning/CreatePalletForm/CreatePalletForm';
import PalletsList from '../views/Scanning/PalletsList/PalletsList';
import SendPalletToTransit from '../views/Scanning/SendPalletToTransit/SendPalletToTransit';
import SendCartToTransit from '../views/Scanning/SendCartToTransit';
import AgregarCodigoCaja from '../views/Scanning/CreateCustomBox/AgregarCodigoCaja';
import CrearCajaCustomLineas from '../views/Scanning/CreateCustomBox/CrearCajaCustomLineas';
import RegistrarCaja from '../views/Scanning/RegistrarCajaNueva';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="/consultar-codigo" element={<ConsultarCodigo />} />
          <Route path="/registrar-caja" element={<RegistrarCaja />} />
          <Route path="/crear-caja-custom" element={<AgregarCodigoCaja />} />
          <Route path="/crear-caja-custom/lineas" element={<CrearCajaCustomLineas />} />
          <Route path="/crear-pallet" element={<CreatePalletForm />} />
          <Route path="/pallets-activos" element={<PalletsList />} />
          <Route path="/enviar-pallet-transito" element={<SendPalletToTransit />} />
          <Route path="/enviar-carro-transito" element={<SendCartToTransit />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRoutes;
