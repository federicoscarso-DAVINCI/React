import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const STATUS_CONFIG = {
  pendiente: { label: 'Pendiente', className: 'badge-warning' },
  confirmado: { label: 'Confirmado', className: 'badge-success' },
  cancelado: { label: 'Cancelado', className: 'badge-danger' },
};

function AppointmentCard({ turno, onDelete }) {
  const { isAdmin, currentUser } = useAuth();
  const { mascotas } = useData();

  const mascota = mascotas.find(m => m.id === turno.mascotaId);
  const status = STATUS_CONFIG[turno.estado] || STATUS_CONFIG.pendiente;
  const canEdit = isAdmin || turno.propietarioId === currentUser?.id;

  const fecha = new Date(turno.fecha + 'T00:00:00').toLocaleDateString('es-AR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="appointment-card">
      <div className="appointment-card-left">
        <div className="appointment-date">
          <span className="date-day">
            {new Date(turno.fecha + 'T00:00:00').getDate()}
          </span>
          <span className="date-month">
            {new Date(turno.fecha + 'T00:00:00').toLocaleDateString('es-AR', { month: 'short' })}
          </span>
        </div>
        <span className="appointment-time">{turno.hora}</span>
      </div>

      <div className="appointment-card-body">
        <div className="appointment-top">
          <h4 className="appointment-reason">{turno.motivo}</h4>
          <span className={`badge ${status.className}`}>{status.label}</span>
        </div>
        {mascota && (
          <p className="appointment-pet">
            🐾 {mascota.nombre} — {mascota.especie}
          </p>
        )}
        {turno.notas && (
          <p className="appointment-notes">{turno.notas}</p>
        )}
      </div>

      {canEdit && (
        <div className="appointment-card-actions">
          <Link to={`/turnos/${turno.id}/editar`} className="btn btn-primary btn-sm">
            Editar
          </Link>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(turno.id)}
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}

export default AppointmentCard;
