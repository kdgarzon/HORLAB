const pool = require('../dbconexion')

const getAllSubjects = async (req, res, next) => {
    try {
        const allSubjects = await pool.query("SELECT * FROM asignaturas")
        res.json(allSubjects.rows)
    } catch (error) {
        next(error)
    }
}

const getSubject = async (req, res, next) => {
    try {
        const {id} = req.params
        const result = await pool.query("SELECT * FROM asignaturas WHERE id_asignatura = $1", [id])
    
        if(result.rows.length === 0) return res.status(404).json({
            message: "Asignatura no encontrada en la base de datos"
        });
        res.json(result.rows[0]);
    } catch (error) {
        next(error)
    }
}

const createSubject = async (req, res, next) => {
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

const deleteSubject = async (req, res, next) => {
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

const updateSubject = async (req, res, next) => {
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
    getAllSubjects,
    getSubject,
    deleteSubject,
    updateSubject,
    createSubject
}