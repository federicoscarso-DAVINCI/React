import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page page-centered">
      <div className="card" style={{ textAlign: 'center' }}>
        <h1>404</h1>
        <p>La página que buscás no existe.</p>
        <Link className="btn btn-primary" to="/">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
