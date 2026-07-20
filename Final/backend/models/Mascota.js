const mongoose = require('mongoose');

const mascotaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre de la mascota es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    },
    especie: {
      type: String,
      required: [true, 'La especie es obligatoria'],
      enum: ['Perro', 'Gato', 'Ave', 'Reptil', 'Roedor', 'Otro'],
    },
    raza: {
      type: String,
      trim: true,
      default: '',
    },
    edad: {
      type: Number,
      required: [true, 'La edad es obligatoria'],
      min: [0, 'La edad no puede ser negativa'],
      max: [50, 'La edad ingresada no es válida'],
    },
    duenoNombre: {
      type: String,
      required: [true, 'El nombre del dueño es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre del dueño debe tener al menos 2 caracteres'],
    },
    duenoEmail: {
      type: String,
      required: [true, 'El email del dueño es obligatorio'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'El email del dueño no es válido'],
    },
    duenoTelefono: {
      type: String,
      trim: true,
      default: '',
    },
    observaciones: {
      type: String,
      trim: true,
      default: '',
    },
    imagen: {
      type: String,
      default: '',
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mascota', mascotaSchema);
