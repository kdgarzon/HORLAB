const pool = require('../dbconexion')

const getAllSubjects = async (req, res) => {
    try {
        const allSubjects = await pool.query("SELECT * FROM asignaturas")
        res.json(allSubjects.rows)
    } catch (error) {
        res.json({error: error.menssage});
    }
}

const getSubject = async (req, res) => {
    try {
        const {id} = req.params
        const result = await pool.query("SELECT * FROM asignaturas WHERE id_asignatura = $1", [id])
    
        if(result.rows.length === 0) return res.status(404).json({
            message: "Asignatura no encontrada en la base de datos"
        });
        res.json(result.rows[0]);
    } catch (error) {
        res.json({error: error.menssage});
    }
}

const createSubject = async (req, res) => {
    const {nombre} = req.body
    try {
        const result = await pool.query("INSERT INTO asignaturas (nombre) VALUES ($1) RETURNING *", 
        [
            nombre
        ]);
    
        res.json(result.rows[0])
    } catch (error) {
        res.json({error: error.menssage});
    }
}

const deleteSubject = async (req, res) => {
    const {idsubjectEliminar} = req.params
    const result = await pool.query("DELETE FROM asignaturas WHERE id_asignatura = $1", [idsubjectEliminar])
    
    if(result.rowCount === 0) return res.status(400).json({
        message: "La asignatura no se ha podido eliminar"
    });
    
    return res.sendStatus(204);
}

const updateSubject = async (req, res) => {
    const {idsubjectActualizar} = req.params;
    const {nombre} = req.body;
    
    const result = await pool.query("UPDATE asignaturas SET nombre = $1 WHERE id_asignatura = $2 RETURNING *", 
        [nombre, idsubjectActualizar]);

    if(result.rows.length === 0) return res.status(404).json({
        message: "No es posible modificar la asignatura seleccionada"
    });
    return res.json(result.rows[0])
}

module.exports = {
    getAllSubjects,
    getSubject,
    deleteSubject,
    updateSubject,
    createSubject
}