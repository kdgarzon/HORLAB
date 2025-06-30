const pool = require('../dbconexion')

const getAllDays = async (req, res, next) => {
    try {
        const result = await pool.query("SELECT * FROM Dia ORDER BY orden");
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllDays
}