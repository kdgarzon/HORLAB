const { crearTablas } = require('./Database/CrearTablas');
const { insertarRegistro, insertarDatosRelacionados } = require('./Database/InsertarDatos');
const { eliminarTablas } = require('./Database/BorrarTablas');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const csv = require('csv-parser');
const pool = require('../dbconexion');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'doc'));
  },
  filename: function (req, file, cb) {
    cb(null, `horariosUniversidad.csv`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos CSV.'), false);
  }
};

const upload = multer({ storage, fileFilter });

const uploadHorarios = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se envió ningún archivo' });

    const filePath = req.file.path;
    const registros = [];

    fs.createReadStream(filePath)
      .pipe(csv({ 
        separator: ';',
        mapHeaders: ({ header }) => header?.trim()
      }))
      .on('data', (data) => {
        //console.log('Registro leído:', data); 
        registros.push(data);
      })
      .on('end', async () => {
        await crearTablas();
        for (const registro of registros) {
          try {
            await insertarRegistro(registro);
          } catch (error) {
            console.error('Error insertando registro:', registro, '\n', error.message);
          }
        }
        await insertarDatosRelacionados();
        fs.unlinkSync(filePath); // Eliminar el archivo después de procesarlo
        res.status(200).json({ message: 'Archivo procesado correctamente' });
      });

  } catch (err) {
    console.error('Error al insertar datos:', err);
    res.status(500).json({ error: 'Error al procesar el archivo' });
  }
};

const getExistsMatrizGeneral = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM matrizgeneral');
     const count = parseInt(result.rows[0].count, 10);
    res.json({ exists: count > 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al verificar existencia de datos' });
  }
}

const deleteMatrizGeneral = async (req, res) => {
  try {
    await eliminarTablas();
    res.status(200).json({ message: 'Todos los datos de horarios han sido eliminados correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar los datos de horarios' });
  }
};

module.exports = {
  uploadHorarios,
  upload,
  getExistsMatrizGeneral,
  deleteMatrizGeneral
};
