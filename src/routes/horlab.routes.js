const { Router} = require('express');

const { 
    uploadHorarios, 
    upload,
    getExistsMatrizGeneral,
    deleteMatrizGeneral,
    filtrarHorarios,
    consultarPisosEdificio
} = require('../controllers/Horarios');

const {
    getUserLogin
} = require('../controllers/Validacion')

const {
    sendResetPasswordEmail,
    resetPassword
} = require('../controllers/Contrasena')

const {
    getAllRoles
} = require('../controllers/Rol')

const {
    getAllUsers, 
    getUser,
    createUser, 
    deleteUser, 
    updateUser
} = require('../controllers/Usuario')

const {
    getAllSubjects,
    getSubject,
    createSubject,
    deleteSubject,
    updateSubject
} = require('../controllers/Asignatura')

const {
    getAllGroups,
    getGroup,
    createGroup,
    deleteGroup,
    updateGroup,
    getNextGroupConsecutive
} = require('../controllers/Grupo')

const {
    getAllDays
} = require('../controllers/Dia')

const {
    getAllHours
} = require('../controllers/Hora')

const {    
    getAllProjects,
    getProjectsToSubject
} = require('../controllers/Proyecto')

const {
    getAllTeachers,
    getTeacher,
    createTeacher,
    deleteTeacher,
    updateTeacher
} = require('../controllers/Docente')

const {
    getAllClassrooms,
    getClassroom,
    createClassroom,
    deleteClassroom,
    updateClassroom
} = require('../controllers/Salon')

const {
    getBuildings
} = require('../controllers/Edificio')

const { 
    getTeacherSchedule 
} = require('../controllers/HorarioDocente')

const { 
    getAllFloors,
    getFloor
} = require('../controllers/Pisos')

const {
    getAllClassroomByFloor,
    getClassroomByFloor
} = require('../controllers/AulasPisos')

const {
    getAllFacultades,
    getFacultad
} = require('../controllers/Facultad')

const {
    getAllPeriods,
    getPeriod,
} = require('../controllers/Periodo')

const router = Router(); //Nos permite crear nuevas URL

router.post('/Login', getUserLogin)

//RUTAS PARA EL CONTROLADOR DE USUARIO
router.get('/users', getAllUsers)
router.get('/roles', getAllRoles)
router.get('/users/:id', getUser)
router.post('/users', createUser)
router.delete('/users/:idusuarioEliminar', deleteUser)
router.put('/users/:idusuarioActualizar', updateUser)
router.post('/forgot-password', sendResetPasswordEmail);
router.post('/reset-password/:token', resetPassword);

//RUTAS PARA EL CONTROLADOR DE ASIGNATURAS
router.get('/subjects', getAllSubjects)
router.get('/subjects/:id', getSubject)
router.post('/subjects', createSubject)
router.delete('/subjects/:idsubjectEliminar', deleteSubject)
router.put('/subjects/:idsubjectActualizar', updateSubject)

// RUTAS RELACIONADAS: GRUPOS DENTRO DE UNA ASIGNATURA
router.get('/subjects/:id/groups', getAllGroups)
router.get('/subjects/:id_asignatura/groups/:id_grupo', getGroup)
router.post('/subjects/:id_asignatura/groups', createGroup)
router.delete('/subjects/:id_asignatura/groups/:idgroupEliminar', deleteGroup)
router.put('/subjects/:id_asignatura/groups/:idgroupActualizar', updateGroup)
router.get('/days', getAllDays) 
router.get('/hours', getAllHours)
router.get('/projects', getAllProjects) 
router.get('/subjects/:id_asignatura/projects', getProjectsToSubject);
router.get('/subjects/:id_asignatura/projects/:id_proyecto/consecutive', getNextGroupConsecutive);

//RUTAS PARA EL CONTROLADOR DE DOCENTE
router.get('/teachers', getAllTeachers)
router.get('/teachers/:id', getTeacher)
router.get('/teachers/:id/disponibilidad', getTeacherSchedule); // Obtener disponibilidad horaria de un docente
router.post('/teachers', createTeacher)
router.delete('/teachers/:iddocenteEliminar', deleteTeacher)
router.put('/teachers/:iddocenteActualizar', updateTeacher)

//RUTAS PARA EL CONTROLADOR DE SALONES
router.get('/classrooms', getAllClassrooms)
router.get('/classrooms/:id', getClassroom)
router.post('/classrooms', createClassroom)
router.delete('/classrooms/:idclassroomEliminar', deleteClassroom)
router.put('/classrooms/:idclassroomActualizar', updateClassroom)
router.get('/buildings', getBuildings); // Obtener todos los edificios

//RUTAS PARA EL CONTROLADOR DE PISOS
router.get('/floors', getAllFloors);
router.get('/floors/:id', getFloor);

//RUTAS PARA EL CONTROLADOR DE AULAS POR PISO
router.get('/floors/:idFloor/classrooms', getAllClassroomByFloor);
router.get('/floors/:idFloor/classrooms/:idClassroom/:idBuilding', getClassroomByFloor);

//RUTAS PARA EL CONTROLADOR DE FACULTADES
router.get('/faculties', getAllFacultades);
router.get('/faculties/:id', getFacultad);

// RUTAS PARA EL CONTROLADOR DE PERIODO
router.get('/periods', getAllPeriods);
router.get('/periods/:id', getPeriod);

// RUTAS PARA EL CONTROLADOR DE HORARIO
router.post('/upload-horarios', upload.single('csv'), uploadHorarios);    
router.get('/matrizgeneral/exists', getExistsMatrizGeneral); 
router.delete('/matrizgeneral', deleteMatrizGeneral);
router.get('/schedule/filtrar/:idEdificio/:idpiso/:idDia', filtrarHorarios);
router.get('/buildings/:idBuilding/floors', consultarPisosEdificio);

module.exports = router; //Se exporta una función

