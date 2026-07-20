const Mascota = require('../models/Mascota');

async function listar(req, res) {
  try {
    const { q, especie } = req.query;
    const filtro = {};

    if (especie) filtro.especie = especie;
    if (q) {
      filtro.$or = [
        { nombre: { $regex: q, $options: 'i' } },
        { duenoNombre: { $regex: q, $options: 'i' } },
      ];
    }

    const mascotas = await Mascota.find(filtro).sort({ createdAt: -1 });
    res.json(mascotas);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function obtenerPorId(req, res) {
  try {
    const mascota = await Mascota.findById(req.params.id);
    if (!mascota) {
      return res.status(404).json({ mensaje: 'Mascota no encontrada' });
    }
    res.json(mascota);
  } catch (error) {
    res.status(400).json({ mensaje: 'ID inválido' });
  }
}

async function crear(req, res) {
  try {
    const mascota = await Mascota.create({ ...req.body, creadoPor: req.usuario?.id });
    res.status(201).json(mascota);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

async function actualizar(req, res) {
  try {
    const mascota = await Mascota.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!mascota) {
      return res.status(404).json({ mensaje: 'Mascota no encontrada' });
    }
    res.json(mascota);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

async function eliminar(req, res) {
  try {
    const mascota = await Mascota.findByIdAndDelete(req.params.id);
    if (!mascota) {
      return res.status(404).json({ mensaje: 'Mascota no encontrada' });
    }
    res.json({ mensaje: 'Mascota eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
