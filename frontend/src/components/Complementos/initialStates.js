export const initialUserState = {
  nombreUser: '',
  apellidoUser: '',
  correo: '',
  usuario: '',
  pass: '',
  id_rol: null
};

export const initialGroupState = {
  periodo: '',
  dia: '',
  hora: '',
  grupo: '',
  id_asignatura: null,
  proyecto: '',
  inscritos: 0
};

export const initialDocenteState = {
  nombre: ''
};

export const initialSubjectState = {
  codigo_asig: '',
  nombre: ''
};

export const initialClassroomState = { //PENDIENTE REVISAR
  id_salon: '',
  nombre: '',
  id_edificio: null,
  capacidad: 0,
  area: 0
};