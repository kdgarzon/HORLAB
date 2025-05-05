const pool = require('../dbconexion')

const getAllTeachers = async (req, res, next) => {
    try {
        const allTeachers = await pool.query("SELECT * FROM docentes")
        res.json(allTeachers.rows)
    } catch (error) {
        next(error)
    }
}

const getTeacher = async (req, res, next) => {
    try {
        const {id} = req.params
        const result = await pool.query("SELECT * FROM docentes WHERE id_docente = $1", [id])
    
        if(result.rows.length === 0) return res.status(404).json({
            message: "Docente no encontrado en la base de datos"
        });
        res.json(result.rows[0]);
    } catch (error) {
        next(error)
    }
}

const getTeacherSchedule = async (req, res, next) => {
    const {id} = req.params
    try {
        const result = await pool.query(`
            SELECT 
                d.nombre AS docente,
                dia.dia,
                h.hora,
                TRIM(REGEXP_REPLACE(m.salon, '\\s*CAP\\(\\d+\\)', '', 'g')) AS salon,
                m.edificio
            FROM DocenteGrupo dg
            JOIN Docentes d ON dg.id_docente = d.id_docente
            JOIN Grupos g ON dg.id_grupo = g.id_grupo
            JOIN Dia dia ON g.id_dia = dia.id_dia
            JOIN Hora h ON g.id_hora = h.id_hora
            JOIN matrizgeneral m ON 
                m.docente = d.nombre AND 
                m.dia = dia.dia AND 
                m.hora = h.hora AND 
                m.grupo = g.grupo AND 
                m.proyecto = (
                    SELECT proyecto FROM Proyecto WHERE id_proyecto = g.id_proyecto
                )
            WHERE d.id_docente = $1
            ORDER BY dia.dia, h.hora
        `, [id]);
        if(result.rows.length === 0) return res.status(404).json({
            message: "Docente no tiene franja horaria asignada"
        });
        res.json(result.rows);
    } catch (error) {
        next(error)
    }
}

const createTeacher = async (req, res, next) => {
    const {nombre} = req.body
    try {
        const result = await pool.query("INSERT INTO docentes (nombre) VALUES ($1) RETURNING *", 
        [
            nombre
        ]);
    
        res.json(result.rows[0])
    } catch (error) {
        if (error.code === '23505') {
            // 23505 = unique_violation en PostgreSQL
            return res.status(409).json({ error: 'El docente ya existe en la base de datos.' });
        }
        next(error)
    }
}

const deleteTeacher = async (req, res, next) => {
    const {iddocenteEliminar} = req.params
    try {
        const result = await pool.query("DELETE FROM docentes WHERE id_docente = $1", [iddocenteEliminar])
    
        if(result.rowCount === 0) return res.status(400).json({
            message: "Docente no se ha podido eliminar"
        });
        
        return res.sendStatus(204);
    } catch (error) {
        next(error)
    }
}

const updateTeacher = async (req, res, next) => {
    const {iddocenteActualizar} = req.params;
    try {
        const {nombre} = req.body;
    
        const result = await pool.query("UPDATE docentes SET nombre = $1 WHERE id_docente = $2 RETURNING *", 
            [nombre, iddocenteActualizar]);

        if(result.rows.length === 0) return res.status(404).json({
            message: "No es posible modificar el docente seleccionado"
        });
        return res.json(result.rows[0])
    } catch (error) {
        next(error)    
    }
}

module.exports = {
    getAllTeachers,
    getTeacher,
    getTeacherSchedule,
    createTeacher,
    deleteTeacher,
    updateTeacher
}