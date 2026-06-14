import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import MascotasPage from './pages/MascotasPage';
import MascotaDetailPage from './pages/MascotaDetailPage';
import MascotaFormPage from './pages/MascotaFormPage';
import TurnosPage from './pages/TurnosPage';
import TurnoFormPage from './pages/TurnoFormPage';
import UsuariosPage from './pages/UsuariosPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
            <Route path="/mascotas" element={<PrivateRoute><MascotasPage /></PrivateRoute>} />
            <Route path="/mascotas/nueva" element={<PrivateRoute><MascotaFormPage /></PrivateRoute>} />
            <Route path="/mascotas/:id" element={<PrivateRoute><MascotaDetailPage /></PrivateRoute>} />
            <Route path="/mascotas/:id/editar" element={<PrivateRoute><MascotaFormPage /></PrivateRoute>} />
            <Route path="/turnos" element={<PrivateRoute><TurnosPage /></PrivateRoute>} />
            <Route path="/turnos/nuevo" element={<PrivateRoute><TurnoFormPage /></PrivateRoute>} />
            <Route path="/turnos/:id/editar" element={<PrivateRoute><TurnoFormPage /></PrivateRoute>} />
            <Route path="/usuarios" element={<PrivateRoute adminOnly><UsuariosPage /></PrivateRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
