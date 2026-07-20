const mongoose = require('mongoose');

const turnoSchema = new mongoose.Schema(
  {
    mascota: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mascota',
      required: [true, 'El turno debe estar asociado a una mascota'],
    },
    fecha: {
      type: Date,
      required: [true, 'La fecha del turno es obligatoria'],
    },
    motivo: {
      type: String,
      required: [true, 'El motivo del turno es obligatorio'],
      trim: true,
      minlength: [3, 'El motivo debe tener al menos 3 caracteres'],
    },
    veterinario: {
      type: String,
      required: [true, 'El nombre del veterinario es obligatorio'],
      trim: true,
    },
    estado: {
      type: String,
      enum: ['Pendiente', 'Confirmado', 'Completado', 'Cancelado'],
      default: 'Pendiente',
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Turno', turnoSchema);
