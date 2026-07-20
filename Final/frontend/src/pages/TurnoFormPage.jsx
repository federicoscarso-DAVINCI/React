import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const ESTADOS = ['Pendiente', 'Confirmado', 'Completado', 'Cancelado'];

const FORM_INICIAL = {
  mascota: '',
  fecha: '',
  motivo: '',
  veterinario: '',
  estado: 'Pendiente',
};

function aInputDatetime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export default function TurnoFormPage() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();
  const { mostrarToast } = useToast();

  const [mascotas, setMascotas] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');

  useEffect(() => {
    async function cargarDatos() {
      try {
        const { data } = await api.get('/mascotas', { params: { limit: 200 } });
        const listaMascotas = data.items;
        setMascotas(listaMascotas);

        if (esEdicion) {
          const { data: turno } = await api.get(`/turnos/${id}`);
          setForm({
            mascota: turno.mascota?._id || '',
            fecha: aInputDatetime(turno.fecha),
            motivo: turno.motivo,
            veterinario: turno.veterinario,
            estado: turno.estado,
          });
        } else if (listaMascotas.length > 0) {
          setForm((prev) => ({ ...prev, mascota: listaMascotas[0]._id }));
        }
      } catch {
        setErrorGeneral('No se pudieron cargar los datos necesarios.');
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, [id, esEdicion]);

  function validar() {
    const nuevosErrores = {};
    if (!form.mascota) nuevosErrores.mascota = 'Seleccioná una mascota';
    if (!form.fecha) nuevosErrores.fecha = 'La fecha es obligatoria';
    if (!form.motivo.trim() || form.motivo.trim().length < 3) {
      nuevosErrores.motivo = 'El motivo debe tener al menos 3 caracteres';
    }
    if (!form.veterinario.trim()) {
      nuevosErrores.veterinario = 'El veterinario es obligatorio';
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorGeneral('');
    if (!validar()) return;

    setGuardando(true);
    const payload = { ...form, fecha: new Date(form.fecha).toISOString() };

    try {
      if (esEdicion) {
        await api.put(`/turnos/${id}`, payload);
        mostrarToast('Turno actualizado correctamente', 'exito');
      } else {
        await api.post('/turnos', payload);
        mostrarToast('Turno creado correctamente', 'exito');
      }
      navigate('/turnos');
    } catch (error) {
      setErrorGeneral(error.response?.data?.mensaje || 'Ocurrió un error al guardar.');
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <div className="page">Cargando...</div>;

  if (mascotas.length === 0) {
    return (
      <div className="page page-centered">
        <div className="card">
          <p>Necesitás registrar al menos una mascota antes de crear un turno.</p>
          <button className="btn btn-primary" onClick={() => navigate('/mascotas/nueva')}>
            Crear mascota
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-centered">
      <form className="card form" onSubmit={handleSubmit}>
        <h2>{esEdicion ? 'Editar turno' : 'Nuevo turno'}</h2>
        {errorGeneral && <p className="form-error-general">{errorGeneral}</p>}

        <label>
          Mascota
          <select value={form.mascota} onChange={(e) => setForm({ ...form, mascota: e.target.value })}>
            {mascotas.map((mascota) => (
              <option key={mascota._id} value={mascota._id}>
                {mascota.nombre} ({mascota.duenoNombre})
              </option>
            ))}
          </select>
          {errores.mascota && <span className="field-error">{errores.mascota}</span>}
        </label>

        <label>
          Fecha y hora
          <input
            type="datetime-local"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          />
          {errores.fecha && <span className="field-error">{errores.fecha}</span>}
        </label>

        <label>
          Motivo
          <input value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} />
          {errores.motivo && <span className="field-error">{errores.motivo}</span>}
        </label>

        <label>
          Veterinario
          <input
            value={form.veterinario}
            onChange={(e) => setForm({ ...form, veterinario: e.target.value })}
          />
          {errores.veterinario && <span className="field-error">{errores.veterinario}</span>}
        </label>

        {esEdicion && (
          <label>
            Estado
            <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
              {ESTADOS.map((est) => (
                <option key={est} value={est}>
                  {est}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="form-actions">
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/turnos')}>
            Cancelar
          </button>
          <button className="btn btn-primary" type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
