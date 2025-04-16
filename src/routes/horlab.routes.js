const { Router} = require('express');

const {
    getAllUsers, 
    getUser, 
    createUser, 
    deleteUser, 
    updateUser
} = require('../controllers/controllerUser')

const {
    getAllSubjects,
    getSubject,
    createSubject,
    deleteSubject,
    updateSubject
} = require('../controllers/controllerAsignaturas')

const {
    getAllTeachers,
    getTeacher,
    createTeacher,
    deleteTeacher,
    updateTeacher
} = require('../controllers/controllerDocente')

const {
    getAllClassrooms,
    getClassroom,
    createClassroom,
    deleteClassroom,
    updateClassroom
} = require('../controllers/controllerSalones')


const router = Router(); //Nos permite crear nuevas URL

//RUTAS PARA EL CONTROLADOR DE USUARIO
router.get('/users', getAllUsers)
router.get('/users/:id', getUser)
router.post('/users', createUser)
router.delete('/users/:idusuarioEliminar', deleteUser)
router.put('/users/:idusuarioActualizar', updateUser)

//RUTAS PARA EL CONTROLADOR DE ASIGNATURAS
router.get('/subjects', getAllSubjects)
router.get('/subjects/:id', getSubject)
router.post('/subjects', createSubject)
router.delete('/subjects/:idsubjectEliminar', deleteSubject)
router.put('/subjects/:idsubjectActualizar', updateSubject)

//RUTAS PARA EL CONTROLADOR DE DOCENTE
router.get('/teachers', getAllTeachers)
router.get('/teachers/:id', getTeacher)
router.post('/teachers', createTeacher)
router.delete('/teachers/:iddocenteEliminar', deleteTeacher)
router.put('/teachers/:iddocenteActualizar', updateTeacher)

//RUTAS PARA EL CONTROLADOR DE SALONES
router.get('/classrooms', getAllClassrooms)
router.get('/classrooms/:id', getClassroom)
router.post('/classrooms', createClassroom)
router.delete('/classrooms/:idclassroomEliminar', deleteClassroom)
router.put('/classrooms/:idclassroomActualizar', updateClassroom)


module.exports = router; //Se exporta una función

