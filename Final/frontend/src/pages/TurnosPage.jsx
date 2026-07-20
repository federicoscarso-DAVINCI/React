import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';
import { useToast } from '../context/ToastContext';

const ESTADOS = ['Pendiente', 'Confirmado', 'Completado', 'Cancelado'];
const LIMITE = 8;

export default function TurnosPage() {
  const { mostrarToast } = useToast();
  const [turnos, setTurnos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [estado, setEstado] = useState('');
  const [aEliminar, setAEliminar] = useState(null);

  async function cargarTurnos() {
    setCargando(true);
    setError('');
    try {
      const params = { page: pagina, limit: LIMITE };
      if (estado) params.estado = estado;
      const { data } = await api.get('/turnos', { params });
      setTurnos(data.items);
      setTotalPages(data.totalPages);
    } catch {
      setError('No se pudieron cargar los turnos.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarTurnos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado, pagina]);

  useEffect(() => {
    setPagina(1);
  }, [estado]);

  async function confirmarEliminar() {
    try {
      await api.delete(`/turnos/${aEliminar._id}`);
      mostrarToast('Turno eliminado correctamente', 'exito');
      setAEliminar(null);
      cargarTurnos();
    } catch {
      mostrarToast('No se pudo eliminar el turno', 'error');
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Turnos</h1>
        <Link className="btn btn-primary" to="/turnos/nuevo">
          + Nuevo turno
        </Link>
      </div>

      <div className="filters">
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          {ESTADOS.map((est) => (
            <option key={est} value={est}>
              {est}
            </option>
          ))}
        </select>
      </div>

      {cargando && <p>Cargando...</p>}
      {error && <p className="form-error-general">{error}</p>}
      {!cargando && !error && turnos.length === 0 && <p>No hay turnos registrados.</p>}

      <div className="grid">
        {turnos.map((turno) => (
          <div className="card" key={turno._id}>
            <h3>{turno.mascota?.nombre || 'Mascota eliminada'}</h3>
            <p>{new Date(turno.fecha).toLocaleString('es-AR')}</p>
            <p className="muted">Motivo: {turno.motivo}</p>
            <p className="muted">Veterinario: {turno.veterinario}</p>
            <span className={`badge-estado estado-${turno.estado.toLowerCase()}`}>{turno.estado}</span>
            <div className="card-actions">
              <Link className="btn btn-secondary" to={`/turnos/${turno._id}/editar`}>
                Editar
              </Link>
              <button className="btn btn-danger" onClick={() => setAEliminar(turno)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination page={pagina} totalPages={totalPages} onChange={setPagina} />

      <ConfirmDialog
        abierto={Boolean(aEliminar)}
        titulo="Eliminar turno"
        mensaje="¿Seguro que querés eliminar este turno? Esta acción no se puede deshacer."
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
      />
    </div>
  );
}
