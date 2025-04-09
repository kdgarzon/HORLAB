const { Router} = require('express');

const router = Router(); //Nos permite crear nuevas URL

router.get('/schedule', (req, res) => {
    res.send('Retornando los datos disponibles de horarios');
})

/*router.get('/schedule/10', (req, res) => {
    res.send('Retornando el dato solicitado');
})*/

router.post('/schedule', (req, res) => {
    res.send('Insertando datos');
})

router.delete('/schedule', (req, res) => {
    res.send('Eliminando datos');
})

router.put('/schedule', (req, res) => {
    res.send('Actualizando datos');
})

module.exports = router; //Se exporta una función

