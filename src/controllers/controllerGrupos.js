const pool = require('../dbconexion')
const { getAllSubjects } = require('./Asignatura');

const getAllGroups = async (req, res, next) => {
    const {id} = req.params
    try {
        const allGroups = await pool.query(`
        SELECT 
            g.id_grupo, p.periodo, d.dia, h.hora, a.nombre, proj.proyecto, g.grupo, g.inscritos 
        FROM Grupos g
        JOIN Periodo p ON g.id_periodo = p.id_periodo
        JOIN Dia d ON g.id_dia = d.id_dia
        JOIN Hora h ON g.id_hora = h.id_hora
        JOIN Asignaturas a ON g.id_asignatura = a.id_asignatura
        JOIN Proyecto proj ON g.id_proyecto = proj.id_proyecto
        WHERE g.id_asignatura = $1 
        ORDER BY d.orden, h.hora
        `, [id]);
        res.json(allGroups.rows)
    } catch (err) {
        next(err)
        res.status(500).send("Error al obtener los grupos.");
    }
}

const getGroup = async (req, res, next) => {
    try {
        const {id_asignatura, id_grupo} = req.params
        const result = await pool.query(`
            SELECT 
                g.id_grupo, p.periodo, g.grupo, g.inscritos, d.dia, h.hora, proj.proyecto
            FROM Grupos g
            JOIN Periodo p ON g.id_periodo = p.id_periodo
            JOIN Dia d ON g.id_dia = d.id_dia
            JOIN Hora h ON g.id_hora = h.id_hora
            JOIN Proyecto proj ON g.id_proyecto = proj.id_proyecto
            WHERE g.id_asignatura = $1 AND g.id_grupo = $2
        `, [id_asignatura, id_grupo]);
    
        if(result.rows.length === 0) return res.status(404).json({
            message: "Grupo no encontrado para esta asignatura en la base de datos"
        });
        res.json(result.rows[0]);
    } catch (error) {
        next(error)
    }
}

const createGroup = async (req, res, next) => {
    const {id_periodo, id_dia, id_hora, grupo, id_asignatura, id_proyecto, inscritos} = req.body
    try {
        const result = await pool.query(`
            INSERT INTO Grupos (id_periodo, id_dia, id_hora, grupo, id_asignatura, id_proyecto, inscritos)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, 
        [
            id_periodo,
            id_dia,
            id_hora,
            grupo,
            id_asignatura, 
            id_proyecto,
            inscritos
        ]);
        res.json(result.rows[0])
    } catch (error) {
        next(error)
    }
}

const deleteGroup = async (req, res, next) => {
    const {idgrupoeliminar} = req.params
    try {
        const result = await pool.query("DELETE FROM grupos WHERE id_grupo = $1", [idgrupoeliminar])
    
        if(result.rowCount === 0) return res.status(400).json({
            message: "El grupo no se ha podido eliminar"
        });
        
        return res.sendStatus(204);
    } catch (error) {
        next(error)
    }
}

const updateGroup = async (req, res, next) => {
    const {idgrupoActualizar} = req.params;
    try {
        const {id_periodo, id_dia, id_hora, grupo, id_asignatura, id_proyecto, inscritos} = req.body;
        const result = await pool.query(`
            UPDATE Grupos
            SET id_periodo = $1 id_dia = $2, id_hora = $3, grupo = $4, id_asignatura = $5, id_proyecto = $6, inscritos = $7
            WHERE id_grupo = $8 RETURNING *`, 
        [
            id_periodo,
            id_dia,
            id_hora,
            grupo,
            id_asignatura, 
            id_proyecto,
            inscritos,
            idgrupoActualizar
        ]);

        if(result.rows.length === 0) return res.status(404).json({
            message: "No es posible modificar el grupo seleccionado"
        });
        return res.json(result.rows[0])
    } catch (error) {
        next(error)
    }
}

const getAllDays = async (req, res, next) => {
    try {
        const result = await pool.query("SELECT * FROM Dia ORDER BY orden");
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getAllHours = async (req, res, next) => {
    try {
        const result = await pool.query("SELECT * FROM Hora ORDER BY hora");
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getAllProjects = async (req, res, next) => {
    try {
        const result = await pool.query("SELECT * FROM Proyecto ORDER BY proyecto");
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getProjectsToSubject = async (req, res, next) => {
    const {id_asignatura} = req.params
    try {
        const result = await pool.query(`
            SELECT DISTINCT p.id_proyecto, p.proyecto 
            FROM Grupos g
            JOIN Proyecto p ON g.id_proyecto = p.id_proyecto
            WHERE g.id_asignatura = $1
            ORDER BY p.proyecto
        `, [id_asignatura]);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getNextGroupConsecutive = async (req, res, next) => {
    const {id_asignatura, id_proyecto} = req.params
    try {
        // Obtener el mayor consecutivo de los grupos existentes
        const result = await pool.query(`
            SELECT MAX(CAST(SUBSTRING(grupo FROM '[0-9]+$') AS INTEGER)) AS max_consecutivo
            FROM Grupos
            WHERE id_asignatura = $1 AND id_proyecto = $2
        `, [id_asignatura, id_proyecto]);

        console.log(`Max consecutivo: ${result.rows[0].max_consecutivo}`);
        

        // Obtener el código del proyecto desde el campo `proyecto` (extrae lo antes del " -")
        const proyectoResult = await pool.query(`
            SELECT TRIM(SPLIT_PART(proyecto, '-', 1)) AS codigo_proyecto
            FROM Proyecto
            WHERE id_proyecto = $1
        `, [id_proyecto]);

        console.log(`Código del proyecto: ${proyectoResult.rows[0].codigo_proyecto}`);
        

        const siguiente = (result.rows[0].max_consecutivo || 0) + 1;
        const codigo = proyectoResult.rows[0].codigo_proyecto;
        res.json({ siguiente, codigo });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllGroups,
    getGroup,
    getAllDays,
    getAllHours,
    getAllProjects,
    getAllSubjects,
    createGroup,
    deleteGroup,
    updateGroup,
    getProjectsToSubject,
    getNextGroupConsecutive
}