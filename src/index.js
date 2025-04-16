const express = require('express');
const morgan = require('morgan');
const cors = require('cors')

const horLabRoutes = require('./routes/horlab.routes'); //Se importa una función para mostrarla en el frontend

const app = express();
app.use(cors()); //Permite comunicaar ambos servidores BACKEND Y FRONTEND
app.use(morgan('dev'));
app.use(express.json());


app.use(horLabRoutes);
app.use((err, req, res, next) => {
    return res.json({
        message: err.message
    })
})

app.listen(5000)
console.log('Server on port 5000');
