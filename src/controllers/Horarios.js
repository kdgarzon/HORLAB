const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const pool = require('../dbconexion')

const uploadHorarios = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se envió ningún archivo' });

    //const filePath = path.join(__dirname, '..', req.file.path);
    const filePath = req.file.path;

    const registros = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        registros.push(data);
      })
      .on('end', async () => {
        for (const registro of registros) {
          const { periodo, dia, hora, asignatura, grupo, proyecto, 
            salon, area, edificio, sede, inscritos, docente } = registro;

          await pool.query(
            'INSERT INTO matrizgeneral (periodo, dia, hora, asignatura, grupo, proyecto, salon, area, edificio, sede, inscritos, docente) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
            [periodo, dia, hora, asignatura, grupo, proyecto, salon, area, edificio, sede, inscritos, docente]
          );
        }

        res.status(200).json({ message: 'Archivo procesado correctamente' });
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar el archivo' });
  }
};

module.exports = {
  uploadHorarios,
};
