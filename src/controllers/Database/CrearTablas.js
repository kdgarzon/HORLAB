const pool = require('../../dbconexion');

async function crearTablas() {
    const queries = [
        `CREATE TABLE matrizgeneral (
            id_registro_matriz SERIAL PRIMARY KEY,
            periodo VARCHAR(10) NOT NULL,
            dia VARCHAR(15) NOT NULL,
            hora VARCHAR(20) NOT NULL,
            asignatura VARCHAR(100) NOT NULL,
            grupo VARCHAR(20) NOT NULL,
            proyecto VARCHAR(150) NOT NULL,
            salon VARCHAR(100) NOT NULL,
            area FLOAT NOT NULL,
            edificio VARCHAR(100) NOT NULL,
            sede VARCHAR(50) NOT NULL,
            inscritos INTEGER NOT NULL,
            docente VARCHAR(100) NOT NULL
        );`,  
        `CREATE TABLE Periodo (
            id_periodo SERIAL,
            periodo VARCHAR(10) UNIQUE NOT NULL,
            PRIMARY KEY (id_periodo)
        );`,
        `CREATE TABLE Facultad (
            id_facultad SERIAL,
            facultad VARCHAR(100) UNIQUE NOT NULL,
            PRIMARY KEY (id_facultad)
        );`,
        `CREATE TABLE Proyecto (
            id_proyecto SERIAL,
            proyecto VARCHAR(150) UNIQUE NOT NULL,
            id_facultad INTEGER,
            PRIMARY KEY (id_proyecto),
            FOREIGN KEY (id_facultad) REFERENCES Facultad(id_facultad) ON UPDATE CASCADE ON DELETE SET NULL
        );`,
        `CREATE TABLE Docentes (
            id_docente SERIAL,
            nombre VARCHAR(100) UNIQUE NOT NULL,
            PRIMARY KEY (id_docente)
        );`,
        `CREATE TABLE Asignaturas (
            id_asignatura SERIAL,
            codigo_asig VARCHAR(10) NOT NULL,
            nombre VARCHAR(100) NOT NULL,
            UNIQUE (codigo_asig, nombre),
            PRIMARY KEY (id_asignatura)
        );`,
        `CREATE TABLE Dia (
            id_dia SERIAL,
            dia VARCHAR(10) NOT NULL,
            PRIMARY KEY (id_dia)
        );`,
        `CREATE TABLE Hora (
            id_hora SERIAL,
            hora VARCHAR(50) NOT NULL,
            PRIMARY KEY (id_hora)
        );`,
        `CREATE TABLE Grupos (
            id_grupo SERIAL,
            id_periodo INTEGER NOT NULL,
            id_dia INTEGER,
            id_hora INTEGER,
            grupo VARCHAR(10) NOT NULL,
            id_asignatura INTEGER,
            id_proyecto INTEGER,
            inscritos INTEGER,
            PRIMARY KEY (id_grupo),
            FOREIGN KEY (id_periodo) REFERENCES Periodo(id_periodo) ON UPDATE CASCADE ON DELETE SET NULL,
            FOREIGN KEY (id_dia) REFERENCES Dia(id_dia) ON UPDATE CASCADE ON DELETE SET NULL,
            FOREIGN KEY (id_hora) REFERENCES Hora(id_hora) ON UPDATE CASCADE ON DELETE SET NULL,
            FOREIGN KEY (id_asignatura) REFERENCES Asignaturas(id_asignatura) ON UPDATE CASCADE ON DELETE SET NULL,
            FOREIGN KEY (id_proyecto) REFERENCES Proyecto(id_proyecto) ON UPDATE CASCADE ON DELETE SET NULL
        );`,
        `CREATE TABLE Salones (
            id_salon SERIAL,
            nombre VARCHAR(100) NOT NULL,
            id_edificio INTEGER,
            capacidad INTEGER NOT NULL,
            area FLOAT NOT NULL,
            PRIMARY KEY (id_salon),
            FOREIGN KEY (id_edificio) REFERENCES Edificio(id_edificio) ON UPDATE CASCADE ON DELETE SET NULL,
            CONSTRAINT salon_unico UNIQUE (nombre, id_edificio)
        );`,
        `CREATE TABLE DocenteGrupo (
            id_docente_grupo SERIAL PRIMARY KEY,
            id_docente INTEGER NOT NULL,
            id_grupo INTEGER NOT NULL,
            FOREIGN KEY (id_docente) REFERENCES Docentes(id_docente) ON UPDATE CASCADE ON DELETE CASCADE,
            FOREIGN KEY (id_grupo) REFERENCES Grupos(id_grupo) ON UPDATE CASCADE ON DELETE CASCADE,
            CONSTRAINT docente_grupo_unico UNIQUE (id_docente, id_grupo)
        );`,
    ];
    for (const query of queries) {
        try {
            await pool.query(query);
            console.log('Tabla creada o modificada exitosamente');
        } catch (error) {
            console.error('Error creando/modificando tabla:', error.message);
        }
    }
}

module.exports = {
    crearTablas
};