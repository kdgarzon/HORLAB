import { Box, Button, CircularProgress, TextField } from "@mui/material"
import { useState, useEffect } from "react";
import {useNavigate, useParams} from 'react-router-dom'
import Dias from "./ListasDesplegables/Dias";
import Horas from "./ListasDesplegables/Horas";
import Asignaturas from "./ListasDesplegables/Asignaturas";
import Proyectos from "./ListasDesplegables/Proyectos";

const initialGroupState = {
  id_dia: null,
  id_hora: null,
  grupo: '',
  id_asignatura: null,
  id_proyecto: null,
  inscritos: 0
};

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

  // Manejador para cuando se selecciona un dia de la lista
  const handleDaySelect = (dayId) => {
    setGrupo((prevGroup) => ({
      ...prevGroup,
      id_dia: dayId
    }));
  };

  // Manejador para cuando se selecciona una hora de la lista
  const handleHourSelect = (hourId) => {
    setGrupo((prevGroup) => ({
      ...prevGroup,
      id_hora: hourId
    }));
  };
  // Manejador para cuando se selecciona una asignatura de la lista
  const handleSubjectSelect = (subjectId) => {
    setGrupo((prevGroup) => ({
      ...prevGroup,
      id_asignatura: subjectId
    }));
  };

  // Manejador para cuando se selecciona un proyecto de la lista
  const handleProjectSelect = (projectId) => {
    setGrupo((prevGroup) => ({
      ...prevGroup,
      id_proyecto: projectId
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault(); //Cancela el refresh del boton del formulario
    setLoadingCrear(true);

    if (
        !grupo.id_dia ||
        !grupo.id_hora ||
        !grupo.grupo ||
        !grupo.id_asignatura ||
        !grupo.id_proyecto ||
        !grupo.inscritos
    ) {
      alert("Por favor, completa todos los campos antes de continuar.");
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

    } else {
      if (!grupo.id_dia || !grupo.id_hora || !grupo.id_asignatura || !grupo.id_proyecto) {
        alert("Por favor, asegurate de seleccionar un dia, una hora, una asignatura y un proyecto."); 
        //setLoadingCrear(false);
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
        
      } catch (error) {
        console.error("Error al crear grupo:", error);
        // Muestra un mensaje de error al usuario
        alert(`Error al crear grupo: ${error.message}`);
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
  
  const loadOneGrupo = async (id_grupo) => {
    const res = await fetch(`http://localhost:5000/subjects/${params.id}/groups/${id_grupo}`);
    const data = await res.json()
    
    setGrupo({
      id_dia: data.id_dia ?? null,
      id_hora: data.id_hora ?? null,
      grupo: data.grupo ?? '',
      id_asignatura: data.id_asignatura ?? null,
      id_proyecto: data.id_proyecto ?? null,
      hora: data.hora ?? '',
      inscritos: data.inscritos ?? 0
    });
    setEditing(true);
  }

  useEffect(() => {
    if (groupId) {
        loadOneGrupo(groupId);
        setEditing(true);
    } else {
        setGrupo(initialGroupState);  
        setEditing(false);
    }
  }, [groupId]);

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
        selectedDiaId={grupo.id_dia}
        onSelect={handleDaySelect}
      />
      <Horas
        horas={horas}
        setHoras={setHoras}
        selectedHourId={grupo.id_hora}
        onSelect={handleHourSelect}
      />
      <Asignaturas
        asignaturas={asignaturas}
        setAsignaturas={setAsignaturas}
        selectedSubjectId={grupo.id_asignatura}
        onSelect={handleSubjectSelect}
      />
      <Proyectos
        proyectos={proyectos}
        setProyectos={setProyectos}
        selectedProyectoId={grupo.id_proyecto}
        onSelect={handleProjectSelect}
      />
  
      {!hideInternalSubmitButton && (
        <Button
          variant="contained"
          color="info"
          type="submit"
          disabled={
            !grupo.dia ||
            !grupo.hora ||
            !grupo.grupo ||
            !grupo.nombre ||
            !grupo.proyecto ||
            !grupo.inscritos
          }
        >
          {loadingCrear ? (
            <CircularProgress color="inherit" size={24} />
          ) : params.id ? 'EDITAR GRUPO' : 'CREAR GRUPO'}
        </Button>
      )}
    </Box>
  );
  
}