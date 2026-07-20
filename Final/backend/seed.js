require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Usuario = require('./models/Usuario');

async function seed() {
  await connectDB();

  const usuarios = [
    { nombre: 'Admin VetCare', email: 'admin@vetcare.com', password: 'admin123', rol: 'admin' },
    { nombre: 'Usuario Demo', email: 'user@vetcare.com', password: 'user1234', rol: 'user' },
  ];

  for (const datos of usuarios) {
    const existente = await Usuario.findOne({ email: datos.email });
    if (existente) {
      console.log(`Ya existe: ${datos.email}`);
      continue;
    }
    const password = await bcrypt.hash(datos.password, 10);
    await Usuario.create({ ...datos, password });
    console.log(`Usuario creado: ${datos.email}`);
  }

  console.log('Seed completado.');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Error en el seed:', error.message);
  process.exit(1);
});
