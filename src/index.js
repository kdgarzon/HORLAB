const express = require('express');
const morgan = require('morgan');

const horLabRoutes = require('./routes/horlab.routes'); //Se importa una función para mostrarla en el frontend

const app = express();
app.use(morgan('dev'));
app.use(horLabRoutes);

app.listen(4000)
console.log('Server on port 4000');
