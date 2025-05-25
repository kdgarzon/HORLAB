const pool = require('../dbconexion')

const getAllGroups = async (req, res, next) => {
    const {id} = req.params
    try {
        const allGroups = await pool.query(`
        SELECT 
            g.id_grupo, g.grupo, g.inscritos, d.dia, h.hora, p.proyecto
        FROM Grupos g
        JOIN Dia d ON g.id_dia = d.id_dia
        JOIN Hora h ON g.id_hora = h.id_hora
        JOIN Proyecto p ON g.id_proyecto = p.id_proyecto
        WHERE g.id_asignatura = $1
        `, [id]);
        res.json(allGroups.rows)
        console.log(allGroups.rows);
        
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

//FALTA MODIFICAR DE AQUI PARA ABAJO
const createGroup = async (req, res, next) => {
    const {codigo_asig, nombre} = req.body
    try {
        const result = await pool.query("INSERT INTO asignaturas (codigo_asig, nombre) VALUES ($1, $2) RETURNING *", 
        [
            codigo_asig,
            nombre
        ]);
    
        res.json(result.rows[0])
    } catch (error) {
        next(error)
    }
}

const deleteGroup = async (req, res, next) => {
    const {idsubjectEliminar} = req.params
    try {
        const result = await pool.query("DELETE FROM asignaturas WHERE id_asignatura = $1", [idsubjectEliminar])
    
        if(result.rowCount === 0) return res.status(400).json({
            message: "La asignatura no se ha podido eliminar"
        });
        
        return res.sendStatus(204);
    } catch (error) {
        next(error)
    }
}

const updateGroup = async (req, res, next) => {
    const {idsubjectActualizar} = req.params;
    try {
        const {codigo_asig, nombre} = req.body;
        const result = await pool.query("UPDATE asignaturas SET codigo_asig = $1, nombre = $2 WHERE id_asignatura = $3 RETURNING *", 
            [codigo_asig, nombre, idsubjectActualizar]);

        if(result.rows.length === 0) return res.status(404).json({
            message: "No es posible modificar la asignatura seleccionada"
        });
        return res.json(result.rows[0])
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllGroups,
    getGroup,
    createGroup,
    deleteGroup,
    updateGroup
}