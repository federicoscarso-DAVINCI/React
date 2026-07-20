const Usuario = require('../models/Usuario');

async function listar(req, res) {
  try {
    const usuarios = await Usuario.find().select('nombre email rol').sort({ nombre: 1 });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

module.exports = { listar };
