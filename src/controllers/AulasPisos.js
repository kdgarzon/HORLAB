const pool = require('../dbconexion')

const getAllClassroomByFloor = async (req, res, next) => {
    try {
        const { idFloor } = req.params;
        const result = await pool.query("SELECT * FROM AulasPisos WHERE id_piso = $1", [idFloor]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "No hay aulas registradas en este piso"
            });
        }
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getClassroomByFloor = async (req, res, next) => {
    const { idFloor, idClassroom, idBuilding } = req.params;
    try {
        const result = await pool.query("SELECT * FROM AulasPisos WHERE id_piso = $1 AND id_aula_piso = $2 AND id_edificio =$3", [idFloor, idClassroom, idBuilding]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Aula no encontrada en este piso y edificio"
            });
        }
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllClassroomByFloor,
    getClassroomByFloor
}