import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('vetcare_usuario');
    return guardado ? JSON.parse(guardado) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('vetcare_token'));
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('vetcare_token', token);
    } else {
      localStorage.removeItem('vetcare_token');
    }
  }, [token]);

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('vetcare_usuario', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('vetcare_usuario');
    }
  }, [usuario]);

  async function login(email, password) {
    setCargando(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setToken(data.token);
      setUsuario(data.usuario);
      return { ok: true };
    } catch (error) {
      return { ok: false, mensaje: error.response?.data?.mensaje || 'Error al iniciar sesión' };
    } finally {
      setCargando(false);
    }
  }

  function logout() {
    setToken(null);
    setUsuario(null);
  }

  const value = {
    usuario,
    token,
    cargando,
    estaAutenticado: Boolean(token),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
