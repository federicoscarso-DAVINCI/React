const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

function generarToken(usuario) {
  return jwt.sign(
    { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

async function register(req, res) {
  try {
    const { nombre, email, password } = req.body;

    const existente = await Usuario.findOne({ email });
    if (existente) {
      return res.status(400).json({ mensaje: 'Ya existe un usuario con ese email' });
    }

    const hash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ nombre, email, password: hash, rol: 'user' });

    const token = generarToken(usuario);
    res.status(201).json({ token, usuario });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const coincide = await bcrypt.compare(password, usuario.password);
    if (!coincide) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = generarToken(usuario);
    res.json({ token, usuario });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function me(req, res) {
  const usuario = await Usuario.findById(req.usuario.id);
  if (!usuario) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }
  res.json(usuario);
}

module.exports = { register, login, me };
