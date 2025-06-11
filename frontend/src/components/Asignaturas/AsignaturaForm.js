import { Box, Button, CircularProgress, TextField } from "@mui/material"
import { useState, useEffect } from "react";
import {useNavigate, useParams} from 'react-router-dom'
import { alertaSuccessorError } from "../Alertas/Alert_Success";
import { initialSubjectState } from "../Complementos/initialStates";

export default function AsignaturaForm({ asigId, hideInternalSubmitButton = false, onExternalSubmit }) {
  const navigate = useNavigate();
  const params = useParams();
  const [loadingCrear, setLoadingCrear] = useState(false);
  const [editing, setEditing] = useState(false)
  
  const [asignatura, setAsignatura] = useState(initialSubjectState);

  const handleSubmit = async e => {
    e.preventDefault(); //Cancela el refresh del boton del formulario
    setLoadingCrear(true);

    if (
        !asignatura.codigo_asig ||
        !asignatura.nombre
    ) {
      alertaSuccessorError({
        titulo: 'Campos incompletos',
        icono: 'warning',
      });
      setLoadingCrear(false);
      return;
    }
    

    if (editing) {
      const res = await fetch(`http://localhost:5000/subjects/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(asignatura),
        headers: {"Content-Type": "application/json"}
      });
      const data = await res.json()
      console.log("Respuesta del servidor: ", data);

      alertaSuccessorError({
        titulo: 'Asignatura editada correctamente',
        icono: 'success',
      });

    } else {
      try {
        const res = await fetch('http://localhost:5000/subjects', {
          method: 'POST',
          body: JSON.stringify(asignatura),
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
          titulo: 'Asignatura creada correctamente',
          icono: 'success',
        });
        
      } catch (error) {
        console.error("Error al crear asignatura:", error);
        alertaSuccessorError({
          titulo: 'Error al crear la asignatura',
          icono: 'error',
        });
      }
    }
    setLoadingCrear(false);
    if (onExternalSubmit) {
      onExternalSubmit();
    } else {
      navigate('/ListarAsignaturas');
    }
  }

  const handleChange = (e) => 
    setAsignatura({...asignatura, [e.target.name]: e.target.value}); //Actualiza el valor que vamos a enviar del TextField
  
  const loadOneAsignatura = async (id) => {
    const res = await fetch(`http://localhost:5000/subjects/${id}`)
    const data = await res.json()
    
    setAsignatura({
        codigo_asig: data.codigo_asig ?? null,
        nombre: data.nombre ?? ''
    });

    setEditing(true);
  }

  useEffect(() => {
    if (asigId) {
        loadOneAsignatura(asigId);
        setEditing(true);
    } else {
        setAsignatura(initialSubjectState);
        setEditing(false);
    }
  }, [asigId]);

  return (
    <Box
      id="asignatura-form"
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
        label="Código de la asignatura"
        type="number"
        name="codigo_asig"
        value={asignatura.codigo_asig}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Nombre de la asignatura"
        name="nombre"
        value={asignatura.nombre}
        onChange={handleChange}
      />
  
      {!hideInternalSubmitButton && (
        <Button
          variant="contained"
          color="info"
          type="submit"
          disabled={
            !asignatura.codigo_asig ||
            !asignatura.nombre
          }
        >
          {loadingCrear ? (
            <CircularProgress color="inherit" size={24} />
          ) : params.id ? 'EDITAR ASIGNATURA' : 'CREAR ASIGNATURA'}
        </Button>
      )}
    </Box>
  );
  
}