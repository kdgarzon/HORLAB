const pool = require('../dbconexion')

const getAllPeriods = async (req, res, next) => {
    try {
        const result = await pool.query("SELECT * FROM Periodo");

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "No hay periodos academicos registrados"
            });
        }
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getPeriod = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM Periodo WHERE id_periodo = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Periodo academico no encontrado"
            });
        }
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllPeriods,
    getPeriod
}