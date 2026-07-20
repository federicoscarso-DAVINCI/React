const fs = require('fs');
const path = require('path');
const Mascota = require('../models/Mascota');

function esDueño(mascota, usuario) {
  return mascota.creadoPor && mascota.creadoPor.toString() === usuario.id;
}

function borrarImagen(rutaRelativa) {
  if (!rutaRelativa) return;
  fs.unlink(path.join(__dirname, '..', rutaRelativa), () => {});
}

async function listar(req, res) {
  try {
    const { q, especie, page = 1, limit = 8 } = req.query;
    const filtro = {};

    if (req.usuario.rol !== 'admin') {
      filtro.creadoPor = req.usuario.id;
    }
    if (especie) filtro.especie = especie;
    if (q) {
      filtro.$or = [
        { nombre: { $regex: q, $options: 'i' } },
        { duenoNombre: { $regex: q, $options: 'i' } },
      ];
    }

    const paginaActual = Math.max(1, parseInt(page, 10) || 1);
    const limite = Math.max(1, parseInt(limit, 10) || 8);

    const totalItems = await Mascota.countDocuments(filtro);
    const items = await Mascota.find(filtro)
      .populate('creadoPor', 'nombre email rol')
      .sort({ createdAt: -1 })
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
    const mascota = await Mascota.findById(req.params.id).populate('creadoPor', 'nombre email rol');
    if (!mascota) {
      return res.status(404).json({ mensaje: 'Mascota no encontrada' });
    }
    if (req.usuario.rol !== 'admin' && !esDueño(mascota, req.usuario)) {
      return res.status(403).json({ mensaje: 'No tenés permiso para ver esta mascota' });
    }
    res.json(mascota);
  } catch (error) {
    res.status(400).json({ mensaje: 'ID inválido' });
  }
}

async function crear(req, res) {
  try {
    const datos = { ...req.body };

    if (req.usuario.rol === 'admin' && req.body.propietario) {
      datos.creadoPor = req.body.propietario;
    } else {
      datos.creadoPor = req.usuario.id;
    }

    if (req.file) {
      datos.imagen = `/uploads/mascotas/${req.file.filename}`;
    }

    const mascota = await Mascota.create(datos);
    res.status(201).json(mascota);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

async function actualizar(req, res) {
  try {
    const existente = await Mascota.findById(req.params.id);
    if (!existente) {
      return res.status(404).json({ mensaje: 'Mascota no encontrada' });
    }
    if (req.usuario.rol !== 'admin' && !esDueño(existente, req.usuario)) {
      return res.status(403).json({ mensaje: 'No tenés permiso para editar esta mascota' });
    }

    const datos = { ...req.body };
    delete datos.creadoPor;

    if (req.usuario.rol === 'admin' && req.body.propietario) {
      datos.creadoPor = req.body.propietario;
    }

    if (req.file) {
      borrarImagen(existente.imagen);
      datos.imagen = `/uploads/mascotas/${req.file.filename}`;
    }

    const mascota = await Mascota.findByIdAndUpdate(req.params.id, datos, {
      new: true,
      runValidators: true,
    }).populate('creadoPor', 'nombre email rol');

    res.json(mascota);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

async function eliminar(req, res) {
  try {
    const mascota = await Mascota.findById(req.params.id);
    if (!mascota) {
      return res.status(404).json({ mensaje: 'Mascota no encontrada' });
    }
    if (req.usuario.rol !== 'admin' && !esDueño(mascota, req.usuario)) {
      return res.status(403).json({ mensaje: 'No tenés permiso para eliminar esta mascota' });
    }

    borrarImagen(mascota.imagen);
    await mascota.deleteOne();
    res.json({ mensaje: 'Mascota eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
