const pool = require('../dbconexion')

const getAllClassrooms = async (req, res, next) => {
    try {
        const allClassrooms = await pool.query("SELECT * FROM salones JOIN edificio ON salones.id_edificio = edificio.id_edificio")
        res.json(allClassrooms.rows)
    } catch (error) {
        next(error)
    }
}

const getClassroom = async (req, res, next) => {
    try {
        const {id} = req.params
        const result = await pool.query("SELECT * FROM salones WHERE id_salon = $1", [id])
    
        if(result.rows.length === 0) return res.status(404).json({
            message: "Salon no encontrado en la base de datos"
        });
        res.json(result.rows[0]);
    } catch (error) {
        next(error)
    }
}

const getBuildings = async (req, res, next) => {
    try {
        const result = await pool.query("SELECT * FROM edificio");
    
        if(result.rows.length === 0) return res.status(404).json({
            message: "No hay edificios registrados"
        });
        res.json(result.rows);
    } catch (error) {
        next(error)
    }
}

const createClassroom = async (req, res, next) => {
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
        next(error)
    }
}

const deleteClassroom = async (req, res, next) => {
    const {idclassroomEliminar} = req.params
    try {
        const result = await pool.query("DELETE FROM salones WHERE id_salon = $1", [idclassroomEliminar])
    
        if(result.rowCount === 0) return res.status(400).json({
            message: "Salon no se ha podido eliminar"
        });
        
        return res.sendStatus(204);
    } catch (error) {
        next(error)
    }
}

const updateClassroom = async (req, res, next) => {
    const {idclassroomActualizar} = req.params;
    try {
        const {nombre, id_edificio, capacidad, area} = req.body;
    
        const result = await pool.query("UPDATE salones SET nombre = $1, id_edificio = $2, capacidad = $3, area = $4 WHERE id_salon = $5 RETURNING *", 
            [nombre, id_edificio, capacidad, area, idclassroomActualizar]);

        if(result.rows.length === 0) return res.status(404).json({
            message: "No es posible modificar el salon seleccionado"
        });
        return res.json(result.rows[0])
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllClassrooms,
    getClassroom,
    createClassroom,
    deleteClassroom,
    updateClassroom,
    getBuildings
}