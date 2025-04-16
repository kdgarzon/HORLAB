const pool = require('../dbconexion')

const getAllClassrooms = async (req, res) => {
    try {
        const allClassrooms = await pool.query("SELECT * FROM salones")
        res.json(allClassrooms.rows)
    } catch (error) {
        res.json({error: error.menssage});
    }
}

const getClassroom = async (req, res) => {
    try {
        const {id} = req.params
        const result = await pool.query("SELECT * FROM salones WHERE id_salon = $1", [id])
    
        if(result.rows.length === 0) return res.status(404).json({
            message: "Salon no encontrado en la base de datos"
        });
        res.json(result.rows[0]);
    } catch (error) {
        res.json({error: error.menssage});
    }
}

const createClassroom = async (req, res) => {
    const {nombre, id_edificio, capacidad, area} = req.body
    try {
        const result = await pool.query("INSERT INTO salones (nombre, id_edificio, capacidad, area) VALUES ($1, $2, $3, $4) RETURNING *", 
        [
            nombre, 
            id_edificio,
            capacidad,
            area
        ]);
    
        res.json(result.rows[0])
    } catch (error) {
        res.json({error: error.menssage});
    }
}

const deleteClassroom = async (req, res) => {
    const {idclassroomEliminar} = req.params
    const result = await pool.query("DELETE FROM salones WHERE id_salon = $1", [idclassroomEliminar])
    
    if(result.rowCount === 0) return res.status(400).json({
        message: "Salon no se ha podido eliminar"
    });
    
    return res.sendStatus(204);
}

const updateClassroom = async (req, res) => {
    const {idclassroomActualizar} = req.params;
    const {nombre, id_edificio, capacidad, area} = req.body;
    
    const result = await pool.query("UPDATE salones SET nombre = $1, id_edificio = $2, capacidad = $3, area = $4 WHERE id_salon = $5 RETURNING *", 
        [nombre, id_edificio, capacidad, area, idclassroomActualizar]);

    if(result.rows.length === 0) return res.status(404).json({
        message: "No es posible modificar el salon seleccionado"
    });
    return res.json(result.rows[0])
}

module.exports = {
    getAllClassrooms,
    getClassroom,
    createClassroom,
    deleteClassroom,
    updateClassroom
}