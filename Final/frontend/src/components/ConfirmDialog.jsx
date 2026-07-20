export default function ConfirmDialog({ abierto, titulo, mensaje, onConfirmar, onCancelar }) {
  if (!abierto) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <h3>{titulo}</h3>
        <p>{mensaje}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={onConfirmar}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
