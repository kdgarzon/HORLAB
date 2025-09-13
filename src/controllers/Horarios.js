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

const filtrarHorarios = async (req, res) => {
  try {
    const {dia, hora } = req.query;
    const query = `
      SELECT 
        d.dia,
        h.hora,
        a.nombre AS asignatura,
        g.grupo,
        doc.nombre AS docente,
        s.nombre AS salon
      FROM grupos g
      JOIN periodo p ON g.id_periodo = p.id_periodo
      JOIN dia d ON g.id_dia = d.id_dia
      JOIN hora h ON g.id_hora = h.id_hora
      JOIN asignaturas a ON g.id_asignatura = a.id_asignatura
      JOIN proyecto pr ON g.id_proyecto = pr.id_proyecto
      LEFT JOIN DocenteGrupo dg ON g.id_grupo = dg.id_grupo
      LEFT JOIN docentes doc ON dg.id_docente = doc.id_docente
      LEFT JOIN matrizgeneral mg ON mg.grupo = g.grupo 
          AND mg.periodo = p.periodo 
          AND mg.dia = d.dia 
          AND mg.hora = h.hora
      LEFT JOIN salones s ON mg.salon = s.nombre
      WHERE ($1::VARCHAR IS NULL OR d.dia = $1)
        AND ($2::VARCHAR IS NULL OR h.hora = $2)
      ORDER BY d.dia, h.hora;
    `;
    const result = await pool.query( query, [dia || null, hora || null]); 
    res.json(result.rows);
    //console.log(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener datos de grupos para este edificio:' });
  }
};

const consultarPisosEdificio = async (req, res) => {
  const { edificio } = req.params;
  try {
    const query = `
      SELECT p.nombre AS piso
      FROM aulaspisos ap
      JOIN pisos p ON ap.id_piso = p.id_piso
      JOIN edificio e ON ap.id_edificio = e.id_edificio
      WHERE e.edificio = $1
      ORDER BY p.nombre ASC;
    `;
    const result = await pool.query(query, [edificio]);
    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'No hay pisos asociados', pisos: [] });
    }
    res.json({ pisos: result.rows.map(row => row.piso) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener datos de pisos para este edificio:' });
  }
}

module.exports = {
  uploadHorarios,
  upload,
  getExistsMatrizGeneral,
  deleteMatrizGeneral,
  filtrarHorarios,
  consultarPisosEdificio
};
