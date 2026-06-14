import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import AppointmentCard from '../components/AppointmentCard';

const ESTADOS = ['Todos', 'pendiente', 'confirmado', 'cancelado'];
const ESTADO_LABELS = { pendiente: 'Pendiente', confirmado: 'Confirmado', cancelado: 'Cancelado' };

function TurnosPage() {
  const { currentUser, isAdmin } = useAuth();
  const { turnos, deleteTurno } = useData();
  const [estadoFiltro, setEstadoFiltro] = useState('Todos');
  const [fechaFiltro, setFechaFiltro] = useState('');

  const listBase = isAdmin
    ? turnos
    : turnos.filter(t => t.propietarioId === currentUser.id);

  const filtrados = listBase.filter(t => {
    const coincideEstado = estadoFiltro === 'Todos' || t.estado === estadoFiltro;
    const coincideFecha = !fechaFiltro || t.fecha === fechaFiltro;
    return coincideEstado && coincideFecha;
  });

  const ordenados = [...filtrados].sort((a, b) =>
    (b.fecha + b.hora).localeCompare(a.fecha + a.hora)
  );

  function handleDelete(id) {
    if (window.confirm('¿Eliminar este turno?')) {
      deleteTurno(id);
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAdmin ? 'Todos los turnos' : 'Mis turnos'}</h1>
          <p className="page-subtitle">{filtrados.length} turno{filtrados.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/turnos/nuevo" className="btn btn-primary">
          + Nuevo turno
        </Link>
      </div>

      <div className="filters-bar">
        <input
          type="date"
          className="form-input date-filter"
          value={fechaFiltro}
          onChange={e => setFechaFiltro(e.target.value)}
        />
        <div className="filter-buttons">
          {ESTADOS.map(estado => (
            <button
              key={estado}
              className={`filter-btn ${estadoFiltro === estado ? 'filter-btn-active' : ''}`}
              onClick={() => setEstadoFiltro(estado)}
            >
              {estado === 'Todos' ? 'Todos' : ESTADO_LABELS[estado]}
            </button>
          ))}
        </div>
        {fechaFiltro && (
          <button className="btn btn-outline btn-sm" onClick={() => setFechaFiltro('')}>
            Limpiar fecha
          </button>
        )}
      </div>

      {ordenados.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">No hay turnos</p>
          <p className="empty-sub">
            {listBase.length === 0
              ? 'Todavía no agendaste ningún turno.'
              : 'No hay turnos con los filtros seleccionados.'}
          </p>
          {listBase.length === 0 && (
            <Link to="/turnos/nuevo" className="btn btn-primary">Agendar turno</Link>
          )}
        </div>
      ) : (
        <div className="appointments-list">
          {ordenados.map(turno => (
            <AppointmentCard
              key={turno.id}
              turno={turno}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TurnosPage;
