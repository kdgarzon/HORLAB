const { crearTablas } = require('./Database/CrearTablas');
const { insertarRegistro, insertarDatosRelacionados } = require('./Database/InsertarDatos');
const { eliminarTablas } = require('./Database/BorrarTablas');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const csv = require('csv-parser');
const pool = require('../dbconexion');
const { Console } = require('console');

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
  const idEdificio = parseInt(req.params.idEdificio, 10);
  const idPiso = parseInt(req.params.idpiso, 10);
  const idDia = parseInt(req.params.idDia, 10);

  if (isNaN(idEdificio) || isNaN(idPiso) || isNaN(idDia)) {
    return res.status(400).json({ error: "Parámetros inválidos (idEdificio, idPiso, idDia son requeridos)." });
  }

  try {
    const result = await pool.query(`
      SELECT 
        g.id_grupo,
        g.grupo,
        g.inscritos,
        a.codigo_asig,
        a.nombre AS asignatura,
        d.nombre AS docente,
        h.hora,
        di.dia,
        s.nombre AS salon,
        p.nombre AS piso,
        e.edificio,
        pr.proyecto,
        f.facultad
      FROM Horarios ho
      JOIN Grupos g ON ho.id_grupo = g.id_grupo
      LEFT JOIN Asignaturas a ON g.id_asignatura = a.id_asignatura
      LEFT JOIN DocenteGrupo dg ON g.id_grupo = dg.id_grupo
      LEFT JOIN Docentes d ON dg.id_docente = d.id_docente
      LEFT JOIN Hora h ON g.id_hora = h.id_hora
      LEFT JOIN Dia di ON g.id_dia = di.id_dia
      JOIN Salones s ON ho.id_salon = s.id_salon
      JOIN AulasPisos ap ON s.nombre = ap.nombre_aula AND s.id_edificio = ap.id_edificio
      JOIN Pisos p ON ap.id_piso = p.id_piso
      JOIN Edificio e ON ap.id_edificio = e.id_edificio
      LEFT JOIN Proyecto pr ON g.id_proyecto = pr.id_proyecto
      LEFT JOIN Facultad f ON pr.id_facultad = f.id_facultad
      WHERE e.id_edificio = $1
        AND p.id_piso = $2
        AND di.id_dia = $3
      ORDER BY h.id_hora, g.grupo;
    `, [idEdificio, idPiso, idDia ]);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al filtrar horarios" });
  }
};

const consultarPisosEdificio = async (req, res) => {
  const idEdificio = parseInt(req.params.idBuilding, 10);
  if (isNaN(idEdificio)) {
    return res.status(400).json({ error: 'ID de edificio inválido' });
  }

  try {
    const result = await pool.query(`
      SELECT DISTINCT p.id_piso, p.nombre
      FROM aulaspisos ap
      JOIN pisos p ON ap.id_piso = p.id_piso
      WHERE ap.id_edificio = $1
      ORDER BY p.id_piso;
    `, [idEdificio]);
    
    if (result.rows.length === 0) {
      return res.status(200).json({ pisos: [], message: 'No hay pisos asociados' });
    }

    /*const pisos = result.rows.map(r => r.nombre);
    res.json({ pisos });*/
    res.json({ pisos: result.rows });
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
