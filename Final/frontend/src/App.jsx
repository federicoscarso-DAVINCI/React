import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MascotaFormPage from './pages/MascotaFormPage';
import MascotasPage from './pages/MascotasPage';
import NotFoundPage from './pages/NotFoundPage';
import TurnoFormPage from './pages/TurnoFormPage';
import TurnosPage from './pages/TurnosPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />

              <Route element={<PrivateRoute />}>
                <Route path="/mascotas" element={<MascotasPage />} />
                <Route path="/mascotas/nueva" element={<MascotaFormPage />} />
                <Route path="/mascotas/:id/editar" element={<MascotaFormPage />} />

                <Route path="/turnos" element={<TurnosPage />} />
                <Route path="/turnos/nuevo" element={<TurnoFormPage />} />
                <Route path="/turnos/:id/editar" element={<TurnoFormPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
