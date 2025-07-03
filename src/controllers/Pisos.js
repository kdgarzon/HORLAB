const pool = require('../dbconexion')

const getAllFloors = async (req, res, next) => {
    try {
        const result = await pool.query("SELECT * FROM pisos");

        if (result.rows.length === 0) return res.status(404).json({
            message: "No hay pisos registrados"
        });
        res.json(result.rows);
    } catch (error) {
        next(error)
    }
}

const getFloor = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM pisos WHERE id = $1", [id]);

        if (result.rows.length === 0) return res.status(404).json({
            message: "Piso no encontrado"
        });
        res.json(result.rows[0]);
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllFloors,
    getFloor
}