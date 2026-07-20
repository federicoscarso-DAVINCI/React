require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Usuario = require('./models/Usuario');
const Mascota = require('./models/Mascota');
const Turno = require('./models/Turno');

const USUARIOS = [
  { nombre: 'Admin VetCare', email: 'admin@vetcare.com', password: 'admin123', rol: 'admin' },
  { nombre: 'Usuario Demo', email: 'user@vetcare.com', password: 'user1234', rol: 'user' },
  { nombre: 'Usuario Demo 2', email: 'user2@vetcare.com', password: 'user1234', rol: 'user' },
];

const NOMBRES_MASCOTA = [
  'Firulais', 'Luna', 'Rocky', 'Milo', 'Nina', 'Toby', 'Bella', 'Max', 'Coco', 'Pelusa',
  'Simba', 'Kiara', 'Rex', 'Duna', 'Bruno', 'Mia', 'Thor', 'Frida', 'Chispa', 'Canela',
  'Zeus', 'Lola', 'Pipo', 'Estrella',
];

const RAZAS_POR_ESPECIE = {
  Perro: ['Labrador', 'Caniche', 'Bulldog', 'Mestizo', 'Ovejero Alemán'],
  Gato: ['Siamés', 'Persa', 'Mestizo', 'Angora'],
  Ave: ['Canario', 'Loro', 'Cotorra'],
  Reptil: ['Tortuga', 'Iguana'],
  Roedor: ['Hámster', 'Cuyo'],
  Otro: ['Conejo'],
};

const ESPECIES = Object.keys(RAZAS_POR_ESPECIE);

const DUENOS = [
  { nombre: 'Federico Scarso', email: 'federico@example.com', telefono: '11-5555-0001' },
  { nombre: 'Ana Gómez', email: 'ana@example.com', telefono: '11-5555-0002' },
  { nombre: 'Carlos Díaz', email: 'carlos@example.com', telefono: '11-5555-0003' },
  { nombre: 'Sofía Ruiz', email: 'sofia@example.com', telefono: '11-5555-0004' },
  { nombre: 'Marcos Peña', email: 'marcos@example.com', telefono: '11-5555-0005' },
];

const VETERINARIOS = ['Dra. López', 'Dr. Fernández', 'Dra. Martínez', 'Dr. Suárez'];
const MOTIVOS = [
  'Vacunación', 'Control anual', 'Desparasitación', 'Consulta general',
  'Cirugía menor', 'Revisión post-operatoria', 'Corte de uñas', 'Chequeo dental',
];
const ESTADOS = ['Pendiente', 'Confirmado', 'Completado', 'Cancelado'];

async function crearUsuarios() {
  const idsPorEmail = {};
  for (const datos of USUARIOS) {
    let usuario = await Usuario.findOne({ email: datos.email });
    if (!usuario) {
      const password = await bcrypt.hash(datos.password, 10);
      usuario = await Usuario.create({ ...datos, password });
      console.log(`Usuario creado: ${datos.email}`);
    } else {
      console.log(`Ya existe: ${datos.email}`);
    }
    idsPorEmail[datos.email] = usuario._id;
  }
  return idsPorEmail;
}

async function crearMascotasDummy(idsPorEmail) {
  const propietarios = [idsPorEmail['admin@vetcare.com'], idsPorEmail['user@vetcare.com'], idsPorEmail['user2@vetcare.com']];

  const definiciones = NOMBRES_MASCOTA.map((nombre, i) => {
    const especie = ESPECIES[i % ESPECIES.length];
    const razas = RAZAS_POR_ESPECIE[especie];
    const dueno = DUENOS[i % DUENOS.length];

    return {
      nombre,
      especie,
      raza: razas[i % razas.length],
      edad: (i % 12) + 1,
      duenoNombre: dueno.nombre,
      duenoEmail: dueno.email,
      duenoTelefono: dueno.telefono,
      observaciones: i % 3 === 0 ? 'Paciente tranquilo, sin antecedentes relevantes.' : '',
      creadoPor: propietarios[i % propietarios.length],
    };
  });

  // Idempotente: solo crea las que todavía no existen (identificadas por nombre + email del dueño),
  // para no duplicar en corridas sucesivas ni tocar mascotas reales cargadas desde la app.
  const todas = [];
  let nuevas = 0;
  for (const datos of definiciones) {
    let mascota = await Mascota.findOne({ nombre: datos.nombre, duenoEmail: datos.duenoEmail });
    if (!mascota) {
      mascota = await Mascota.create(datos);
      nuevas += 1;
    }
    todas.push(mascota);
  }
  console.log(`Mascotas dummy: ${nuevas} nuevas, ${todas.length - nuevas} ya existían.`);
  return todas;
}

async function crearTurnosDummy(mascotas) {
  if (mascotas.length === 0) return;

  let nuevos = 0;
  for (let i = 0; i < 18; i += 1) {
    const mascota = mascotas[i % mascotas.length];
    const motivo = MOTIVOS[i % MOTIVOS.length];
    const veterinario = VETERINARIOS[i % VETERINARIOS.length];

    // Idempotente: si ya existe un turno igual para esa mascota, no lo duplica.
    const yaExiste = await Turno.findOne({ mascota: mascota._id, motivo, veterinario });
    if (yaExiste) continue;

    const fecha = new Date();
    fecha.setDate(fecha.getDate() + (i - 9) * 2);
    fecha.setHours(9 + (i % 8), 0, 0, 0);

    await Turno.create({
      mascota: mascota._id,
      fecha,
      motivo,
      veterinario,
      estado: ESTADOS[i % ESTADOS.length],
      creadoPor: mascota.creadoPor,
    });
    nuevos += 1;
  }
  console.log(`Turnos dummy nuevos: ${nuevos}`);
}

async function seed() {
  await connectDB();

  const idsPorEmail = await crearUsuarios();
  const mascotasNuevas = await crearMascotasDummy(idsPorEmail);
  await crearTurnosDummy(mascotasNuevas);

  console.log('Seed completado.');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Error en el seed:', error.message);
  process.exit(1);
});
