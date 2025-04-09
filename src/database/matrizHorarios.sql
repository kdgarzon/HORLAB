CREATE TABLE matrizgeneral (
    id_registro_matriz SERIAL PRIMARY KEY,
    periodo VARCHAR(10),
    dia VARCHAR(15),
    hora VARCHAR(20),
    asignatura VARCHAR(100),
    grupo VARCHAR(20),
    proyecto VARCHAR(150),
    salon VARCHAR(100),
    area FLOAT,
    edificio VARCHAR(100),
    sede VARCHAR(50),
    inscritos INTEGER,
    docente VARCHAR(100)
);

\COPY matrizgeneral(periodo, dia, hora, asignatura, grupo, proyecto, salon, area, edificio, sede, inscritos, docente) FROM 'C:\Users\Karencita\Desktop\HORLAB\src\doc\horarios.csv' WITH (FORMAT csv, HEADER true, DELIMITER ';', ENCODING 'UTF8');