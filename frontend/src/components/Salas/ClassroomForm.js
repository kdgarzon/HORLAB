import { Box, Button, CircularProgress, TextField } from "@mui/material"
import { useState, useEffect } from "react";
import {useNavigate, useParams} from 'react-router-dom'
import { alertaSuccessorError } from "../Alertas/Alert_Success";
import { initialClassroomState } from "../Complementos/initialStates";
import Edificios from "../Complementos/ListasDesplegables/Edificios";

export default function ClassroomForm({ classId, hideInternalSubmitButton = false, onExternalSubmit }) {
  const navigate = useNavigate();
  const params = useParams();
  const [loadingCrear, setLoadingCrear] = useState(false);
  const [editing, setEditing] = useState(false)
  const [alertaEstado, setAlertaEstado] = useState(null); 
  const [classroom, setClassroom] = useState(initialClassroomState);

  const [edificios, setEdificios] = useState([]); // Array para almacenar los edificios { id_edificio, edificio }

  const handleBuildingSelect = (BuildingId) => {
    setEdificios((prevBuildings) => ({
      ...prevBuildings,
      id_edificio: BuildingId
    }));
  };

  useEffect(() => {
    if (alertaEstado) {
      alertaSuccessorError(alertaEstado);
      // Limpia el estado después de mostrar la alerta
      const timer = setTimeout(() => setAlertaEstado(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertaEstado]);

  const handleSubmit = async e => {
    e.preventDefault(); //Cancela el refresh del boton del formulario
    setAlertaEstado(null); // Resetea el estado de alerta

    if (
        !classroom.nombre || !classroom.id_edificio || 
        !classroom.capacidad || !classroom.area
    ) {
      setAlertaEstado({
        titulo: 'Campos incompletos',
        icono: 'warning',
      });
      setLoadingCrear(false);
      return;
    }

    if (editing) {
      try {
        const res = await fetch(`http://localhost:5000/classrooms/${params.id}`, {
          method: 'PUT',
          body: JSON.stringify(classroom),
          headers: {"Content-Type": "application/json"}
        });

        if(!res.ok){
          const errorData = await res.json(); // Ahora sí es seguro acceder
          throw new Error(errorData.message || 'Error del servidor');
        }
        const data = await res.json()
        console.log("Respuesta del servidor: ", data);

        setAlertaEstado({
          titulo: 'Sala editada correctamente',
          icono: 'success',
        });
      } catch (error) {
        console.error("Error al editar sala:", error);
        alertaSuccessorError({
          titulo: 'Error al crear sala',
          icono: 'error',
        });
      }
    } else {
      try {
        setLoadingCrear(true);

        const res = await fetch('http://localhost:5000/classrooms', {
          method: 'POST',
          body: JSON.stringify(classroom),
          headers: {"Content-Type": "application/json"}
        });
 
        if(!res.ok){
          const errorData = await res.json(); 
          throw new Error(errorData.message || 'Error del servidor');
        }
        const data = await res.json();
        console.log("Respuesta del servidor: ", data);

        setAlertaEstado({
          titulo: 'Sala creada correctamente',
          icono: 'success',
        });

        setClassroom({
          nombre: '', id_edificio: null, capacidad: '', area: ''
        }); 
        
      } catch (error) {
        console.error("Error al crear sala:", error);
        alertaSuccessorError({
          titulo: 'Error al crear sala',
          icono: 'error',
        });
      } finally {
        setLoadingCrear(false);
      }
    }
    if (onExternalSubmit) {
      onExternalSubmit();
    } else {
      navigate('/ListarSalas');
    }
  }
  
  const handleChange = (e) => 
    setClassroom({...classroom, [e.target.name]: e.target.value}); //Actualiza el valor que vamos a enviar del TextField

  const loadOneClassroom = async (id) => {
    const res = await fetch(`http://localhost:5000/classrooms/${id}`);
    const data = await res.json();
    setClassroom({
      nombre: data.nombre ?? '',
      id_edificio: data.id_edificio ?? null,
      capacidad: data.capacidad ?? '',
      area: data.area ?? ''
    });
    setEditing(true);
  }

  useEffect(() => {
    if (classId) {
      loadOneClassroom(classId);
      setEditing(true);
    } else {
      setClassroom(initialClassroomState);
      setEditing(false);
    }
  }, [classId]);

  return (
    <Box
      id="classroom-form"
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
        label="Nombre de la sala"
        name="nombre"
        value={classroom.nombre}
        onChange={handleChange}
      />
      <Edificios
        edificios={edificios}
        setEdificios={setEdificios}
        selectedEdificioId={classroom.edificio}
        onSelect={handleBuildingSelect}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Capacidad de la sala"
        type="number"
        name="capacidad"
        value={classroom.capacidad}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Área de la sala"
        name="area"
        value={classroom.area}
        autoComplete="new-username"
        onChange={handleChange}
      />
  
      {!hideInternalSubmitButton && (
        <Button
          variant="contained"
          color="info"
          type="submit"
          disabled={
            !classroom.nombre || 
            !classroom.id_edificio || 
            !classroom.capacidad || 
            !classroom.area
          }
        >
          {loadingCrear ? (
            <CircularProgress color="inherit" size={24} />
          ) : params.id ? 'EDITAR SALA' : 'CREAR SALA'}
        </Button>
      )}
    </Box>
  );
  
}