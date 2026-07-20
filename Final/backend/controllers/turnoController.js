const Turno = require('../models/Turno');

async function listar(req, res) {
  try {
    const { estado, mascota } = req.query;
    const filtro = {};

    if (estado) filtro.estado = estado;
    if (mascota) filtro.mascota = mascota;

    const turnos = await Turno.find(filtro)
      .populate('mascota', 'nombre especie duenoNombre')
      .sort({ fecha: 1 });
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function obtenerPorId(req, res) {
  try {
    const turno = await Turno.findById(req.params.id).populate('mascota', 'nombre especie duenoNombre');
    if (!turno) {
      return res.status(404).json({ mensaje: 'Turno no encontrado' });
    }
    res.json(turno);
  } catch (error) {
    res.status(400).json({ mensaje: 'ID inválido' });
  }
}

async function crear(req, res) {
  try {
    const turno = await Turno.create({ ...req.body, creadoPor: req.usuario?.id });
    const turnoPopulado = await turno.populate('mascota', 'nombre especie duenoNombre');
    res.status(201).json(turnoPopulado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

async function actualizar(req, res) {
  try {
    const turno = await Turno.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('mascota', 'nombre especie duenoNombre');
    if (!turno) {
      return res.status(404).json({ mensaje: 'Turno no encontrado' });
    }
    res.json(turno);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

async function eliminar(req, res) {
  try {
    const turno = await Turno.findByIdAndDelete(req.params.id);
    if (!turno) {
      return res.status(404).json({ mensaje: 'Turno no encontrado' });
    }
    res.json({ mensaje: 'Turno eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
