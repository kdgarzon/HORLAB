INSERT INTO Periodo(periodo)
SELECT DISTINCT periodo FROM matrizgeneral WHERE periodo IS NOT NULL;

INSERT INTO Facultad(facultad)
SELECT DISTINCT sede FROM matrizgeneral WHERE sede IS NOT NULL;

INSERT INTO Edificio(edificio)
SELECT DISTINCT edificio FROM matrizgeneral WHERE edificio IS NOT NULL;

INSERT INTO Proyecto(proyecto, id_facultad)
SELECT DISTINCT m.proyecto, f.id_facultad
FROM matrizgeneral m
JOIN Facultad f ON m.sede = f.facultad
WHERE m.proyecto IS NOT NULL;

INSERT INTO Docentes(nombre)
SELECT DISTINCT docente FROM matrizgeneral WHERE docente IS NOT NULL;

INSERT INTO Asignaturas (codigo_asig, nombre)
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
);

INSERT INTO Dia(dia)
SELECT DISTINCT dia FROM matrizgeneral WHERE dia IS NOT NULL;

INSERT INTO Hora(hora)
SELECT DISTINCT hora FROM matrizgeneral WHERE hora IS NOT NULL;

INSERT INTO Grupos(id_dia, id_periodo, id_hora, grupo, id_asignatura, id_proyecto, inscritos)
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
WHERE m.grupo IS NOT NULL;

INSERT INTO Salones(nombre, id_edificio, capacidad, area)
SELECT DISTINCT
    -- Quitar todo lo que sea ' CAP(n)', incluyendo espacios antes
    TRIM(REGEXP_REPLACE(m.salon, '\s*CAP\(\d+\)', '', 'g')) AS nombre,

    -- Obtener el número dentro de CAP(...)
    e.id_edificio,
    CAST(SUBSTRING(m.salon FROM 'CAP\((\d+)\)') AS INTEGER) AS capacidad,
    
    m.area
FROM matrizgeneral m
JOIN Edificio e ON m.edificio = e.edificio
WHERE m.salon IS NOT NULL AND m.salon ~ 'CAP\(\d+\)';

INSERT INTO Rol (rol) VALUES ('Administrador');
INSERT INTO Rol (rol) VALUES ('Docente');

INSERT INTO Usuarios (nombreUser, apellidoUser, correo, usuario, pass, id_rol) VALUES ('Karen', 'Garzon', 'kdgarzong@udistrital.edu.co', 'kdgarzong', 'kd1234', 1);

INSERT INTO Usuarios (nombreUser, apellidoUser, correo, usuario, pass, id_rol)
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
FROM Docentes d;

INSERT INTO DocenteGrupo (id_docente, id_grupo)
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
    g.id_proyecto = p.id_proyecto;

ALTER TABLE dia ADD COLUMN orden INTEGER;

-- Luego actualizas los valores:
UPDATE dia SET orden = 1 WHERE dia = 'LUNES';
UPDATE dia SET orden = 2 WHERE dia = 'MARTES';
UPDATE dia SET orden = 3 WHERE dia = 'MIERCOLES';
UPDATE dia SET orden = 4 WHERE dia = 'JUEVES';
UPDATE dia SET orden = 5 WHERE dia = 'VIERNES';
UPDATE dia SET orden = 6 WHERE dia = 'SABADO';

INSERT INTO Pisos (nombre) VALUES ('PISO 1');
INSERT INTO Pisos (nombre) VALUES ('PISO 2');
INSERT INTO Pisos (nombre) VALUES ('PISO 3');
INSERT INTO Pisos (nombre) VALUES ('PISO 4');
INSERT INTO Pisos (nombre) VALUES ('PISO 5');
INSERT INTO Pisos (nombre) VALUES ('PISO 6');
INSERT INTO Pisos (nombre) VALUES ('PISO 7');
INSERT INTO Pisos (nombre) VALUES ('PISO 8');
INSERT INTO Pisos (nombre) VALUES ('PISO 9');

