import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { CircularProgress, Collapse, List, ListItemButton, ListItemText } from '@mui/material';
import { useState, useEffect } from 'react';

export default function Proyectos({ proyectos, setProyectos, selectedProyectoId, onSelect  }) {
    const [open, setOpen] = useState(false); //Que la lista de proyectos aparezca desplegada
    
    // Estado para indicar si se están cargando los proyectos
    const [loadingProyectos, setLoadingProyectos] = useState(false);

    // --- FETCHING DE PROYECTOS ---
    useEffect(() => {
        const fetchProyectos = async () => {
            setLoadingProyectos(true); // Inicia la carga
            try {
                const response = await fetch('http://localhost:5000/projects'); // Endpoint para obtener proyectos
                if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // Asume que la data es un array de objetos: [{ id_proyecto: 1, proyecto: 'Sistematizacion' }, ...]
                setProyectos(data);
            } catch (error) {
                console.error("Error al obtener proyectos:", error);
            } finally {
                setLoadingProyectos(false); // Termina la carga
            }
        };
        fetchProyectos();
    }, [setProyectos]); // El array vacío asegura que se ejecute solo una vez al montar el componente

    const selectedProyecto = proyectos.find(p => p.id_proyecto === selectedProyectoId);
    const displayProyectoName = selectedProyecto ? selectedProyecto.proyecto : "Seleccionar Proyecto";

    return (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
            <ListItemButton onClick={() => setOpen(!open)}>
            <ListItemText primary={displayProyectoName} />
            {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {loadingProyectos ? (
                <ListItemText sx={{ pl: 4 }} primary={<CircularProgress size={20} />} />
                ) : proyectos.length === 0 ? (
                <ListItemText sx={{ pl: 4, fontStyle: 'italic' }} primary="No hay proyectos disponibles" />
                ) : (
                proyectos.map((proyecto) => (
                    <ListItemButton
                    key={proyecto.id_proyecto}
                    sx={{ pl: 4 }}
                    onClick={() => {
                        onSelect(proyecto.id_proyecto);
                        setOpen(false);
                        }
                    }
                    selected={selectedProyectoId === proyecto.id_proyecto}
                    >
                    <ListItemText primary={proyecto.proyecto} />
                    </ListItemButton>
                ))
                )}
            </List>
            </Collapse>
        </List>
    );
}