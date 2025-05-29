import * as React from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { CircularProgress, Collapse, List, ListItemButton, ListItemText } from '@mui/material';
import { useState, useEffect } from 'react';

export default function Roles({ roles, setRoles, selectedRoleId, onSelect  }) {
    const [open, setOpen] = React.useState(false); //Que la lista de roles aparezca desplegada
    
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
    }, [setRoles]); // El array vacío asegura que se ejecute solo una vez al montar el componente

    const selectedRole = roles.find(r => r.id_rol === selectedRoleId);
    const displayRoleName = selectedRole ? selectedRole.rol : "Seleccionar Rol";

    return (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
            <ListItemButton onClick={() => setOpen(!open)}>
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
                    onClick={() => {
                        onSelect(rol.id_rol);
                        setOpen(false);
                        }
                    }
                    selected={selectedRoleId === rol.id_rol}
                    >
                    <ListItemText primary={rol.rol} />
                    </ListItemButton>
                ))
                )}
            </List>
            </Collapse>
        </List>
    );
}