--PISO 1 EDIFICIO TECHNE (1)
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE PAVIMENTOS', 1, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE MATERIALES DE CONSTRUCCION Y PATOLOGIA', 1, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('CUARTO HUMEDO', 1, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('CUARTO DE MAQUINAS INSONORIZADO', 1, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE MOTORES DE COMBUSTION INTERNA', 1, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE TRIBOLOGIA', 1, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('TALLER DE CONTROL NUMERICO COMPUTARIZADO', 1, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE SUELOS', 1, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE SUELOS Y SERVICIOS', 1, 1);

--PISO 2 EDIFICIO TECHNE (1)
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE MECANICA DE FLUIDOS Y MAQUINAS HIDRAULICAS', 2, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE DISEÑO Y DESARROLLO TECNOLOGICO / LABORATORIO DE PLASTICOS', 2, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('OFICINA DE LABORATORIOS Y TALLERES DE MECANICA', 2, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE AUTOMATIZACION Y CONTROL - NEUMATICA', 2, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE AUTOMATIZACION Y CONTROL - HIDRAULICA', 2, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE TRATAMIENTOS TERMICOS', 2, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE METALOGRAFIA', 2, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE CIENCIAS TERMICAS', 2, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE METROLOGIA', 2, 1);

--PISO 3 EDIFICIO TECHNE (1)
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO APLICADO DE CIRCUITOS, ELECTRONICA Y CONTROL', 3, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO ESPECIALIZADO DE SISTEMAS ELECTRICOS', 3, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO APLICADO DE MAQUINAS ELECTRICAS', 3, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO ESPECIALIZADO DE SISTEMAS DE POTENCIA Y SMART GRID', 3, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO HAS', 3, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE DISEÑO DE PRODUCTO', 3, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO FMS', 3, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO GEIO', 3, 1);

--PISO 4 EDIFICIO TECHNE (1)
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('SALA DE SOFTWARE DE INGENIERIA ELECTRICA', 4, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('SALA DE SOFTWARE DE INGENIERIA CIVIL', 4, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('SALA DE SOFTWARE DE MECANICA 1', 4, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('SALA DE SOFTWARE DE CIENCIAS BASICAS', 4, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('SALA DE SOFTWARE DE TECNOLOGIA E INGENIERIA DE PRODUCCION A', 4, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('SALA DE SOFTWARE DE TECNOLOGIA E INGENIERIA DE PRODUCCION B', 4, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('SALA DE SOFTWARE INGENIERIA ELECTRONICA 1', 4, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('SALA DE SOFTWARE INGENIERIA ELECTRONICA 2', 4, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('SALA DE SOFTWARE DE MECANICA 2', 4, 1);

--PISO 5 EDIFICIO TECHNE (1)
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('COORDINACION DE LABORATORIOS Y ALMACEN', 5, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE REDES Y SEGURIDAD DE LA INFORMACION', 5, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE SISTEMAS DISTRIBUIDOS', 5, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE BASES DE DATOS AVANZADAS', 5, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE SIMULACION Y REALIDAD VIRTUAL', 5, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE INTELIGENCIA ARTIFICIAL', 5, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE INGENIERIA DE SOFTWARE Y COMPUTACION MOVIL', 5, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('SALA DE INFORMATICA 1', 5, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('SALA DE INFORMATICA 2', 5, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('SALA DE INFORMATICA 3', 5, 1);

--PISO 6 EDIFICIO TECHNE (1)
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE CIRCUITOS IMPRESOS ATENCION A ESTUDIANTES', 6, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('TALLER MANTENIMIENTO ELECTRONICA', 6, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE ELECTRONICA ANALOGA', 6, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE TELECOMUNICACIONES', 6, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE AUTOMATIZACION Y CONTROL', 6, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE ELECTROMAGNETISMO /CIENCIAS BASICAS', 6, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE ELECTRONICA DIGITAL', 6, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE ELECTRONICA APLICADA', 6, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE PRACTICAS LIBRES', 6, 1);

--PISO 7 EDIFICIO TECHNE (1)
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE FISICA MECANICA 1', 7, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE FISICA MECANICA 2', 7, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE FISICA MECANICA 3', 7, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE QUIMICA AMBIENTAL', 7, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO DE QUIMICA BASICA', 7, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO FLUIDOS Y TERMODINAMICA', 7, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('LABORATORIO OPTICA Y MODERNA', 7, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('ALMACEN DE EQUIPOS ESPECIALES', 7, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('ALMACEN DE REACTIVOS', 7, 1);

--PISO 8 EDIFICIO TECHNE (1)
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('SALA DE AUDIOVISUALES 1', 8, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('SALA DE AUDIOVISUALES 2', 8, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('SALA DE AUDIOVISUALES 3', 8, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('SALA DE AUDIOVISUALES 4', 8, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('SALA DE AUDIOVISUALES 5', 8, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('SALA DE AUDIOVISUALES 6', 8, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('SALA DE AUDIOVISUALES 7', 8, 1);
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('SALA DE AUDIOVISUALES 8', 8, 1);

--PISO 9 EDIFICIO TECHNE (1)
INSERT INTO AulasPisos (nombre_aula, id_piso, id_edificio) VALUES ('CANCHA FUTBOL 5', 9, 1);

UPDATE aulaspisos SET id_edificio = 6;
UPDATE aulaspisos SET nombre_aula = 'LABORATORIO DE SIMULACION Y REALIDAD VIRTUAL' WHERE id_aula_piso = 40;
UPDATE aulaspisos SET nombre_aula = 'LABORATORIO DE INTELIGENCIA ARTIFICIAL' WHERE id_aula_piso = 41;
UPDATE aulaspisos SET nombre_aula = 'LABORATORIO DE INGENIERIA DE SOFTWARE' WHERE id_aula_piso = 42;
UPDATE aulaspisos SET nombre_aula = 'LABORATORIO REDES Y TELEMATICA' WHERE id_aula_piso = 37;

INSERT INTO Horarios (id_grupo, id_salon)
SELECT 
    g.id_grupo,
    s.id_salon 
FROM matrizgeneral m
JOIN Grupos g ON m.grupo = g.grupo
JOIN Salones s 
  ON TRIM(REGEXP_REPLACE(m.salon, '\s*CAP\(\d+\)', '', 'g')) = s.nombre
 AND m.edificio = (SELECT e.edificio FROM Edificio e WHERE e.id_edificio = s.id_edificio)
WHERE m.salon IS NOT NULL AND m.salon ~ 'CAP\(\d+\)';



