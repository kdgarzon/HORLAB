const pool = require('../../dbconexion');

async function eliminarTablas() {
    const queries = [
        `DROP TABLE matrizgeneral;`,
        `DROP TABLE docentegrupo;`,
        `DROP TABLE salones;`,
        `DROP TABLE grupos;`,
        `DROP TABLE hora;`,
        `DROP TABLE dia;`,
        `DROP TABLE asignaturas;`,
        `DROP TABLE proyecto;`,
        `DROP TABLE facultad;`,
        `DROP TABLE periodo;`,
        `DROP TABLE docentes CASCADE;`
    ];

    for (const query of queries) {
        await pool.query(query);
    }
}

module.exports = {
    eliminarTablas
};