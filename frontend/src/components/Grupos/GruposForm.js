import { Box, Button, CircularProgress, TextField } from "@mui/material"
import { useState, useEffect, useCallback } from "react";
import {useNavigate, useParams} from 'react-router-dom'
import Dias from "../Complementos/ListasDesplegables/Dias";
import Horas from "../Complementos/ListasDesplegables/Horas";
import Proyectos from "../Complementos/ListasDesplegables/Proyectos";
import { alertaSuccessorError } from "../Alertas/Alert_Success";
import { initialGroupState } from "../Complementos/initialStates";

export default function GruposForm({ groupId, hideInternalSubmitButton = false, onExternalSubmit }) {
  //Listas desplegables
  const [dias, setDias] = useState([]); // Array para almacenar los dias { id_dia, dia } 
  const [horas, setHoras] = useState([]); // Array para almacenar las horas { id_hora, hora } 
  const [proyectos, setProyectos] = useState([]); // Array para almacenar los proyectos { id_proyecto, proyecto  } 
  const [horasFusionadas, setHorasFusionadas] = useState([]);

  const navigate = useNavigate();
  const params = useParams();
  const [loadingCrear, setLoadingCrear] = useState(false);
  const [editing, setEditing] = useState(false)
  
  const [grupo, setGrupo] = useState(initialGroupState);
  const [rawGrupo, setRawGrupo] = useState(null);
  const [proyectoFijo, setProyectoFijo] = useState(null); // Si solo hay un proyecto asociado
  const [nombreAsignatura, setNombreAsignatura] = useState("");
  const [idPeriodoFijo] = useState(1); // Período "2025-1"
  const [nombrePeriodoFijo] = useState("2025-1");

  const handleDaySelect = (dayId) => {
    setGrupo((prevGroup) => ({
      ...prevGroup,
      dia: dayId 
    }));
  };

  const handleHourSelect = (hourIds) => {
    setGrupo((prevGroup) => ({
      ...prevGroup,
      hora: hourIds
    }));
  };

  useEffect(() => {
    const cargarNombreAsignatura = async () => {
      const res = await fetch(`http://localhost:5000/subjects/${params.id}`);
      const data = await res.json();
      setNombreAsignatura(data.nombre); // Suponemos que el campo es `nombre`
    };

    cargarNombreAsignatura();
  }, [params.id]);

  const handleProjectSelect = (projectId) => {
    setGrupo((prevGroup) => ({
      ...prevGroup,
      proyecto: projectId 
    }));
    generarNombreGrupo(params.id, projectId);
  };

  const handleSubmit = async e => {
    e.preventDefault(); //Cancela el refresh del boton del formulario
    setLoadingCrear(true);

    if (
        !grupo.periodo || !grupo.dia || !grupo.hora || !grupo.grupo ||
        !grupo.id_asignatura || !grupo.proyecto || !grupo.inscritos
    ) {
      alertaSuccessorError({
        titulo: 'Campos incompletos',
        icono: 'warning',
      });
      setLoadingCrear(false);
      return;
    }
    
    if (editing) {
      const res = await fetch(`http://localhost:5000/subjects/${params.id}/groups/${groupId}`, {
        method: 'PUT',
        body: JSON.stringify(grupo),
        headers: {"Content-Type": "application/json"}
      });
      const data = await res.json()
      console.log("Respuesta del servidor: ", data);

      alertaSuccessorError({
        titulo: 'Grupo editado correctamente',
        icono: 'success',
      });

    } else {
      if (!grupo.periodo || !grupo.id_dia || !grupo.id_hora || !grupo.id_asignatura || !grupo.proyecto) {
        alertaSuccessorError({
          titulo: 'Campos incompletos',
          icono: 'warning',
        });
        return;
      }

      try {
        if (!Array.isArray(grupo.hora)) {
          throw new Error("Hora debe ser un array de IDs");
        } 

        for (const id_hora of grupo.hora) {
          const nuevoGrupo = {
            ...grupo,
            hora: id_hora
          };

          const res = await fetch(`http://localhost:5000/subjects/${params.id}/groups`, {
            method: 'POST',
            body: JSON.stringify(nuevoGrupo),
            headers: {"Content-Type": "application/json"}
          });

          if (!res.ok) {
            const errorData = await res.text();
            throw new Error(`Error del servidor: ${res.status} - ${errorData}`);
          }
          const data = await res.json()
          console.log("Respuesta del servidor: ", data);
        }
        alertaSuccessorError({
          titulo: 'Grupo creado correctamente',
          icono: 'success',
        });
        
      } catch (error) {
        console.error("Error al crear grupo:", error);
        alertaSuccessorError({
          titulo: 'Error al crear grupo',
          icono: 'error',
        });
      }
    }
    setLoadingCrear(false);
    if (onExternalSubmit) {
      onExternalSubmit();
    } else {
      navigate(`/ListarAsignaturas/Asignaturas/${params.id}/ListarGrupos`);
    }
  }

  const handleChange = (e) => 
    setGrupo({...grupo, [e.target.name]: e.target.value}); //Actualiza el valor que vamos a enviar del TextField
  
  const loadOneGrupo = useCallback(async (id_grupo) => {
    const res = await fetch(`http://localhost:5000/subjects/${params.id}/groups/${id_grupo}`);
    const data = await res.json()
    
    console.log("Datos del grupo:", data);
    setRawGrupo(data); // Guarda los datos crudos
    setEditing(true);
  }, [params.id]);

  const generarNombreGrupo = async (idAsignatura, id_proyecto) => {
    const res = await fetch(`http://localhost:5000/subjects/${idAsignatura}/projects/${id_proyecto}/consecutive`);
    const data = await res.json();

    const nuevoNombre = `${data.codigo}-${data.siguiente}`;
    setGrupo((prev) => ({ 
      ...prev, 
      grupo: nuevoNombre 
    }));
  };  

  useEffect(() => {
    if (!editing && grupo.id_asignatura && grupo.proyecto) {
      generarNombreGrupo(grupo.id_asignatura, grupo.proyecto);
    }
  }, [grupo.id_asignatura, grupo.proyecto, editing]);


  useEffect(() => {
    if (rawGrupo && dias.length && horas.length && proyectos.length) {
      // Busca los IDs correspondientes
      const diaObj = dias.find(d => d.dia === rawGrupo.dia);
      const proyectoObj = proyectos.find(p => p.proyecto === rawGrupo.proyecto);

      // Encontrar la franja fusionada que contenga el valor de hora original
      const franjaFusionada = horasFusionadas.find(f =>
        f.nombre === rawGrupo.hora
      );

      setGrupo({
        dia: diaObj ? diaObj.id_dia : '',
        hora: franjaFusionada ? franjaFusionada.ids : [],
        grupo: rawGrupo.grupo ?? '',
        id_asignatura: params.id ?? null,
        proyecto: proyectoObj ? proyectoObj.id_proyecto : '',
        inscritos: rawGrupo.inscritos ?? 0,
        id_periodo: idPeriodoFijo
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
        generarNombreGrupo(params.id, data[0].id_proyecto);
      } else {
        setProyectoFijo(null); // Hay múltiples proyectos, se habilita el selector
      }
    };

    cargarProyectosPorAsignatura();
  }, [params.id]);


  useEffect(() => {
    const idDeAsignatura = params.id;
    if (groupId) {
      loadOneGrupo(groupId);
    } else {
      setGrupo({
        ...initialGroupState,
        id_asignatura: idDeAsignatura ?? null, // Aseguramos que la asignatura se establezca al crear un nuevo grupo
        id_periodo: idPeriodoFijo
      })
      setEditing(false);
    }
  }, [groupId, params.id, loadOneGrupo, setGrupo, setEditing]);

  return (
    <Box
      id="group-form" component="form" onSubmit={handleSubmit}
      noValidate autoComplete="off"
      sx={{
        maxWidth: 500, margin: "auto", padding: 2,
        display: "flex", flexDirection: "column", gap: 2,
      }}
    >
      <TextField
        label="Período académico"
        value={nombrePeriodoFijo}
        disabled
      />
      <Dias
        dias={dias}
        setDias={setDias}
        selectedDiaId={grupo.dia}
        onSelect={handleDaySelect}
      />
      <Horas
        horas={horas}
        setHoras={setHoras}
        selectedHoraId={grupo.hora}
        onSelect={handleHourSelect}
        horasFusionadas={horasFusionadas}
        setHorasFusionadas={setHorasFusionadas}
      />
      <TextField
        label="Grupo"
        name="grupo"
        value={grupo.grupo || ""}
        onChange={handleChange}
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
          onSelect={handleProjectSelect}
        />
      )}
      <TextField
        label="Número de inscritos"
        name="inscritos"
        type="number"
        value={grupo.inscritos}
        onChange={handleChange}
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