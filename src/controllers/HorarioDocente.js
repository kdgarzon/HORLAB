const pool = require('../dbconexion')

const getTeacherSchedule = async (req, res, next) => {
    const {id} = req.params
    try {
        const result = await pool.query(`
            SELECT 
                d.nombre AS docente,
                dia.dia,
                h.hora,
                TRIM(REGEXP_REPLACE(m.salon, '\\s*CAP\\(\\d+\\)', '', 'g')) AS salon,
                m.edificio
            FROM DocenteGrupo dg
            JOIN Docentes d ON dg.id_docente = d.id_docente
            JOIN Grupos g ON dg.id_grupo = g.id_grupo
            JOIN Dia dia ON g.id_dia = dia.id_dia
            JOIN Hora h ON g.id_hora = h.id_hora
            JOIN matrizgeneral m ON 
                m.docente = d.nombre AND 
                m.dia = dia.dia AND 
                m.hora = h.hora AND 
                m.grupo = g.grupo AND 
                m.proyecto = (
                    SELECT proyecto FROM Proyecto WHERE id_proyecto = g.id_proyecto
                )
            WHERE d.id_docente = $1
            ORDER BY dia.orden, h.hora
        `, [id]);
        if(result.rows.length === 0) return res.status(404).json({
            message: "Docente no tiene franja horaria asignada"
        });
        res.json(result.rows);
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getTeacherSchedule
}