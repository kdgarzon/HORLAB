const pool = require('../dbconexion')

const getAllTeachers = async (req, res) => {
    try {
        const allTeachers = await pool.query("SELECT * FROM docentes")
        res.json(allTeachers.rows)
    } catch (error) {
        res.json({error: error.menssage});
    }
}

const getTeacher = async (req, res) => {
    try {
        const {id} = req.params
        const result = await pool.query("SELECT * FROM docentes WHERE id_docente = $1", [id])
    
        if(result.rows.length === 0) return res.status(404).json({
            message: "Docente no encontrado en la base de datos"
        });
        res.json(result.rows[0]);
    } catch (error) {
        res.json({error: error.menssage});
    }
}

const createTeacher = async (req, res) => {
    const {nombre} = req.body
    try {
        const result = await pool.query("INSERT INTO docentes (nombre) VALUES ($1) RETURNING *", 
        [
            nombre
        ]);
    
        res.json(result.rows[0])
    } catch (error) {
        res.json({error: error.menssage});
    }
}

const deleteTeacher = async (req, res) => {
    const {iddocenteEliminar} = req.params
    const result = await pool.query("DELETE FROM docentes WHERE id_docente = $1", [iddocenteEliminar])
    
    if(result.rowCount === 0) return res.status(400).json({
        message: "Docente no se ha podido eliminar"
    });
    
    return res.sendStatus(204);
}

const updateTeacher = async (req, res) => {
    const {iddocenteActualizar} = req.params;
    const {nombre} = req.body;
    
    const result = await pool.query("UPDATE docentes SET nombre = $1 WHERE id_docente = $2 RETURNING *", 
        [nombre, iddocenteActualizar]);

    if(result.rows.length === 0) return res.status(404).json({
        message: "No es posible modificar el docente seleccionado"
    });
    return res.json(result.rows[0])
}

module.exports = {
    getAllTeachers,
    getTeacher,
    createTeacher,
    deleteTeacher,
    updateTeacher
}