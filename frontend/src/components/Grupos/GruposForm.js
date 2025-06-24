import { Box, Button, CircularProgress, TextField } from "@mui/material"
import { useState, useEffect } from "react";
import {useNavigate, useParams} from 'react-router-dom'
import Dias from "../Complementos/ListasDesplegables/Dias";
import Horas from "../Complementos/ListasDesplegables/Horas";
import Proyectos from "../Complementos/ListasDesplegables/Proyectos";
import { alertaSuccessorError } from "../Alertas/Alert_Success";
import { initialGroupState } from "../Complementos/initialStates";
import { handleDaySelect, handleHourSelect, handleProjectSelect, handleChange, generarNombreGrupo, loadOneGrupo, handleSubmit } from "./FuncionesGroups";

const ID_PERIODO_FIJO = 1; // ID del periodo fijo
const NOMBRE_PERIODO_FIJO = "2025-1"; // Nombre del periodo fijo

export default function GruposForm({ groupId, hideInternalSubmitButton = false, onExternalSubmit }) {
  //Listas desplegables
  const [dias, setDias] = useState([]); // Array para almacenar los dias { id_dia, dia } 
  const [horas, setHoras] = useState([]); // Array para almacenar las horas { id_hora, hora } 
  const [proyectos, setProyectos] = useState([]); // Array para almacenar los proyectos { id_proyecto, proyecto  } 
  const [horasFusionadas, setHorasFusionadas] = useState([]);

  const navigate = useNavigate();
  const params = useParams();
  const [loadingCrear, setLoadingCrear] = useState(false);
  const [editing, setEditing] = useState(null)
  
  const [grupo, setGrupo] = useState(initialGroupState);
  const [rawGrupo, setRawGrupo] = useState(null);
  const [proyectoFijo, setProyectoFijo] = useState(null); // Si solo hay un proyecto asociado
  const [nombreAsignatura, setNombreAsignatura] = useState("");

  //archivo de funciones
  const onDaySelect = handleDaySelect(setGrupo);
  const onHourSelect = handleHourSelect(setGrupo);
  const onProjectSelect = handleProjectSelect(setGrupo);
  const onChange = handleChange(setGrupo);

  useEffect(() => {
    const cargarNombreAsignatura = async () => {
      const res = await fetch(`http://localhost:5000/subjects/${params.id}`);
      const data = await res.json();
      setNombreAsignatura(data.nombre); // Suponemos que el campo es `nombre`
    };
    cargarNombreAsignatura();
  }, [params.id]);

  useEffect(() => {
    console.log("Valor de editing en useEffect:", editing);
    if (!editing && grupo.id_asignatura && grupo.proyecto &&!rawGrupo) {
      generarNombreGrupo(grupo.id_asignatura, grupo.proyecto, setGrupo);
    }
  }, [grupo.id_asignatura, grupo.proyecto, editing, rawGrupo]);


  useEffect(() => {
    if (rawGrupo && dias.length && horas.length && proyectos.length && horasFusionadas.length) {
      // Busca los IDs correspondientes
      const diaObj = dias.find(d => d.dia === rawGrupo.dia);
      const proyectoObj = proyectos.find(p => p.proyecto === rawGrupo.proyecto);
      // Encontrar la franja fusionada que contenga el valor de hora original

      let horaSeleccionada = [];
      if (Array.isArray(rawGrupo.hora)) {
        horaSeleccionada = rawGrupo.hora;
      } else if (typeof rawGrupo.hora === "string") {
        // 1. Coincidencia exacta por nombre
        let franja = horasFusionadas.find(f => f.nombre === rawGrupo.hora);

        // 2. Coincidencia por inclusión
        if (!franja) {
          franja = horasFusionadas.find(f =>
            f.nombre.includes(rawGrupo.hora) ||
            f.ids.some(id => {
              const objHora = horas.find(h => h.id_hora === id);
              return objHora && objHora.hora === rawGrupo.hora;
            })
          );
        }
        if (franja) horaSeleccionada = franja.ids;
      }

      setGrupo({
        dia: diaObj ? diaObj.id_dia : '',
        hora: horaSeleccionada,
        grupo: rawGrupo.grupo ?? '',
        id_asignatura: params.id ?? null,
        proyecto: proyectoObj ? proyectoObj.id_proyecto : '',
        inscritos: rawGrupo.inscritos ?? 0,
        id_periodo: ID_PERIODO_FIJO
      });
    }
  }, [rawGrupo, dias, horas, proyectos, horasFusionadas, params.id]);

  useEffect(() => {
    const cargarProyectosPorAsignatura = async () => {
      const res = await fetch(`http://localhost:5000/subjects/${params.id}/projects`);
      const data = await res.json();
      setProyectos(data);

      if (data.length === 1) {
        setProyectoFijo(data[0]); // Solo hay un proyecto, se fija
        console.log("Proyecto fijo encontrado:", data[0]);  
        setGrupo((prev) => ({ ...prev, proyecto: data[0].id_proyecto }));
        if (editing === false &&!rawGrupo) { 
          generarNombreGrupo(params.id, data[0].id_proyecto, setGrupo);
        }
      } else {
        setProyectoFijo(null); // Hay múltiples proyectos, se habilita el selector
      }
    };
    cargarProyectosPorAsignatura();
  }, [params.id, editing, rawGrupo]);

  useEffect(() => {
    const idDeAsignatura = params.id;
    if (groupId) {
      loadOneGrupo(groupId, params.id, setRawGrupo, setEditing);
    } else {
      setGrupo({
        ...initialGroupState,
        id_asignatura: idDeAsignatura ?? null, // Aseguramos que la asignatura se establezca al crear un nuevo grupo
        id_periodo: ID_PERIODO_FIJO
      })
      setEditing(false);
    }
  }, [groupId, params.id]);

  return (
    <Box
      id="group-form" component="form" 
      onSubmit={(e) => handleSubmit(
        e, grupo, setLoadingCrear, editing, params,
        navigate, alertaSuccessorError, onExternalSubmit, groupId
      )}
      noValidate autoComplete="off"
      sx={{
        maxWidth: 500, margin: "auto", padding: 2,
        display: "flex", flexDirection: "column", gap: 2,
      }}
    >
      <TextField
        label="Período académico"
        value={NOMBRE_PERIODO_FIJO}
        disabled
      />
      <Dias
        dias={dias}
        setDias={setDias}
        selectedDiaId={grupo.dia}
        onSelect={onDaySelect}
      />
      <Horas
        horas={horas}
        setHoras={setHoras}
        selectedHoraId={grupo.hora}
        onSelect={onHourSelect}
        horasFusionadas={horasFusionadas}
        setHorasFusionadas={setHorasFusionadas}
      />
      <TextField
        label="Grupo"
        name="grupo"
        value={grupo.grupo || ""}
        onChange={onChange}
        disabled
      />
      <TextField
        label="Asignatura"
        value={nombreAsignatura}
        disabled
      />
      {proyectoFijo ? (
        <TextField
          label="Proyecto"
          value={proyectoFijo.proyecto}
          disabled
        />
      ) : (
        <Proyectos
          proyectos={proyectos}
          setProyectos={setProyectos}
          selectedProyectoId={grupo.proyecto}
          onSelect={onProjectSelect}
        />
      )}
      <TextField
        label="Número de inscritos"
        name="inscritos"
        type="number"
        value={grupo.inscritos}
        onChange={onChange}
      />
  
      {!hideInternalSubmitButton && (
        <Button
          variant="contained"
          color="info"
          type="submit"
          disabled={
            !grupo.dia || !grupo.hora?.length || !grupo.grupo ||
            !grupo.nombre || !grupo.proyecto || !grupo.inscritos
          }
        >
          {loadingCrear ? (
            <CircularProgress color="inherit" size={24} />
          ) : editing ? 'EDITAR GRUPO' : 'CREAR GRUPO'}
        </Button>
      )}  
    </Box>
  );
  
}