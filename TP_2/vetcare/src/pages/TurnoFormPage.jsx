import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const MOTIVOS = [
  'Vacunación',
  'Control general',
  'Consulta',
  'Cirugía',
  'Desparasitación',
  'Peluquería',
  'Urgencia',
  'Otro',
];

const ESTADOS = ['pendiente', 'confirmado', 'cancelado'];

const INITIAL_FORM = {
  mascotaId: '',
  fecha: '',
  hora: '',
  motivo: 'Control general',
  estado: 'pendiente',
  notas: '',
};

function TurnoFormPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const { turnos, mascotas, addTurno, updateTurno } = useData();

  const isEdit = Boolean(id);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const misMascotas = isAdmin
    ? mascotas
    : mascotas.filter(m => m.propietarioId === currentUser.id);

  useEffect(() => {
    if (isEdit) {
      const turno = turnos.find(t => t.id === Number(id));
      if (turno) {
        setForm({
          mascotaId: turno.mascotaId,
          fecha: turno.fecha,
          hora: turno.hora,
          motivo: turno.motivo,
          estado: turno.estado,
          notas: turno.notas || '',
        });
      }
    } else {
      const mascotaIdParam = searchParams.get('mascotaId');
      if (mascotaIdParam) {
        setForm(prev => ({ ...prev, mascotaId: Number(mascotaIdParam) }));
      }
    }
  }, [id]);

  function validate() {
    const errs = {};
    if (!form.mascotaId) errs.mascotaId = 'Seleccioná una mascota';
    if (!form.fecha) errs.fecha = 'La fecha es obligatoria';
    if (!form.hora) errs.hora = 'El horario es obligatorio';
    if (!form.motivo.trim()) errs.motivo = 'El motivo es obligatorio';
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const mascota = mascotas.find(m => m.id === Number(form.mascotaId));
    const data = {
      ...form,
      mascotaId: Number(form.mascotaId),
      propietarioId: mascota?.propietarioId ?? currentUser.id,
    };

    if (isEdit) {
      updateTurno(Number(id), data);
    } else {
      addTurno(data);
    }
    navigate('/turnos');
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="page-container page-container-narrow">
      <div className="breadcrumb">
        <Link to="/turnos">Turnos</Link> / {isEdit ? 'Editar turno' : 'Nuevo turno'}
      </div>

      <h1 className="page-title">{isEdit ? 'Editar turno' : 'Nuevo turno'}</h1>

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Mascota *</label>
            <select
              name="mascotaId"
              className={`form-input ${errors.mascotaId ? 'input-error' : ''}`}
              value={form.mascotaId}
              onChange={handleChange}
            >
              <option value="">Seleccioná una mascota</option>
              {misMascotas.map(m => (
                <option key={m.id} value={m.id}>
                  {m.nombre} ({m.especie})
                </option>
              ))}
            </select>
            {errors.mascotaId && <span className="error-msg">{errors.mascotaId}</span>}
            {misMascotas.length === 0 && (
              <span className="error-msg">
                No tenés mascotas registradas. <Link to="/mascotas/nueva">Agregar una</Link>
              </span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fecha *</label>
              <input
                name="fecha"
                type="date"
                min={isEdit ? undefined : today}
                className={`form-input ${errors.fecha ? 'input-error' : ''}`}
                value={form.fecha}
                onChange={handleChange}
              />
              {errors.fecha && <span className="error-msg">{errors.fecha}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Horario *</label>
              <input
                name="hora"
                type="time"
                className={`form-input ${errors.hora ? 'input-error' : ''}`}
                value={form.hora}
                onChange={handleChange}
              />
              {errors.hora && <span className="error-msg">{errors.hora}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Motivo *</label>
            <select name="motivo" className="form-input" value={form.motivo} onChange={handleChange}>
              {MOTIVOS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {isAdmin && (
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select name="estado" className="form-input" value={form.estado} onChange={handleChange}>
                {ESTADOS.map(e => (
                  <option key={e} value={e}>
                    {e.charAt(0).toUpperCase() + e.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Notas adicionales</label>
            <textarea
              name="notas"
              className="form-input"
              rows={3}
              value={form.notas}
              onChange={handleChange}
              placeholder="Indicaciones especiales, síntomas, etc."
            />
          </div>

          <div className="form-actions">
            <Link to="/turnos" className="btn btn-outline">Cancelar</Link>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Guardar cambios' : 'Agendar turno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TurnoFormPage;
