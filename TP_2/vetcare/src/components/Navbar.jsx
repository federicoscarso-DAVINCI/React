import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SPECIES_EMOJI = { Perro: '🐕', Gato: '🐈', Conejo: '🐇', Pez: '🐠', Ave: '🐦' };

function Navbar() {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentUser) return null;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function isActive(path) {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🐾 VetCare
      </Link>

      <div className="navbar-links">
        <Link to="/" className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}>
          Inicio
        </Link>
        <Link to="/mascotas" className={`nav-link ${isActive('/mascotas') ? 'active' : ''}`}>
          Mascotas
        </Link>
        <Link to="/turnos" className={`nav-link ${isActive('/turnos') ? 'active' : ''}`}>
          Turnos
        </Link>
        {isAdmin && (
          <Link to="/usuarios" className={`nav-link ${isActive('/usuarios') ? 'active' : ''}`}>
            Usuarios
          </Link>
        )}
      </div>

      <div className="navbar-user">
        <span className="user-info">
          <span className="user-name">{currentUser.nombre}</span>
          <span className={`role-badge ${isAdmin ? 'badge-admin' : 'badge-user'}`}>
            {isAdmin ? 'Admin' : 'Usuario'}
          </span>
        </span>
        <button className="btn-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
