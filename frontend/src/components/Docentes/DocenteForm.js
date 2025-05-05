import { Box, Button, CircularProgress, TextField } from "@mui/material"
import { useState, useEffect } from "react";
import * as React from 'react';
import {useNavigate, useParams} from 'react-router-dom'

const initialDocenteState = {
  nombre: ''
};

export default function DocenteForm({ docenteId, hideInternalSubmitButton = false, onExternalSubmit }) {

  const navigate = useNavigate();
  const params = useParams();
  const [loadingCrear, setLoadingCrear] = useState(false);
  const [editing, setEditing] = useState(false)
  
  const [docente, setDocente] = useState(initialDocenteState);

  const handleSubmit = async e => {
    e.preventDefault(); //Cancela el refresh del boton del formulario
    setLoadingCrear(true);

    if (!docente.nombre) {
      alert("Por favor, completa todos los campos antes de continuar.");
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

    } else {
      try {
        const res = await fetch('http://localhost:5000/teachers', {
          method: 'POST',
          body: JSON.stringify(docente),
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
        console.error("Error al crear el docente:", error);
        // Muestra un mensaje de error al usuario
        alert(`Error al crear un docente: ${error.message}`);
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
    setDocente({...docente, [e.target.name]: e.target.value}); //Actualiza el valor que vamos a enviar del TextField
  
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

  /*const handleClick = () => {
    setOpen(!open);
  };*/

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
      <TextField
        fullWidth
        variant="outlined"
        label="Nombre del docente"
        name="nombre"
        value={docente.nombre}
        onChange={handleChange}
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