import { Box, Button, CircularProgress, TextField } from "@mui/material"
import { useState, useEffect, useCallback } from "react";
import {useNavigate, useParams} from 'react-router-dom'
import Dias from "./ListasDesplegables/Dias";
import Horas from "./ListasDesplegables/Horas";
import Asignaturas from "./ListasDesplegables/Asignaturas";
import Proyectos from "./ListasDesplegables/Proyectos";
import { alertaSuccessorError } from "../Alertas/Alert_Success";

const initialGroupState = {
  dia: '',
  hora: '',
  grupo: '',
  id_asignatura: null,
  proyecto: '',
  inscritos: 0
};
console.log("Grupo inicial:", initialGroupState);

export default function GruposForm({ groupId, hideInternalSubmitButton = false, onExternalSubmit }) {
  //Listas desplegables
  const [dias, setDias] = useState([]); // Array para almacenar los dias { id_dia, dia } 
  const [horas, setHoras] = useState([]); // Array para almacenar las horas { id_hora, hora } 
  const [asignaturas, setAsignaturas] = useState([]); // Array para almacenar las asignaturas { id_asignatura, asignatura } 
  const [proyectos, setProyectos] = useState([]); // Array para almacenar los proyectos { id_proyecto, proyecto  } 
  
  const navigate = useNavigate();
  const params = useParams();
  const [loadingCrear, setLoadingCrear] = useState(false);
  const [editing, setEditing] = useState(false)
  
  const [grupo, setGrupo] = useState(initialGroupState);
  const [rawGrupo, setRawGrupo] = useState(null);
  const [proyectoFijo, setProyectoFijo] = useState(null); // Si solo hay un proyecto asociado

  const handleDaySelect = (dayId) => {
    setGrupo((prevGroup) => ({
      ...prevGroup,
      dia: dayId 
    }));
  };

  const handleHourSelect = (hourId) => {
    setGrupo((prevGroup) => ({
      ...prevGroup,
      hora: hourId
    }));
  };

  const handleSubjectSelect = (subjectId) => {
    setGrupo((prevGroup) => ({
      ...prevGroup,
      id_asignatura: subjectId
    }));
  };

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
        !grupo.dia || !grupo.hora || !grupo.grupo ||
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
      if (!grupo.id_dia || !grupo.id_hora || !grupo.id_asignatura || !grupo.id_proyecto) {
        alertaSuccessorError({
          titulo: 'Campos incompletos',
          icono: 'warning',
        });
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/subjects/${params.id}/groups`, {
          method: 'POST',
          body: JSON.stringify(grupo),
          headers: {"Content-Type": "application/json"}
        });
  
        if(!res.ok){
          // Si la respuesta no es OK, intenta leer el cuerpo como texto para ver el error del backend
          const errorData = await res.text();
          throw new Error(`Error del servidor: ${res.status} - ${errorData}`);
        }
        const data = await res.json()
        console.log("Respuesta del servidor: ", data);

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
      const horaObj = horas.find(h => h.hora === rawGrupo.hora);
      const proyectoObj = proyectos.find(p => p.proyecto === rawGrupo.proyecto);

      setGrupo({
        dia: diaObj ? diaObj.id_dia : '',
        hora: horaObj ? horaObj.id_hora : '',
        grupo: rawGrupo.grupo ?? '',
        id_asignatura: params.id ?? null,
        proyecto: proyectoObj ? proyectoObj.id_proyecto : '',
        inscritos: rawGrupo.inscritos ?? 0
      });
    }
  }, [rawGrupo, dias, horas, proyectos, params.id]);

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
        id_asignatura: idDeAsignatura ?? null // Aseguramos que la asignatura se establezca al crear un nuevo grupo
      })
      setEditing(false);
    }
  }, [groupId, params.id, loadOneGrupo, setGrupo, setEditing]);

  return (
    <Box
      id="group-form"
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      sx={{
        maxWidth: 500,
        margin: "auto",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
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
      />
      <TextField
        label="Grupo"
        name="grupo"
        value={grupo.grupo || ""}
        onChange={handleChange}
        disabled
      />
      <Asignaturas
        asignaturas={asignaturas}
        setAsignaturas={setAsignaturas}
        selectedAsignaturaId={grupo.id_asignatura}
        onSelect={handleSubjectSelect}
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
            !grupo.dia || !grupo.hora || !grupo.grupo ||
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