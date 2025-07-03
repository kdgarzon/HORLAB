const pool = require('../dbconexion')

const getAllFacultades = async (req, res, next) => {
    try {
        const result = await pool.query("SELECT * FROM Facultad");

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "No hay facultades registradas"
            });
        }
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getFacultad = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM Facultad WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Facultad no encontrada"
            });
        }
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllFacultades,
    getFacultad
}