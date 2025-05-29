import { Box, Button, CircularProgress, TextField } from "@mui/material"
import { useState, useEffect } from "react";
import {useNavigate, useParams} from 'react-router-dom'
import Roles from "./Roles";

const initialUserState = {
  nombreUser: '',
  apellidoUser: '',
  correo: '',
  usuario: '',
  pass: '',
  id_rol: null
};

export default function UserForm({ userId, hideInternalSubmitButton = false, onExternalSubmit }) {
  const [roles, setRoles] = useState([]); // Array para almacenar los roles { id_rol, rol }
  const navigate = useNavigate();
  const params = useParams();
  const [loadingCrear, setLoadingCrear] = useState(false);
  const [editing, setEditing] = useState(false)
  
  const [user, setUser] = useState(initialUserState);

  // Manejador para cuando se selecciona un rol de la lista
  const handleRoleSelect = (roleId) => {
    setUser((prevUser) => ({
      ...prevUser,
      id_rol: roleId
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault(); //Cancela el refresh del boton del formulario
    setLoadingCrear(true);

    if (
      !user.nombreUser ||
      !user.apellidoUser ||
      !user.correo ||
      !user.usuario ||
      !user.pass ||
      !user.id_rol
    ) {
      alert("Por favor, completa todos los campos antes de continuar.");
      setLoadingCrear(false);
      return;
    }

    if (editing) {
      const res = await fetch(`http://localhost:5000/users/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {"Content-Type": "application/json"}
      });
      
      const data = await res.json()
      console.log("Respuesta del servidor: ", data);

    } else {
      if (!user.id_rol) {
        alert("Por favor, selecciona un rol."); 
        return;
      }
  
      try {
        const res = await fetch('http://localhost:5000/users', {
          method: 'POST',
          body: JSON.stringify(user),
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
        console.error("Error al crear usuario:", error);
        // Muestra un mensaje de error al usuario
        alert(`Error al crear usuario: ${error.message}`);
      }
    }
    setLoadingCrear(false);
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