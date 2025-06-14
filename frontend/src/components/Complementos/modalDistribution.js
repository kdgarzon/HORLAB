export const columnsGroups = [
  //{ id: 'id_grupo', label: 'ID Grupo', align: 'center', minWidth: 50 },
  { id: 'dia', label: 'Dia', minWidth: 50, align: 'center' },
  { id: 'hora', label: 'Franja Horaria', minWidth: 50, align: 'center' },
  { id: 'grupo', label: 'Grupo', align: 'center' },
  { id: 'nombre', label: 'Asignatura', align: 'center'},
  {id: 'proyecto', label: 'Proyecto', align: 'center', minWidth: 80},
  {id: 'inscritos', label: 'Número de inscritos', align: 'center'}
];

export const columnsUsers = [
  { id: 'id_usuario', label: 'ID Usuario'},
  { id: 'nombre', label: 'Nombre del usuario', minWidth: 100 },
  { id: 'apellido', label: 'Apellido del usuario', minWidth: 100 },
  { id: 'correo', label: 'Correo institucional' },
  { id: 'usuario', label: 'Usuario'},
  {id: 'pass', label: 'Contraseña', align: 'right'},
  {id: 'nombre_rol', label: 'Rol de usuario', align: 'right'}
];

export const columnsDocentes = [
  { id: 'id_docente', label: 'ID Docente'},
  { id: 'nombre', label: 'Nombre del docente'}
];

export const columnsSubjects = [
  { id: 'id_asignatura', label: 'ID Asignatura'},
  { id: 'codigo_asig', label: 'Código de asignatura', minWidth: 100 },
  { id: 'nombre', label: 'Asignatura', minWidth: 100 }
];

export const columnsClassrooms = [ //PENDIENTE REVISAR
  { id: 'id_salon', label: 'ID Sala'},
  { id: 'nombre', label: 'Nombre de sala', minWidth: 100 },
  { id: 'edificio', label: 'Edificio', minWidth: 100 },
  { id: 'capacidad', label: 'Capacidad', minWidth: 100, align: 'center' },
  { id: 'area', label: 'Área (m2)', minWidth: 100, align: 'center' }
];