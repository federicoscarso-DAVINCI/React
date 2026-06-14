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

VetCare — Manual de usuario
Acceso
La app arranca en el login. Hay tres usuarios de prueba:

Usuario	Email	Contraseña	Rol
Dr. Carlos López	admin@vetcare.com	admin123	Admin
Juan Pérez	juan@mail.com	juan123	Usuario
María García	maria@mail.com	maria123	Usuario
Diferencia entre roles
Función	Admin	Usuario
Ver todas las mascotas	✅	❌ (solo las propias)
Ver todos los turnos	✅	❌ (solo los propios)
Asignar propietario a mascota	✅	❌
Cambiar estado de turno	✅	❌
Gestionar usuarios	✅	❌
Agregar/editar/eliminar sus propias mascotas	✅	✅
Agendar turnos	✅	✅
Secciones
Inicio (Dashboard)
Muestra estadísticas generales (mascotas, turnos pendientes, confirmados) y una tabla con los próximos turnos. Tiene accesos rápidos para crear mascota o turno.

Mascotas
Lista todas las mascotas (admin) o solo las tuyas (usuario)
Podés buscar por nombre y filtrar por especie
Botones Ver detalle, Editar y Eliminar en cada card
Al eliminar una mascota se eliminan también sus turnos automáticamente
Detalle de mascota
Muestra todos los datos del animal (especie, raza, edad, peso, color, observaciones) y el historial completo de turnos. Desde ahí también podés crear un nuevo turno para esa mascota directamente.

Turnos
Lista todos los turnos ordenados por fecha
Filtrá por estado (Pendiente / Confirmado / Cancelado) o por fecha
Cada card muestra el día, hora, motivo, mascota y estado con color
Formulario de turno
Seleccionás la mascota, fecha, horario y motivo
El admin además puede cambiar el estado (pendiente / confirmado / cancelado)
No se puede seleccionar una fecha pasada al crear un turno nuevo
Usuarios (solo admin)
Tabla con todos los usuarios registrados
Podés crear nuevos usuarios, editarlos (incluido cambio de contraseña y rol) o eliminarlos
No se puede eliminar al propio admin ni a otro administrador
Validaciones en formularios
Todos los formularios validan campos vacíos antes de guardar y muestran mensajes de error en rojo debajo de cada campo. En el login, si el email o contraseña son incorrectos, aparece un mensaje de error general.

Datos
Los datos no persisten al recargar la página (se reinician desde los JSON locales), excepto la sesión del usuario que queda guardada en localStorage hasta que hagas logout.
