import { Box, Button, CircularProgress, TextField } from "@mui/material"
import { useState, useEffect } from "react";
import {useNavigate, useParams} from 'react-router-dom'

const initialGroupState = {
  dia: '',
  hora: '',
  grupo: '',
  nombre: '',
  proyecto: '',
  inscritos: 0
};

export default function GruposForm({ groupId, hideInternalSubmitButton = false, onExternalSubmit }) {
  const navigate = useNavigate();
  const params = useParams();
  const [loadingCrear, setLoadingCrear] = useState(false);
  const [editing, setEditing] = useState(false)
  const [grupo, setGrupo] = useState(initialGroupState);

  const handleSubmit = async e => {
    e.preventDefault(); //Cancela el refresh del boton del formulario
    setLoadingCrear(true);

    if (
        !grupo.dia ||
        !grupo.hora ||
        !grupo.grupo ||
        !grupo.nombre ||
        !grupo.proyecto ||
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
      dia: data.dia ?? '',
      hora: data.hora ?? '',
      grupo: data.grupo ?? '',
      nombre: data.nombre ?? '',
      proyecto: data.proyecto ?? '',
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
      <TextField
        fullWidth
        variant="outlined"
        label="Dia de la semana"
        name="dia"
        type="text"
        value={grupo.dia}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Franja horaria"
        name="hora"
        type="text"
        value={grupo.hora}
        onChange={handleChange}
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