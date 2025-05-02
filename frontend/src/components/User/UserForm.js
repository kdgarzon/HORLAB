import { Box, Button, CircularProgress, Collapse, List, 
  ListItemButton, ListItemText, TextField } from "@mui/material"
import { useState, useEffect } from "react";
import * as React from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {useNavigate, useParams} from 'react-router-dom'

const initialUserState = {
  nombreUser: '',
  apellidoUser: '',
  correo: '',
  usuario: '',
  pass: '',
  id_rol: null
};

export default function UserForm({ hideInternalSubmitButton = false, onExternalSubmit }) {

  const [open, setOpen] = React.useState(false); //Que la lista de roles aparezca desplegada
  const [roles, setRoles] = useState([]); // Array para almacenar los roles { id_rol, rol }
  const navigate = useNavigate();
  const params = useParams();
  const [loadingCrear, setLoadingCrear] = useState(false);
  const [editing, setEditing] = useState(false)
  
  const [user, setUser] = useState(initialUserState);

  // Estado para indicar si se están cargando los roles
  const [loadingRoles, setLoadingRoles] = useState(false);

  // --- FETCHING DE ROLES ---
  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true); // Inicia la carga
      try {
        const response = await fetch('http://localhost:5000/roles'); // Endpoint para obtener roles
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Asume que la data es un array de objetos: [{ id_rol: 1, rol: 'Administrador' }, ...]
        setRoles(data);
      } catch (error) {
        console.error("Error al obtener roles:", error);
      } finally {
        setLoadingRoles(false); // Termina la carga
      }
    };

    fetchRoles();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  // Manejador para cuando se selecciona un rol de la lista
  const handleRoleSelect = (roleId) => {
    setUser((prevUser) => ({
      ...prevUser,
      id_rol: roleId
    }));
    setOpen(false); // Cierra la lista después de seleccionar
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
    if (params.id) {
      loadOneUser(params.id)
    } else {
      setUser(initialUserState);
      setEditing(false);
    }
  }, [params.id]);
  

  const handleClick = () => {
    setOpen(!open);
  };

  const selectedRole = roles.find(r => r.id_rol === user.id_rol);
  const displayRoleName = selectedRole ? selectedRole.rol : "Seleccionar Rol";

  return (
    <Box
      id="user-form"
      component="form"
      onSubmit={handleSubmit}
      noValidate
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
        value={user.usuario}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Password"
        type="password"
        name="pass"
        value={user.pass}
        onChange={handleChange}
      />
  
      <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
        <ListItemButton onClick={handleClick}>
          <ListItemText primary={displayRoleName} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {loadingRoles ? (
              <ListItemText sx={{ pl: 4 }} primary={<CircularProgress size={20} />} />
            ) : roles.length === 0 ? (
              <ListItemText sx={{ pl: 4, fontStyle: 'italic' }} primary="No hay roles disponibles" />
            ) : (
              roles.map((rol) => (
                <ListItemButton
                  key={rol.id_rol}
                  sx={{ pl: 4 }}
                  onClick={() => handleRoleSelect(rol.id_rol)}
                  selected={user.id_rol === rol.id_rol}
                >
                  <ListItemText primary={rol.rol} />
                </ListItemButton>
              ))
            )}
          </List>
        </Collapse>
      </List>
  
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