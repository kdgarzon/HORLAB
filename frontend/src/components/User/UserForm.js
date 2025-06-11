import { Box, Button, CircularProgress, TextField } from "@mui/material"
import { useState, useEffect } from "react";
import {useNavigate, useParams} from 'react-router-dom'
import Roles from "./Roles";
import { alertaSuccessorError } from "../Alertas/Alert_Success";
import { initialUserState } from "../Complementos/initialStates";

export default function UserForm({ userId, hideInternalSubmitButton = false, onExternalSubmit }) {
  const [roles, setRoles] = useState([]); // Array para almacenar los roles { id_rol, rol }
  const navigate = useNavigate();
  const params = useParams();
  const [loadingCrear, setLoadingCrear] = useState(false);
  const [editing, setEditing] = useState(false)
  const [alertaEstado, setAlertaEstado] = useState(null); 
  const [user, setUser] = useState(initialUserState);

  // Manejador para cuando se selecciona un rol de la lista
  const handleRoleSelect = (roleId) => {
    setUser((prevUser) => ({
      ...prevUser,
      id_rol: roleId
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
      !user.nombreUser || !user.apellidoUser || !user.correo ||
      !user.usuario || !user.pass || !user.id_rol
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
        const res = await fetch(`http://localhost:5000/users/${params.id}`, {
          method: 'PUT',
          body: JSON.stringify(user),
          headers: {"Content-Type": "application/json"}
        });

        if(!res.ok){
          const errorData = await res.json(); // Ahora sí es seguro acceder
          throw new Error(errorData.message || 'Error del servidor');
        }
        const data = await res.json()
        console.log("Respuesta del servidor: ", data);

        setAlertaEstado({
          titulo: 'Usuario editado correctamente',
          icono: 'success',
        });
      } catch (error) {
        console.error("Error al editar usuario:", error);

        setAlertaEstado({
          titulo: error.message.includes("ya existe") ? error.message : 'Error al editar usuario',
          icono: 'error',
          texto: 'El usuario o correo ya existe, por favor verifica los datos ingresados.',
          timer: 3000
        });
      }
    } else {
      if (!user.id_rol) {
        alert("Por favor, selecciona un rol."); 
        return;
      }
      try {
        setLoadingCrear(true);

        const res = await fetch('http://localhost:5000/users', {
          method: 'POST',
          body: JSON.stringify(user),
          headers: {"Content-Type": "application/json"}
        });
 
        if(!res.ok){
          const errorData = await res.json(); 
          throw new Error(errorData.message || 'Error del servidor');
        }
        const data = await res.json();
        console.log("Respuesta del servidor: ", data);

        setAlertaEstado({
          titulo: 'Usuario creado correctamente',
          icono: 'success',
        });

        setUser({
          nombreUser: '', apellidoUser: '', correo: '', usuario: '', pass: '', id_rol: '',
        }); 
        
      } catch (error) {
        console.error("Error al crear usuario:", error);
        setAlertaEstado({
          titulo: error.message.includes("ya existe") ? error.message : 'Error al crear usuario',
          icono: 'error',
          texto: 'El usuario o correo ya existe, por favor verifica los datos ingresados.',
          timer: 3000
        });
      } finally {
        setLoadingCrear(false);
      }
    }
    if (onExternalSubmit) {
      onExternalSubmit();
    } else {
      navigate('/ListarUsuarios');
    }
  }
  
  const handleChange = (e) => 
    setUser({...user, [e.target.name]: e.target.value}); //Actualiza el valor que vamos a enviar del TextField
  
  const loadOneUser = async (id) => {
    const res = await fetch(`http://localhost:5000/users/${id}`)
    const data = await res.json()
    
    setUser({
      nombreUser: data.nombreuser ?? '',
      apellidoUser: data.apellidouser ?? '',
      correo: data.correo ?? '', 
      usuario: data.usuario ?? '', 
      pass: data.pass ?? '', 
      id_rol: data.id_rol ?? null
    });

    setEditing(true);
  }

  useEffect(() => {
    if (userId) {
      loadOneUser(userId);
      setEditing(true);
    } else {
      setUser(initialUserState);
      setEditing(false);
    }
  }, [userId]);

  return (
    <Box
      id="user-form"
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
        label="Nombre del usuario"
        name="nombreUser"
        value={user.nombreUser}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Apellido del usuario"
        name="apellidoUser"
        value={user.apellidoUser}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Correo institucional"
        type="email"
        name="correo"
        value={user.correo}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Username"
        name="usuario"
        autoComplete="new-username"
        value={user.usuario}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Password"
        type="password"
        autoComplete="new-password"
        name="pass"
        value={user.pass}
        onChange={handleChange}
      />

      <Roles
        roles={roles}
        setRoles={setRoles}
        selectedRoleId={user.id_rol}
        onSelect={handleRoleSelect}
      />
  
      {!hideInternalSubmitButton && (
        <Button
          variant="contained"
          color="info"
          type="submit"
          disabled={
            !user.nombreUser ||
            !user.apellidoUser ||
            !user.correo ||
            !user.usuario ||
            !user.pass ||
            !user.id_rol
          }
        >
          {loadingCrear ? (
            <CircularProgress color="inherit" size={24} />
          ) : params.id ? 'EDITAR USUARIO' : 'CREAR USUARIO'}
        </Button>
      )}
    </Box>
  );
  
}