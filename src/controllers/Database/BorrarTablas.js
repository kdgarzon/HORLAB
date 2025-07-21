const pool = require('../../dbconexion');

async function eliminarTablas() {
    const queries = [
        `DELETE FROM Recuperar_pass;`,
        `DELETE FROM Usuarios 
         WHERE id_rol IS DISTINCT FROM (
           SELECT id_rol FROM Rol WHERE nombre ILIKE 'Administrador'
         );`,
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
        `DROP TABLE docentes;`
    ];

    for (const query of queries) {
        await pool.query(query);
    }
}

module.exports = {
    eliminarTablas
};