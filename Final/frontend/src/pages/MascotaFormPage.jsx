import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const ESPECIES = ['Perro', 'Gato', 'Ave', 'Reptil', 'Roedor', 'Otro'];

const FORM_INICIAL = {
  nombre: '',
  especie: 'Perro',
  raza: '',
  edad: '',
  duenoNombre: '',
  duenoEmail: '',
  duenoTelefono: '',
  observaciones: '',
};

export default function MascotaFormPage() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();
  const { mostrarToast } = useToast();

  const [form, setForm] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');

  useEffect(() => {
    if (!esEdicion) return;
    api
      .get(`/mascotas/${id}`)
      .then(({ data }) => {
        setForm({
          nombre: data.nombre,
          especie: data.especie,
          raza: data.raza || '',
          edad: data.edad,
          duenoNombre: data.duenoNombre,
          duenoEmail: data.duenoEmail,
          duenoTelefono: data.duenoTelefono || '',
          observaciones: data.observaciones || '',
        });
      })
      .catch(() => setErrorGeneral('No se pudo cargar la mascota.'))
      .finally(() => setCargando(false));
  }, [id, esEdicion]);

  function validar() {
    const nuevosErrores = {};
    if (!form.nombre.trim() || form.nombre.trim().length < 2) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres';
    }
    if (form.edad === '' || Number.isNaN(Number(form.edad))) {
      nuevosErrores.edad = 'La edad debe ser un número';
    } else if (Number(form.edad) < 0 || Number(form.edad) > 50) {
      nuevosErrores.edad = 'La edad debe estar entre 0 y 50';
    }
    if (!form.duenoNombre.trim() || form.duenoNombre.trim().length < 2) {
      nuevosErrores.duenoNombre = 'El nombre del dueño debe tener al menos 2 caracteres';
    }
    if (!/^\S+@\S+\.\S+$/.test(form.duenoEmail)) {
      nuevosErrores.duenoEmail = 'Ingresá un email válido';
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorGeneral('');
    if (!validar()) return;

    setGuardando(true);
    const payload = { ...form, edad: Number(form.edad) };

    try {
      if (esEdicion) {
        await api.put(`/mascotas/${id}`, payload);
        mostrarToast('Mascota actualizada correctamente', 'exito');
      } else {
        await api.post('/mascotas', payload);
        mostrarToast('Mascota creada correctamente', 'exito');
      }
      navigate('/mascotas');
    } catch (error) {
      setErrorGeneral(error.response?.data?.mensaje || 'Ocurrió un error al guardar.');
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <div className="page">Cargando...</div>;

  return (
    <div className="page page-centered">
      <form className="card form" onSubmit={handleSubmit}>
        <h2>{esEdicion ? 'Editar mascota' : 'Nueva mascota'}</h2>
        {errorGeneral && <p className="form-error-general">{errorGeneral}</p>}

        <label>
          Nombre
          <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          {errores.nombre && <span className="field-error">{errores.nombre}</span>}
        </label>

        <label>
          Especie
          <select value={form.especie} onChange={(e) => setForm({ ...form, especie: e.target.value })}>
            {ESPECIES.map((esp) => (
              <option key={esp} value={esp}>
                {esp}
              </option>
            ))}
          </select>
        </label>

        <label>
          Raza
          <input value={form.raza} onChange={(e) => setForm({ ...form, raza: e.target.value })} />
        </label>

        <label>
          Edad (años)
          <input
            type="number"
            value={form.edad}
            onChange={(e) => setForm({ ...form, edad: e.target.value })}
          />
          {errores.edad && <span className="field-error">{errores.edad}</span>}
        </label>

        <label>
          Nombre del dueño
          <input
            value={form.duenoNombre}
            onChange={(e) => setForm({ ...form, duenoNombre: e.target.value })}
          />
          {errores.duenoNombre && <span className="field-error">{errores.duenoNombre}</span>}
        </label>

        <label>
          Email del dueño
          <input
            type="email"
            value={form.duenoEmail}
            onChange={(e) => setForm({ ...form, duenoEmail: e.target.value })}
          />
          {errores.duenoEmail && <span className="field-error">{errores.duenoEmail}</span>}
        </label>

        <label>
          Teléfono del dueño
          <input
            value={form.duenoTelefono}
            onChange={(e) => setForm({ ...form, duenoTelefono: e.target.value })}
          />
        </label>

        <label>
          Observaciones
          <textarea
            value={form.observaciones}
            onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
            rows={3}
          />
        </label>

        <div className="form-actions">
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/mascotas')}>
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
