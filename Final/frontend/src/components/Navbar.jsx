import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { estaAutenticado, usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">🐾 VetCare</NavLink>
      </div>
      <div className="navbar-links">
        <NavLink to="/" end>
          Inicio
        </NavLink>
        {estaAutenticado && (
          <>
            <NavLink to="/mascotas">Mascotas</NavLink>
            <NavLink to="/turnos">Turnos</NavLink>
          </>
        )}
      </div>
      <div className="navbar-user">
        {estaAutenticado ? (
          <>
            <span className="navbar-username">
              {usuario?.nombre} {usuario?.rol === 'admin' && <span className="badge">admin</span>}
            </span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <NavLink to="/login" className="btn btn-primary">
            Ingresar
          </NavLink>
        )}
      </div>
    </nav>
  );
}
