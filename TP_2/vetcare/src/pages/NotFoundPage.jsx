import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <div style={{ fontSize: '5rem' }}>🐾</div>
      <h1 style={{ fontSize: '2rem', margin: '1rem 0 0.5rem' }}>404 — Página no encontrada</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        La página que buscás no existe.
      </p>
      <Link to="/" className="btn btn-primary">Volver al inicio</Link>
    </div>
  );
}

export default NotFoundPage;
