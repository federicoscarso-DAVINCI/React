import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const SPECIES_EMOJI = {
  Perro: '🐕',
  Gato: '🐈',
  Conejo: '🐇',
  Pez: '🐠',
  Ave: '🐦',
};

function PetCard({ mascota, onDelete }) {
  const { isAdmin, currentUser } = useAuth();
  const { usuarios } = useData();

  const propietario = usuarios.find(u => u.id === mascota.propietarioId);
  const emoji = SPECIES_EMOJI[mascota.especie] || '🐾';
  const canEdit = isAdmin || mascota.propietarioId === currentUser?.id;

  return (
    <div className="pet-card">
      <div className="pet-card-header">
        <span className="pet-emoji">{emoji}</span>
        <div>
          <h3 className="pet-name">{mascota.nombre}</h3>
          <span className="pet-species">{mascota.especie}</span>
        </div>
      </div>

      <div className="pet-card-body">
        <p><span className="label">Raza:</span> {mascota.raza}</p>
        <p><span className="label">Edad:</span> {mascota.edad} {mascota.edad === 1 ? 'año' : 'años'}</p>
        <p><span className="label">Peso:</span> {mascota.peso} kg</p>
        {isAdmin && propietario && (
          <p><span className="label">Dueño:</span> {propietario.nombre}</p>
        )}
      </div>

      <div className="pet-card-actions">
        <Link to={`/mascotas/${mascota.id}`} className="btn btn-outline btn-sm">
          Ver detalle
        </Link>
        {canEdit && (
          <>
            <Link to={`/mascotas/${mascota.id}/editar`} className="btn btn-primary btn-sm">
              Editar
            </Link>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(mascota.id)}
            >
              Eliminar
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PetCard;
