import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const INITIAL_FORM = {
  nombre: '',
  email: '',
  password: '',
  rol: 'usuario',
};

function UsuariosPage() {
  const { currentUser } = useAuth();
  const { usuarios, mascotas, addUsuario, updateUsuario, deleteUsuario } = useData();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = 'El nombre es obligatorio';
    if (!form.email.trim()) errs.email = 'El email es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Ingresá un email válido';
    else {
      const duplicate = usuarios.find(
        u => u.email === form.email && u.id !== editingId
      );
      if (duplicate) errs.email = 'Este email ya está registrado';
    }
    if (!editingId && !form.password.trim())
      errs.password = 'La contraseña es obligatoria';
    else if (form.password && form.password.length < 6)
      errs.password = 'Mínimo 6 caracteres';
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

    if (editingId) {
      const data = { nombre: form.nombre, email: form.email, rol: form.rol };
      if (form.password) data.password = form.password;
      updateUsuario(editingId, data);
    } else {
      addUsuario(form);
    }

    setForm(INITIAL_FORM);
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  }

  function handleEdit(usuario) {
    setForm({ nombre: usuario.nombre, email: usuario.email, password: '', rol: usuario.rol });
    setEditingId(usuario.id);
    setShowForm(true);
    setErrors({});
  }

  function handleDelete(usuario) {
    if (usuario.id === currentUser.id) {
      alert('No podés eliminar tu propia cuenta.');
      return;
    }
    if (usuario.rol === 'admin') {
      alert('No podés eliminar una cuenta de administrador.');
      return;
    }
    if (window.confirm(`¿Eliminar a ${usuario.nombre}?`)) {
      deleteUsuario(usuario.id);
    }
  }

  function handleCancel() {
    setForm(INITIAL_FORM);
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de usuarios</h1>
          <p className="page-subtitle">{usuarios.length} usuarios registrados</p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Nuevo usuario
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-card">
          <h2 className="form-card-title">{editingId ? 'Editar usuario' : 'Nuevo usuario'}</h2>
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
                  placeholder="Nombre completo"
                />
                {errors.nombre && <span className="error-msg">{errors.nombre}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  name="email"
                  type="email"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@ejemplo.com"
                />
                {errors.email && <span className="error-msg">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Contraseña {editingId ? '(dejar vacío para no cambiar)' : '*'}
                </label>
                <input
                  name="password"
                  type="password"
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.password && <span className="error-msg">{errors.password}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Rol *</label>
                <select name="rol" className="form-input" value={form.rol} onChange={handleChange}>
                  <option value="usuario">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={handleCancel}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Guardar cambios' : 'Crear usuario'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Mascotas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => {
              const cantMascotas = mascotas.filter(m => m.propietarioId === usuario.id).length;
              const esSelf = usuario.id === currentUser.id;
              return (
                <tr key={usuario.id}>
                  <td>
                    {usuario.nombre}
                    {esSelf && <span className="badge badge-info ml-2">Vos</span>}
                  </td>
                  <td>{usuario.email}</td>
                  <td>
                    <span className={`badge ${usuario.rol === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                      {usuario.rol === 'admin' ? 'Admin' : 'Usuario'}
                    </span>
                  </td>
                  <td>{usuario.rol === 'usuario' ? cantMascotas : '—'}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEdit(usuario)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(usuario)}
                        disabled={esSelf || usuario.rol === 'admin'}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsuariosPage;
