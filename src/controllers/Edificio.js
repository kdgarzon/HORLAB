const pool = require('../dbconexion')

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

module.exports = {
    getBuildings
}