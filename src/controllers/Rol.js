const pool = require('../dbconexion')

const getAllRoles = async (req, res, next) => {
    try {
        const allRoles = await pool.query("SELECT * FROM rol")
        res.json(allRoles.rows)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllRoles
}