import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const STATUS_CONFIG = {
  pendiente: { label: 'Pendiente', className: 'badge-warning' },
  confirmado: { label: 'Confirmado', className: 'badge-success' },
  cancelado: { label: 'Cancelado', className: 'badge-danger' },
};

function HomePage() {
  const { currentUser, isAdmin } = useAuth();
  const { mascotas, turnos, usuarios } = useData();

  const today = new Date().toISOString().split('T')[0];

  const misMascotas = isAdmin ? mascotas : mascotas.filter(m => m.propietarioId === currentUser.id);
  const misTurnos = isAdmin ? turnos : turnos.filter(t => t.propietarioId === currentUser.id);

  const turnosHoy = misTurnos.filter(t => t.fecha === today);
  const turnosPendientes = misTurnos.filter(t => t.estado === 'pendiente');
  const turnosConfirmados = misTurnos.filter(t => t.estado === 'confirmado');

  const proximosTurnos = [...misTurnos]
    .filter(t => t.fecha >= today)
    .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
    .slice(0, 5);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Bienvenido, {currentUser.nombre.split(' ')[0]} 👋
          </h1>
          <p className="page-subtitle">
            {isAdmin ? 'Panel de administración' : 'Panel de usuario'}
          </p>
        </div>
        <div className="header-actions">
          <Link to="/mascotas/nueva" className="btn btn-outline">
            + Nueva mascota
          </Link>
          <Link to="/turnos/nuevo" className="btn btn-primary">
            + Nuevo turno
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">🐾</span>
          <div>
            <p className="stat-value">{misMascotas.length}</p>
            <p className="stat-label">{isAdmin ? 'Mascotas registradas' : 'Mis mascotas'}</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📅</span>
          <div>
            <p className="stat-value">{misTurnos.length}</p>
            <p className="stat-label">{isAdmin ? 'Turnos totales' : 'Mis turnos'}</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⏳</span>
          <div>
            <p className="stat-value">{turnosPendientes.length}</p>
            <p className="stat-label">Pendientes</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <div>
            <p className="stat-value">{turnosConfirmados.length}</p>
            <p className="stat-label">Confirmados</p>
          </div>
        </div>
        {isAdmin && (
          <div className="stat-card">
            <span className="stat-icon">👥</span>
            <div>
              <p className="stat-value">{usuarios.filter(u => u.rol === 'usuario').length}</p>
              <p className="stat-label">Clientes</p>
            </div>
          </div>
        )}
        {isAdmin && (
          <div className="stat-card">
            <span className="stat-icon">📋</span>
            <div>
              <p className="stat-value">{turnosHoy.length}</p>
              <p className="stat-label">Turnos hoy</p>
            </div>
          </div>
        )}
      </div>

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Próximos turnos</h2>
          <Link to="/turnos" className="link-ver-todos">Ver todos →</Link>
        </div>

        {proximosTurnos.length === 0 ? (
          <div className="empty-state">
            <p>No hay turnos próximos.</p>
            <Link to="/turnos/nuevo" className="btn btn-primary">Agendar turno</Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Mascota</th>
                  <th>Motivo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {proximosTurnos.map(turno => {
                  const mascota = mascotas.find(m => m.id === turno.mascotaId);
                  const status = STATUS_CONFIG[turno.estado];
                  const fecha = new Date(turno.fecha + 'T00:00:00').toLocaleDateString('es-AR', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  });
                  return (
                    <tr key={turno.id}>
                      <td>{fecha}</td>
                      <td>{turno.hora}</td>
                      <td>{mascota?.nombre ?? '—'}</td>
                      <td>{turno.motivo}</td>
                      <td>
                        <span className={`badge ${status?.className}`}>
                          {status?.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">{isAdmin ? 'Mascotas registradas' : 'Mis mascotas'}</h2>
          <Link to="/mascotas" className="link-ver-todos">Ver todas →</Link>
        </div>

        {misMascotas.length === 0 ? (
          <div className="empty-state">
            <p>No hay mascotas registradas.</p>
            <Link to="/mascotas/nueva" className="btn btn-primary">Agregar mascota</Link>
          </div>
        ) : (
          <div className="mascotas-preview-grid">
            {misMascotas.slice(0, 4).map(m => {
              const emoji = { Perro: '🐕', Gato: '🐈', Conejo: '🐇', Pez: '🐠', Ave: '🐦' }[m.especie] || '🐾';
              return (
                <Link key={m.id} to={`/mascotas/${m.id}`} className="mascota-preview-card">
                  <span className="preview-emoji">{emoji}</span>
                  <span className="preview-name">{m.nombre}</span>
                  <span className="preview-species">{m.especie}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
