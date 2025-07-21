const fs = require('fs');
const path = require('path');
const multer = require('multer');
const csv = require('csv-parser');
const pool = require('../dbconexion')

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

async function insertarDatosUnicos(tabla, columna) {
  try {
    await pool.query(`
      INSERT INTO ${tabla} (${columna})
      SELECT DISTINCT ${columna} FROM matrizgeneral
      WHERE ${columna} IS NOT NULL
      ON CONFLICT (${columna}) DO NOTHING
    `);
  } catch (error) {
    console.error(`Error insertando en tabla ${tabla}:`, error.message);
  }
}


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
        console.log('Registro leído:', data); 
        registros.push(data);
      })
      .on('end', async () => {
        for (const registro of registros) {
          try {
            const values = [
              registro['Periodo']?.trim(),
              registro['Dia']?.trim(),
              registro['Hora']?.trim(),
              registro['Asignatura']?.trim(),
              registro['Grupo']?.trim(),
              registro['Proyecto']?.trim(),
              registro['Salon']?.trim(),
              registro['Area']?.trim(),
              registro['Edificio']?.trim(),
              registro['Sede']?.trim(),
              registro['Inscritos']?.trim(),
              registro['Docente']?.trim()
            ];

            await pool.query(
              'INSERT INTO matrizgeneral (periodo, dia, hora, asignatura, grupo, proyecto, salon, area, edificio, sede, inscritos, docente) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
              values
            ); 
          } catch (error) {
            console.error('Error insertando registro:', registro, '\n', error.message);
          }
        }

        const tablasYColumnas = [
          { tabla: 'Periodo', columna: 'periodo' },
          { tabla: 'Facultad', columna: 'facultad' },
          { tabla: 'Edificio', columna: 'edificio' },
          { tabla: 'Docentes', columna: 'nombre' }
          { tabla: 'Dia', columna: 'dia' },
          { tabla: 'Hora', columna: 'hora' },
        ];

        for (const { tabla, columna } of tablasYColumnas) {
          await insertarDatosUnicos(tabla, columna);
        }

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
    await pool.query('DELETE FROM matrizgeneral');
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
