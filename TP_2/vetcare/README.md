Estructura del proyecto vetcare/src/:


data/
  users.json       — 3 usuarios (1 admin, 2 usuarios)
  mascotas.json    — 4 mascotas de ejemplo
  turnos.json      — 4 turnos de ejemplo

context/
  AuthContext.jsx  — login, logout, persistencia en localStorage
  DataContext.jsx  — CRUD completo de mascotas, turnos y usuarios

components/
  Navbar.jsx           — barra de nav con links según rol
  PrivateRoute.jsx     — protección de rutas (con adminOnly)
  PetCard.jsx          — card de mascota
  AppointmentCard.jsx  — card de turno con fecha/estado

pages/
  LoginPage.jsx        — form con validación
  HomePage.jsx         — dashboard con stats
  MascotasPage.jsx     — lista con búsqueda y filtros por especie
  MascotaDetailPage.jsx— detalle + historial de turnos
  MascotaFormPage.jsx  — crear/editar mascota
  TurnosPage.jsx       — lista con filtros por estado/fecha
  TurnoFormPage.jsx    — crear/editar turno
  UsuariosPage.jsx     — gestión de usuarios (solo admin)
  NotFoundPage.jsx     — 404
Credenciales de prueba:

Admin: admin@vetcare.com / admin123
Usuario: juan@mail.com / juan123
Usuario: maria@mail.com / maria123
