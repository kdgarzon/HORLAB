const pool = require('../dbconexion')

const getAllHours = async (req, res, next) => {
    try {
        const result = await pool.query("SELECT * FROM Hora ORDER BY hora");
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllHours
}