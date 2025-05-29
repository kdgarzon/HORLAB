const pool = require('../dbconexion')

const getAllGroups = async (req, res, next) => {
    const {id} = req.params
    try {
        const allGroups = await pool.query(`
        SELECT 
            g.id_grupo, d.dia, h.hora, a.nombre, p.proyecto, g.grupo, g.inscritos 
        FROM Grupos g
        JOIN Dia d ON g.id_dia = d.id_dia
        JOIN Hora h ON g.id_hora = h.id_hora
        JOIN Asignaturas a ON g.id_asignatura = a.id_asignatura
        JOIN Proyecto p ON g.id_proyecto = p.id_proyecto
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
                g.id_grupo, g.grupo, g.inscritos, d.dia, h.hora, p.proyecto
            FROM Grupos g
            JOIN Dia d ON g.id_dia = d.id_dia
            JOIN Hora h ON g.id_hora = h.id_hora
            JOIN Proyecto p ON g.id_proyecto = p.id_proyecto
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
    const {id_dia, id_hora, grupo, id_asignatura, id_proyecto, inscritos} = req.body
    try {
        const result = await pool.query(`
            INSERT INTO Grupos (id_dia, id_hora, grupo, id_asignatura, id_proyecto, inscritos)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, 
        [
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
        const {id_dia, id_hora, grupo, id_asignatura, id_proyecto, inscritos} = req.body;
        const result = await pool.query(`
            UPDATE Grupos
            SET id_dia = $1, id_hora = $2, grupo = $3, id_asignatura = $4, id_proyecto = $5, inscritos = $6
            WHERE id_grupo = $7 RETURNING *`, 
        [
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

module.exports = {
    getAllGroups,
    getGroup,
    getAllDays,
    getAllHours,
    getAllProjects,
    createGroup,
    deleteGroup,
    updateGroup
}