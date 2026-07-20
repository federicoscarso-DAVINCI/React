const Turno = require('../models/Turno');
const Mascota = require('../models/Mascota');

async function esDueñoDeTurno(turno, usuario) {
  if (usuario.rol === 'admin') return true;
  const mascota = turno.mascota?.creadoPor
    ? turno.mascota
    : await Mascota.findById(turno.mascota);
  return Boolean(mascota && mascota.creadoPor && mascota.creadoPor.toString() === usuario.id);
}

async function listar(req, res) {
  try {
    const { estado, mascota, page = 1, limit = 8 } = req.query;
    const filtro = {};

    if (estado) filtro.estado = estado;

    if (req.usuario.rol === 'admin') {
      if (mascota) filtro.mascota = mascota;
    } else {
      const misMascotas = await Mascota.find({ creadoPor: req.usuario.id }).select('_id');
      filtro.mascota = { $in: misMascotas.map((m) => m._id) };
    }

    const paginaActual = Math.max(1, parseInt(page, 10) || 1);
    const limite = Math.max(1, parseInt(limit, 10) || 8);

    const totalItems = await Turno.countDocuments(filtro);
    const items = await Turno.find(filtro)
      .populate('mascota', 'nombre especie duenoNombre')
      .sort({ fecha: 1 })
      .skip((paginaActual - 1) * limite)
      .limit(limite);

    res.json({
      items,
      page: paginaActual,
      totalPages: Math.max(1, Math.ceil(totalItems / limite)),
      totalItems,
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function obtenerPorId(req, res) {
  try {
    const turno = await Turno.findById(req.params.id).populate('mascota', 'nombre especie duenoNombre creadoPor');
    if (!turno) {
      return res.status(404).json({ mensaje: 'Turno no encontrado' });
    }
    if (!(await esDueñoDeTurno(turno, req.usuario))) {
      return res.status(403).json({ mensaje: 'No tenés permiso para ver este turno' });
    }
    res.json(turno);
  } catch (error) {
    res.status(400).json({ mensaje: 'ID inválido' });
  }
}

async function crear(req, res) {
  try {
    if (req.usuario.rol !== 'admin') {
      const mascota = await Mascota.findById(req.body.mascota);
      if (!mascota || !mascota.creadoPor || mascota.creadoPor.toString() !== req.usuario.id) {
        return res.status(403).json({ mensaje: 'Solo podés crear turnos para tus propias mascotas' });
      }
    }

    const turno = await Turno.create({ ...req.body, creadoPor: req.usuario.id });
    const turnoPopulado = await turno.populate('mascota', 'nombre especie duenoNombre');
    res.status(201).json(turnoPopulado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

async function actualizar(req, res) {
  try {
    const existente = await Turno.findById(req.params.id).populate('mascota', 'creadoPor');
    if (!existente) {
      return res.status(404).json({ mensaje: 'Turno no encontrado' });
    }
    if (!(await esDueñoDeTurno(existente, req.usuario))) {
      return res.status(403).json({ mensaje: 'No tenés permiso para editar este turno' });
    }

    const turno = await Turno.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('mascota', 'nombre especie duenoNombre');

    res.json(turno);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

async function eliminar(req, res) {
  try {
    const turno = await Turno.findById(req.params.id).populate('mascota', 'creadoPor');
    if (!turno) {
      return res.status(404).json({ mensaje: 'Turno no encontrado' });
    }
    if (!(await esDueñoDeTurno(turno, req.usuario))) {
      return res.status(403).json({ mensaje: 'No tenés permiso para eliminar este turno' });
    }

    await turno.deleteOne();
    res.json({ mensaje: 'Turno eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
