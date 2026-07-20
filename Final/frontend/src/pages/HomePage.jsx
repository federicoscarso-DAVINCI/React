import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { estaAutenticado, usuario } = useAuth();

  return (
    <div className="page">
      <div className="hero">
        <h1>Bienvenido a VetCare</h1>
        <p>
          Sistema de gestión de mascotas y turnos para la clínica veterinaria.
          {estaAutenticado ? ` Hola, ${usuario?.nombre}.` : ' Iniciá sesión para gestionar la información.'}
        </p>
        {estaAutenticado && (
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/mascotas">
              Ver mascotas
            </Link>
            <Link className="btn btn-secondary" to="/turnos">
              Ver turnos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
