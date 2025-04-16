const { Router} = require('express');
//const pool = require('../dbconexion');
const {
    getAllUsers, 
    getUser, 
    createUser, 
    deleteUser, 
    updateUser} = require('../controllers/horlab.controller')


const router = Router(); //Nos permite crear nuevas URL

router.get('/schedule', getAllUsers)

router.get('/schedule/:id', getUser)

router.post('/schedule', createUser)

router.delete('/schedule/:idusuarioEliminar', deleteUser)

router.put('/schedule/:idusuarioActualizar', updateUser)

module.exports = router; //Se exporta una función

