import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import PetCard from '../components/PetCard';

const ESPECIES = ['Todas', 'Perro', 'Gato', 'Conejo', 'Pez', 'Ave'];

function MascotasPage() {
  const { currentUser, isAdmin } = useAuth();
  const { mascotas, deleteMascota } = useData();
  const [busqueda, setBusqueda] = useState('');
  const [especieFiltro, setEspecieFiltro] = useState('Todas');

  const listBase = isAdmin
    ? mascotas
    : mascotas.filter(m => m.propietarioId === currentUser.id);

  const filtradas = listBase.filter(m => {
    const coincideNombre = m.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEspecie = especieFiltro === 'Todas' || m.especie === especieFiltro;
    return coincideNombre && coincideEspecie;
  });

  function handleDelete(id) {
    if (window.confirm('¿Seguro que querés eliminar esta mascota? También se eliminarán sus turnos.')) {
      deleteMascota(id);
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAdmin ? 'Todas las mascotas' : 'Mis mascotas'}</h1>
          <p className="page-subtitle">{filtradas.length} mascota{filtradas.length !== 1 ? 's' : ''} encontrada{filtradas.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/mascotas/nueva" className="btn btn-primary">
          + Nueva mascota
        </Link>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          className="form-input search-input"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <div className="filter-buttons">
          {ESPECIES.map(esp => (
            <button
              key={esp}
              className={`filter-btn ${especieFiltro === esp ? 'filter-btn-active' : ''}`}
              onClick={() => setEspecieFiltro(esp)}
            >
              {esp}
            </button>
          ))}
        </div>
      </div>

      {filtradas.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">No se encontraron mascotas</p>
          <p className="empty-sub">
            {listBase.length === 0
              ? 'Todavía no registraste ninguna mascota.'
              : 'Probá con otro filtro o nombre.'}
          </p>
          {listBase.length === 0 && (
            <Link to="/mascotas/nueva" className="btn btn-primary">
              Agregar primera mascota
            </Link>
          )}
        </div>
      ) : (
        <div className="pets-grid">
          {filtradas.map(mascota => (
            <PetCard
              key={mascota.id}
              mascota={mascota}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MascotasPage;
