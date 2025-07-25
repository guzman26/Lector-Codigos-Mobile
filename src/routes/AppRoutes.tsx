import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../views/Dashboard';
import Configuracion from '../views/Configuracion';
import Historial from '../views/Historial';
import RegistrarCaja from '../views/Scanning/RegistrarCajaNueva/RegistrarCaja';
import ConsultarCodigo from '../views/Scanning/ConsultarCodigo/ConsultarCodigo';
import CrearPallet from '../views/Scanning/CreatePalletForm/CreatePalletForm';
import CreateCustomBox from '../views/Scanning/CreateCustomBox/CreateCustomBox';
import SendPalletToTransit from '../views/Scanning/SendPalletToTransit/SendPalletToTransit';


const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Default route redirects to dashboard */}
          <Route path='/' element={<Navigate to='/dashboard' replace />} />

          {/* Dashboard route */}
          <Route path='/dashboard' element={<Dashboard />} />

          {/* Configuration route */}
          <Route path='/configuracion' element={<Configuracion />} />

          {/* History route */}
          <Route path='/historial' element={<Historial />} />

          {/* Register new box route */}
          <Route path='/registrar-caja' element={<RegistrarCaja />} />

          {/* Consultar código route */}
          <Route path='/consultar-codigo' element={<ConsultarCodigo />} />

          {/* Crear pallet route */}
          <Route path='/crear-pallet' element={<CrearPallet />} />

          {/* Crear caja custom route */}
          <Route path='/crear-caja-custom' element={<CreateCustomBox />} />

          {/* Enviar pallet a TRANSITO */}
          <Route path='/enviar-pallet-transito' element={<SendPalletToTransit />} />

          {/* Future routes can be added here */}
          {/* <Route path="/scanner" element={<Scanner />} /> */}

          {/* Catch all route - redirect to dashboard */}
          <Route path='*' element={<Navigate to='/dashboard' replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRoutes;
