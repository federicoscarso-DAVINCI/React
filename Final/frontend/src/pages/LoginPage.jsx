import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const { login, cargando } = useAuth();
  const { mostrarToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');

  function validar() {
    const nuevosErrores = {};
    if (!form.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nuevosErrores.email = 'Ingresá un email válido';
    }
    if (!form.password) {
      nuevosErrores.password = 'La contraseña es obligatoria';
    } else if (form.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorGeneral('');
    if (!validar()) return;

    const resultado = await login(form.email, form.password);
    if (resultado.ok) {
      mostrarToast('¡Bienvenido/a de nuevo!', 'exito');
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } else {
      setErrorGeneral(resultado.mensaje);
    }
  }

  return (
    <div className="page page-centered">
      <form className="card form" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>
        {errorGeneral && <p className="form-error-general">{errorGeneral}</p>}

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="admin@vetcare.com"
          />
          {errores.email && <span className="field-error">{errores.email}</span>}
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
          {errores.password && <span className="field-error">{errores.password}</span>}
        </label>

        <button className="btn btn-primary" type="submit" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p className="form-hint">
          Usuario de prueba: <strong>admin@vetcare.com</strong> / <strong>admin123</strong>
        </p>
      </form>
    </div>
  );
}
