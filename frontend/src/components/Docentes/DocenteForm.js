import { Alert, AlertTitle, Box, Button, CircularProgress, TextField } from "@mui/material"
import { useState, useEffect } from "react";
import {useNavigate, useParams} from 'react-router-dom'
import { alertaSuccessorError } from "../Alertas/Alert_Success";
import { initialDocenteState } from "../Complementos/initialStates";

export default function DocenteForm({ docenteId, hideInternalSubmitButton = false, onExternalSubmit }) {

  const navigate = useNavigate();
  const params = useParams();
  const [loadingCrear, setLoadingCrear] = useState(false);
  const [editing, setEditing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('');
  
  const [docente, setDocente] = useState(initialDocenteState);

  const handleSubmit = async e => {
    e.preventDefault(); //Cancela el refresh del boton del formulario
    setLoadingCrear(true);

    if (!docente.nombre) {
      alertaSuccessorError({
        titulo: 'Campos incompletos',
        icono: 'warning',
      });
      setLoadingCrear(false);
      return;
    }

    if (editing) {
      const res = await fetch(`http://localhost:5000/teachers/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(docente),
        headers: {"Content-Type": "application/json"}
      });
      const data = await res.json()
      console.log("Respuesta del servidor: ", data);

      alertaSuccessorError({
        titulo: 'Docente editado correctamente',
        icono: 'success',
      });

    } else {
      try {
        const res = await fetch('http://localhost:5000/teachers', {
          method: 'POST',
          body: JSON.stringify(docente),
          headers: {"Content-Type": "application/json"}
        });
  
        if(!res.ok){
          // Si la respuesta no es OK, intenta leer el cuerpo como texto para ver el error del backend
          const errorData = await res.json();
          if(res.status === 409){
            setErrorMessage(errorData.error)
            return;
          }else{
            throw new Error(errorData.error || `Error del servidor: ${res.status}`);
          }
        }
        const data = await res.json()
        console.log("Respuesta del servidor: ", data);

        alertaSuccessorError({
          titulo: 'Docente creado correctamente',
          icono: 'success',
        });
        
      } catch (error) {
        console.error("Error al crear el docente:", error);
        alertaSuccessorError({
          titulo: 'Error al crear el docente',
          icono: 'error',
        });
      }
    }
    setLoadingCrear(false);
    if (onExternalSubmit) {
      onExternalSubmit();
    } else {
      navigate('/ListarDocentes');
    }
  }
  
  const handleChange = (e) => 
    setDocente({...docente, [e.target.name]: e.target.value.toUpperCase()}); //Actualiza el valor que vamos a enviar del TextField
  
  const loadOneDocente = async (id) => {
    const res = await fetch(`http://localhost:5000/teachers/${id}`)
    const data = await res.json()

    setDocente({
      nombre: data.nombre ?? ''
    });
    setEditing(true);
  }

  useEffect(() => {
    if (docenteId) {
      loadOneDocente(docenteId);
      setEditing(true);
    } else {
      setDocente(initialDocenteState);
      setEditing(false);
    }
  }, [docenteId]);

  return (
    <Box
      id="docente-form"
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
      {errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage('')}>
          <AlertTitle>Error</AlertTitle>
          {errorMessage}
        </Alert>
      )}
      <TextField
        fullWidth
        variant="outlined"
        label="Nombre del docente"
        name="nombre"
        value={docente.nombre}
        onChange={handleChange}
        sx={{'& input': {textTransform: 'uppercase'}}}
        helperText="Escribe primero los nombres y luego los apellidos completos."
      />
  
      {!hideInternalSubmitButton && (
        <Button
          variant="contained"
          color="info"
          type="submit"
          disabled={!docente.nombre}
        >
          {loadingCrear ? (
            <CircularProgress color="inherit" size={24} />
          ) : params.id ? 'EDITAR DOCENTE' : 'CREAR DOCENTE'}
        </Button>
      )}
    </Box>
  );
  
}