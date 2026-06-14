import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const ESPECIES = ['Perro', 'Gato', 'Conejo', 'Pez', 'Ave', 'Otro'];

const INITIAL_FORM = {
  nombre: '',
  especie: 'Perro',
  raza: '',
  edad: '',
  peso: '',
  color: '',
  observaciones: '',
  propietarioId: '',
};

function MascotaFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const { mascotas, usuarios, addMascota, updateMascota } = useData();

  const isEdit = Boolean(id);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const clientes = usuarios.filter(u => u.rol === 'usuario');

  useEffect(() => {
    if (isEdit) {
      const mascota = mascotas.find(m => m.id === Number(id));
      if (mascota) {
        setForm({
          nombre: mascota.nombre,
          especie: mascota.especie,
          raza: mascota.raza,
          edad: mascota.edad,
          peso: mascota.peso,
          color: mascota.color,
          observaciones: mascota.observaciones || '',
          propietarioId: mascota.propietarioId,
        });
      }
    } else {
      setForm(prev => ({
        ...prev,
        propietarioId: isAdmin ? '' : currentUser.id,
      }));
    }
  }, [id]);

  function validate() {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = 'El nombre es obligatorio';
    if (!form.raza.trim()) errs.raza = 'La raza es obligatoria';
    if (!form.edad || isNaN(form.edad) || Number(form.edad) <= 0)
      errs.edad = 'Ingresá una edad válida (número positivo)';
    if (!form.peso || isNaN(form.peso) || Number(form.peso) <= 0)
      errs.peso = 'Ingresá un peso válido (número positivo)';
    if (!form.color.trim()) errs.color = 'El color es obligatorio';
    if (isAdmin && !form.propietarioId) errs.propietarioId = 'Seleccioná un propietario';
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

    const data = {
      ...form,
      edad: Number(form.edad),
      peso: Number(form.peso),
      propietarioId: isAdmin ? Number(form.propietarioId) : currentUser.id,
    };

    if (isEdit) {
      updateMascota(Number(id), data);
      navigate(`/mascotas/${id}`);
    } else {
      const nueva = addMascota(data);
      navigate(`/mascotas/${nueva.id}`);
    }
  }

  return (
    <div className="page-container page-container-narrow">
      <div className="breadcrumb">
        <Link to="/mascotas">Mascotas</Link> / {isEdit ? 'Editar' : 'Nueva mascota'}
      </div>

      <h1 className="page-title">{isEdit ? 'Editar mascota' : 'Nueva mascota'}</h1>

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input
                name="nombre"
                type="text"
                className={`form-input ${errors.nombre ? 'input-error' : ''}`}
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre de la mascota"
              />
              {errors.nombre && <span className="error-msg">{errors.nombre}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Especie *</label>
              <select name="especie" className="form-input" value={form.especie} onChange={handleChange}>
                {ESPECIES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Raza *</label>
              <input
                name="raza"
                type="text"
                className={`form-input ${errors.raza ? 'input-error' : ''}`}
                value={form.raza}
                onChange={handleChange}
                placeholder="Raza"
              />
              {errors.raza && <span className="error-msg">{errors.raza}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Color *</label>
              <input
                name="color"
                type="text"
                className={`form-input ${errors.color ? 'input-error' : ''}`}
                value={form.color}
                onChange={handleChange}
                placeholder="Color del pelaje"
              />
              {errors.color && <span className="error-msg">{errors.color}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Edad (años) *</label>
              <input
                name="edad"
                type="number"
                min="0"
                step="1"
                className={`form-input ${errors.edad ? 'input-error' : ''}`}
                value={form.edad}
                onChange={handleChange}
                placeholder="0"
              />
              {errors.edad && <span className="error-msg">{errors.edad}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Peso (kg) *</label>
              <input
                name="peso"
                type="number"
                min="0"
                step="0.1"
                className={`form-input ${errors.peso ? 'input-error' : ''}`}
                value={form.peso}
                onChange={handleChange}
                placeholder="0.0"
              />
              {errors.peso && <span className="error-msg">{errors.peso}</span>}
            </div>
          </div>

          {isAdmin && (
            <div className="form-group">
              <label className="form-label">Propietario *</label>
              <select
                name="propietarioId"
                className={`form-input ${errors.propietarioId ? 'input-error' : ''}`}
                value={form.propietarioId}
                onChange={handleChange}
              >
                <option value="">Seleccioná un propietario</option>
                {clientes.map(u => (
                  <option key={u.id} value={u.id}>{u.nombre}</option>
                ))}
              </select>
              {errors.propietarioId && <span className="error-msg">{errors.propietarioId}</span>}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Observaciones</label>
            <textarea
              name="observaciones"
              className="form-input"
              rows={3}
              value={form.observaciones}
              onChange={handleChange}
              placeholder="Alergias, condiciones especiales, etc."
            />
          </div>

          <div className="form-actions">
            <Link to="/mascotas" className="btn btn-outline">Cancelar</Link>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Guardar cambios' : 'Registrar mascota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MascotaFormPage;
