import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  function validate() {
    const errs = {};
    if (!form.email.trim()) errs.email = 'El email es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Ingresá un email válido';
    if (!form.password.trim()) errs.password = 'La contraseña es obligatoria';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const ok = login(form.email, form.password);
    if (!ok) {
      setLoginError('Email o contraseña incorrectos');
    } else {
      navigate('/');
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setLoginError('');
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🐾</div>
          <h1 className="login-title">VetCare</h1>
          <p className="login-subtitle">Clínica Veterinaria</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="tu@email.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              className={`form-input ${errors.password ? 'input-error' : ''}`}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          {loginError && (
            <div className="alert alert-danger">{loginError}</div>
          )}

          <button type="submit" className="btn btn-primary btn-block">
            Iniciar sesión
          </button>
        </form>

        <div className="login-hint">
          <p className="hint-title">Usuarios de prueba:</p>
          <div className="hint-item">
            <strong>Admin:</strong> admin@vetcare.com / admin123
          </div>
          <div className="hint-item">
            <strong>Usuario:</strong> juan@mail.com / juan123
          </div>
          <div className="hint-item">
            <strong>Usuario:</strong> maria@mail.com / maria123
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
