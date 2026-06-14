import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import AppointmentCard from '../components/AppointmentCard';

const SPECIES_EMOJI = {
  Perro: '🐕', Gato: '🐈', Conejo: '🐇', Pez: '🐠', Ave: '🐦',
};

const STATUS_CONFIG = {
  pendiente: { label: 'Pendiente', className: 'badge-warning' },
  confirmado: { label: 'Confirmado', className: 'badge-success' },
  cancelado: { label: 'Cancelado', className: 'badge-danger' },
};

function MascotaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const { mascotas, turnos, usuarios, deleteMascota, deleteTurno } = useData();

  const mascota = mascotas.find(m => m.id === Number(id));

  if (!mascota) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p className="empty-title">Mascota no encontrada</p>
          <Link to="/mascotas" className="btn btn-primary">Volver a mascotas</Link>
        </div>
      </div>
    );
  }

  const canEdit = isAdmin || mascota.propietarioId === currentUser?.id;
  const propietario = usuarios.find(u => u.id === mascota.propietarioId);
  const emoji = SPECIES_EMOJI[mascota.especie] || '🐾';

  const mascotaTurnos = turnos
    .filter(t => t.mascotaId === mascota.id)
    .sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora));

  function handleDeleteMascota() {
    if (window.confirm(`¿Eliminar a ${mascota.nombre}? También se eliminarán sus turnos.`)) {
      deleteMascota(mascota.id);
      navigate('/mascotas');
    }
  }

  function handleDeleteTurno(turnoId) {
    if (window.confirm('¿Eliminar este turno?')) {
      deleteTurno(turnoId);
    }
  }

  return (
    <div className="page-container">
      <div className="breadcrumb">
        <Link to="/mascotas">Mascotas</Link> / {mascota.nombre}
      </div>

      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-card">
            <div className="detail-card-header">
              <div className="detail-hero">
                <span className="detail-emoji">{emoji}</span>
                <div>
                  <h1 className="detail-name">{mascota.nombre}</h1>
                  <p className="detail-species">{mascota.especie} — {mascota.raza}</p>
                </div>
              </div>
              {canEdit && (
                <div className="detail-actions">
                  <Link to={`/mascotas/${mascota.id}/editar`} className="btn btn-primary">
                    Editar
                  </Link>
                  <button className="btn btn-danger" onClick={handleDeleteMascota}>
                    Eliminar
                  </button>
                </div>
              )}
            </div>

            <div className="detail-info-grid">
              <div className="info-item">
                <span className="info-label">Edad</span>
                <span className="info-value">{mascota.edad} {mascota.edad === 1 ? 'año' : 'años'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Peso</span>
                <span className="info-value">{mascota.peso} kg</span>
              </div>
              <div className="info-item">
                <span className="info-label">Color</span>
                <span className="info-value">{mascota.color}</span>
              </div>
              {isAdmin && propietario && (
                <div className="info-item">
                  <span className="info-label">Propietario</span>
                  <span className="info-value">{propietario.nombre}</span>
                </div>
              )}
            </div>

            {mascota.observaciones && (
              <div className="detail-observations">
                <p className="info-label">Observaciones</p>
                <p className="observations-text">{mascota.observaciones}</p>
              </div>
            )}
          </div>
        </div>

        <div className="detail-side">
          <div className="section-header">
            <h2 className="section-title">Historial de turnos</h2>
            <Link to={`/turnos/nuevo?mascotaId=${mascota.id}`} className="btn btn-outline btn-sm">
              + Turno
            </Link>
          </div>

          {mascotaTurnos.length === 0 ? (
            <div className="empty-state-sm">
              <p>Sin turnos registrados</p>
            </div>
          ) : (
            <div className="appointments-list">
              {mascotaTurnos.map(turno => (
                <AppointmentCard
                  key={turno.id}
                  turno={turno}
                  onDelete={handleDeleteTurno}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MascotaDetailPage;
