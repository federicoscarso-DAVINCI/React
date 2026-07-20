import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { SERVER_URL } from '../api/axios';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ESPECIES = ['Perro', 'Gato', 'Ave', 'Reptil', 'Roedor', 'Otro'];
const LIMITE = 8;

export default function MascotasPage() {
  const { usuario } = useAuth();
  const { mostrarToast } = useToast();
  const [mascotas, setMascotas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [especie, setEspecie] = useState('');
  const [aEliminar, setAEliminar] = useState(null);

  async function cargarMascotas() {
    setCargando(true);
    setError('');
    try {
      const params = { page: pagina, limit: LIMITE };
      if (busqueda) params.q = busqueda;
      if (especie) params.especie = especie;
      const { data } = await api.get('/mascotas', { params });
      setMascotas(data.items);
      setTotalPages(data.totalPages);
    } catch {
      setError('No se pudieron cargar las mascotas.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(cargarMascotas, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda, especie, pagina]);

  useEffect(() => {
    setPagina(1);
  }, [busqueda, especie]);

  async function confirmarEliminar() {
    try {
      await api.delete(`/mascotas/${aEliminar._id}`);
      mostrarToast('Mascota eliminada correctamente', 'exito');
      setAEliminar(null);
      cargarMascotas();
    } catch {
      mostrarToast('No se pudo eliminar la mascota', 'error');
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Mascotas</h1>
        <Link className="btn btn-primary" to="/mascotas/nueva">
          + Nueva mascota
        </Link>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por mascota o dueño..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select value={especie} onChange={(e) => setEspecie(e.target.value)}>
          <option value="">Todas las especies</option>
          {ESPECIES.map((esp) => (
            <option key={esp} value={esp}>
              {esp}
            </option>
          ))}
        </select>
      </div>

      {cargando && <p>Cargando...</p>}
      {error && <p className="form-error-general">{error}</p>}

      {!cargando && !error && mascotas.length === 0 && <p>No hay mascotas registradas.</p>}

      <div className="grid">
        {mascotas.map((mascota) => (
          <div className="card" key={mascota._id}>
            {mascota.imagen ? (
              <img className="card-img" src={`${SERVER_URL}${mascota.imagen}`} alt={mascota.nombre} />
            ) : (
              <div className="card-img card-img-placeholder">🐾</div>
            )}
            <h3>{mascota.nombre}</h3>
            <p>
              {mascota.especie} {mascota.raza && `· ${mascota.raza}`} · {mascota.edad} años
            </p>
            <p className="muted">
              Dueño: {mascota.duenoNombre} ({mascota.duenoEmail})
            </p>
            {usuario?.rol === 'admin' && mascota.creadoPor && (
              <p className="muted">Cuenta asociada: {mascota.creadoPor.nombre}</p>
            )}
            <div className="card-actions">
              <Link className="btn btn-secondary" to={`/mascotas/${mascota._id}/editar`}>
                Editar
              </Link>
              <button className="btn btn-danger" onClick={() => setAEliminar(mascota)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination page={pagina} totalPages={totalPages} onChange={setPagina} />

      <ConfirmDialog
        abierto={Boolean(aEliminar)}
        titulo="Eliminar mascota"
        mensaje={`¿Seguro que querés eliminar a "${aEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
      />
    </div>
  );
}
