const pool = require('../../dbconexion');

async function insertarRegistro(registro) {
    const values = [
        registro['Periodo']?.trim(),
        registro['Dia']?.trim(),
        registro['Hora']?.trim(),
        registro['Asignatura']?.trim(),
        registro['Grupo']?.trim(),
        registro['Proyecto']?.trim(),
        registro['Salon']?.trim(),
        registro['Area']?.trim(),
        registro['Edificio']?.trim(),
        registro['Sede']?.trim(),
        registro['Inscritos']?.trim(),
        registro['Docente']?.trim()
    ];

    await pool.query(
        'INSERT INTO matrizgeneral (periodo, dia, hora, asignatura, grupo, proyecto, salon, area, edificio, sede, inscritos, docente) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
        values
    ); 
}

async function insertarDatosRelacionados() {
    const queries = [
        `INSERT INTO Periodo(periodo)
            SELECT DISTINCT periodo FROM matrizgeneral WHERE periodo IS NOT NULL;`,
        `INSERT INTO Facultad(facultad)
            SELECT DISTINCT sede FROM matrizgeneral WHERE sede IS NOT NULL;`,
        `INSERT INTO Proyecto(proyecto, id_facultad)
            SELECT DISTINCT m.proyecto, f.id_facultad
            FROM matrizgeneral m
            JOIN Facultad f ON m.sede = f.facultad
            WHERE m.proyecto IS NOT NULL;`,
        `INSERT INTO Docentes(nombre)
            SELECT DISTINCT docente FROM matrizgeneral WHERE docente IS NOT NULL;`,
        `INSERT INTO Asignaturas (codigo_asig, nombre)
            SELECT DISTINCT
                codigo, nombre
            FROM (
                SELECT 
                    TRIM(SPLIT_PART(asignatura, '-', 1)) AS codigo,
                    TRIM(SPLIT_PART(asignatura, '-', 2)) AS nombre
                FROM matrizgeneral
                WHERE asignatura IS NOT NULL
                AND asignatura LIKE '%-%'
            ) AS datos
            WHERE NOT EXISTS (
                SELECT 1 FROM Asignaturas a
                WHERE a.codigo_asig = datos.codigo
                AND a.nombre = datos.nombre
            );`,
        `INSERT INTO Dia(dia)
            SELECT DISTINCT dia FROM matrizgeneral WHERE dia IS NOT NULL;`,
        `INSERT INTO Hora(hora)
            SELECT DISTINCT hora FROM matrizgeneral WHERE hora IS NOT NULL;`,
        `INSERT INTO Grupos(id_dia, id_periodo, id_hora, grupo, id_asignatura, id_proyecto, inscritos)
            SELECT 
                d.id_dia, p.id_periodo, h.id_hora, m.grupo, a.id_asignatura, proj.id_proyecto, m.inscritos
            FROM matrizgeneral m
            JOIN Periodo p ON m.periodo = p.periodo
            JOIN Dia d ON m.dia = d.dia
            JOIN Hora h ON m.hora = h.hora
            JOIN Asignaturas a 
            ON TRIM(SPLIT_PART(m.asignatura, '-', 1)) = TRIM(a.codigo_asig::TEXT)
            AND TRIM(SPLIT_PART(m.asignatura, '-', 2)) = TRIM(a.nombre)
            JOIN Proyecto proj ON m.proyecto = proj.proyecto
            WHERE m.grupo IS NOT NULL;`
        `INSERT INTO Salones(nombre, id_edificio, capacidad, area)
            SELECT DISTINCT
                -- Quitar todo lo que sea ' CAP(n)', incluyendo espacios antes
                TRIM(REGEXP_REPLACE(m.salon, '\s*CAP\(\d+\)', '', 'g')) AS nombre,

                -- Obtener el número dentro de CAP(...)
                e.id_edificio,
                CAST(SUBSTRING(m.salon FROM 'CAP\((\d+)\)') AS INTEGER) AS capacidad,
                
                m.area
            FROM matrizgeneral m
            JOIN Edificio e ON m.edificio = e.edificio
            WHERE m.salon IS NOT NULL AND m.salon ~ 'CAP\(\d+\)';`,
        `INSERT INTO Usuarios (nombreUser, apellidoUser, correo, usuario, pass, id_rol)
            SELECT 
            INITCAP(SPLIT_PART(d.nombre, ' ', 1)) AS nombreUser,
            INITCAP(
                CASE 
                WHEN array_length(string_to_array(d.nombre, ' '), 1) = 5 THEN
                    CONCAT_WS(' ', SPLIT_PART(d.nombre, ' ', 2), SPLIT_PART(d.nombre, ' ', 3))
                WHEN array_length(string_to_array(d.nombre, ' '), 1) = 4 THEN
                    SPLIT_PART(d.nombre, ' ', 3)
                ELSE
                    SPLIT_PART(d.nombre, ' ', 2)
                END
            ) AS apellidoUser,
            LOWER(
                CASE 
                WHEN array_length(string_to_array(d.nombre, ' '), 1) = 5 THEN
                    CONCAT(
                    LEFT(SPLIT_PART(d.nombre, ' ', 1), 1),
                    LEFT(SPLIT_PART(d.nombre, ' ', 2), 1),
                    LEFT(SPLIT_PART(d.nombre, ' ', 3), 1),
                    SPLIT_PART(d.nombre, ' ', 4),
                    LEFT(SPLIT_PART(d.nombre, ' ', 5), 1)
                    )
                WHEN array_length(string_to_array(d.nombre, ' '), 1) = 4 THEN
                    CONCAT(
                    LEFT(SPLIT_PART(d.nombre, ' ', 1), 1),
                    LEFT(SPLIT_PART(d.nombre, ' ', 2), 1),
                    SPLIT_PART(d.nombre, ' ', 3),
                    LEFT(SPLIT_PART(d.nombre, ' ', 4), 1)
                    )
                ELSE
                    CONCAT(
                    LEFT(SPLIT_PART(d.nombre, ' ', 1), 1),
                    SPLIT_PART(d.nombre, ' ', 2),
                    LEFT(SPLIT_PART(d.nombre, ' ', 3), 1)
                    )
                END
            ) || '@udistrital.edu.co' AS correo,
            LOWER(
                CASE 
                WHEN array_length(string_to_array(d.nombre, ' '), 1) = 5 THEN
                    CONCAT(
                    LEFT(SPLIT_PART(d.nombre, ' ', 1), 1),
                    LEFT(SPLIT_PART(d.nombre, ' ', 2), 1),
                    LEFT(SPLIT_PART(d.nombre, ' ', 3), 1),
                    SPLIT_PART(d.nombre, ' ', 4),
                    LEFT(SPLIT_PART(d.nombre, ' ', 5), 1)
                    )
                WHEN array_length(string_to_array(d.nombre, ' '), 1) = 4 THEN
                    CONCAT(
                    LEFT(SPLIT_PART(d.nombre, ' ', 1), 1),
                    LEFT(SPLIT_PART(d.nombre, ' ', 2), 1),
                    SPLIT_PART(d.nombre, ' ', 3),
                    LEFT(SPLIT_PART(d.nombre, ' ', 4), 1)
                    )
                ELSE
                    CONCAT(
                    LEFT(SPLIT_PART(d.nombre, ' ', 1), 1),
                    SPLIT_PART(d.nombre, ' ', 2),
                    LEFT(SPLIT_PART(d.nombre, ' ', 3), 1)
                    )
                END	
            ) AS usuario,
            CONCAT(
                LEFT(
                LOWER(
                    CASE 
                    WHEN array_length(string_to_array(d.nombre, ' '), 1) >= 4 THEN
                        CONCAT(
                        LEFT(SPLIT_PART(d.nombre, ' ', 1), 1),
                        LEFT(SPLIT_PART(d.nombre, ' ', 2), 1)
                        )
                    ELSE
                        CONCAT(
                        LEFT(SPLIT_PART(d.nombre, ' ', 1), 1),
                        LEFT(SPLIT_PART(d.nombre, ' ', 2), 1)
                        )
                    END
                ), 2
                ), 
                '123'
            ) AS pass,
            2 AS id_rol
            FROM Docentes d;`,
        `INSERT INTO DocenteGrupo (id_docente, id_grupo)
            SELECT DISTINCT 
                d.id_docente,
                g.id_grupo
            FROM matrizgeneral m
            JOIN Docentes d ON m.docente = d.nombre
            JOIN Dia di ON m.dia = di.dia
            JOIN Hora h ON m.hora = h.hora
            JOIN Asignaturas a 
            ON TRIM(SPLIT_PART(m.asignatura, '-', 1)) = TRIM(a.codigo_asig::TEXT)
            AND TRIM(SPLIT_PART(m.asignatura, '-', 2)) = TRIM(a.nombre)
            JOIN Proyecto p ON m.proyecto = p.proyecto
            JOIN Grupos g ON 
                g.grupo = m.grupo AND
                g.id_dia = di.id_dia AND
                g.id_hora = h.id_hora AND
                g.id_asignatura = a.id_asignatura AND
                g.id_proyecto = p.id_proyecto;`,
        `ALTER TABLE dia ADD COLUMN orden INTEGER;`,
        `UPDATE dia SET orden = 1 WHERE dia = 'LUNES';`,
        `UPDATE dia SET orden = 2 WHERE dia = 'MARTES';`,
        `UPDATE dia SET orden = 3 WHERE dia = 'MIERCOLES';`,
        `UPDATE dia SET orden = 4 WHERE dia = 'JUEVES';`,
        `UPDATE dia SET orden = 5 WHERE dia = 'VIERNES';`,
        `UPDATE dia SET orden = 6 WHERE dia = 'SABADO';`,
    ];
    for (const query of queries) {
        try {
            await pool.query(query);    
        } catch (error) {
            console.error('Error al insertar datos relacionados:', error.message);
        }
    }
}

module.exports = {
    insertarRegistro,
    insertarDatosRelacionados
};
