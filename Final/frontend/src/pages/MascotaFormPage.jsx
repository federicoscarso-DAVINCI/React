import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { SERVER_URL } from '../api/axios';
import { useAuth } from '../context/AuthContext';
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
  propietario: '',
};

export default function MascotaFormPage() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { mostrarToast } = useToast();
  const esAdmin = usuario?.rol === 'admin';

  const [form, setForm] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [imagenActual, setImagenActual] = useState('');
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState('');

  useEffect(() => {
    if (esAdmin) {
      api
        .get('/usuarios')
        .then(({ data }) => setUsuarios(data))
        .catch(() => {});
    }
  }, [esAdmin]);

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
          propietario: data.creadoPor?._id || '',
        });
        setImagenActual(data.imagen || '');
      })
      .catch(() => setErrorGeneral('No se pudo cargar la mascota.'))
      .finally(() => setCargando(false));
  }, [id, esEdicion]);

  function handleImagenChange(e) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setArchivoImagen(archivo);
    setPreviewImagen(URL.createObjectURL(archivo));
  }

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
    const formData = new FormData();
    formData.append('nombre', form.nombre);
    formData.append('especie', form.especie);
    formData.append('raza', form.raza);
    formData.append('edad', form.edad);
    formData.append('duenoNombre', form.duenoNombre);
    formData.append('duenoEmail', form.duenoEmail);
    formData.append('duenoTelefono', form.duenoTelefono);
    formData.append('observaciones', form.observaciones);
    if (esAdmin && form.propietario) {
      formData.append('propietario', form.propietario);
    }
    if (archivoImagen) {
      formData.append('imagen', archivoImagen);
    }

    try {
      if (esEdicion) {
        await api.put(`/mascotas/${id}`, formData);
        mostrarToast('Mascota actualizada correctamente', 'exito');
      } else {
        await api.post('/mascotas', formData);
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

  const fotoAMostrar = previewImagen || (imagenActual ? `${SERVER_URL}${imagenActual}` : '');

  return (
    <div className="page page-centered">
      <form className="card form" onSubmit={handleSubmit}>
        <h2>{esEdicion ? 'Editar mascota' : 'Nueva mascota'}</h2>
        {errorGeneral && <p className="form-error-general">{errorGeneral}</p>}

        <label>
          Foto de la mascota
          {fotoAMostrar && <img className="form-img-preview" src={fotoAMostrar} alt="Vista previa" />}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImagenChange} />
        </label>

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

        {esAdmin && (
          <label>
            Usuario asociado
            <select
              value={form.propietario}
              onChange={(e) => setForm({ ...form, propietario: e.target.value })}
            >
              <option value="">— Sin asignar (quedará a tu nombre) —</option>
              {usuarios.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.nombre} ({u.email}) {u.rol === 'admin' ? '· admin' : ''}
                </option>
              ))}
            </select>
          </label>
        )}

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
