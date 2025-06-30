const pool = require('../dbconexion')

const getAllProjects = async (req, res, next) => {
    try {
        const result = await pool.query("SELECT * FROM Proyecto ORDER BY proyecto");
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getProjectsToSubject = async (req, res, next) => {
    const {id_asignatura} = req.params
    try {
        const result = await pool.query(`
            SELECT DISTINCT p.id_proyecto, p.proyecto 
            FROM Grupos g
            JOIN Proyecto p ON g.id_proyecto = p.id_proyecto
            WHERE g.id_asignatura = $1
            ORDER BY p.proyecto
        `, [id_asignatura]);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllProjects,
    getProjectsToSubject
}