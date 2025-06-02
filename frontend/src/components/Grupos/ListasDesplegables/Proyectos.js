import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, CircularProgress, Collapse, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useState, useEffect } from 'react';
import { FixedSizeList } from 'react-window';

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

    const renderRow = ({ index, style }) => {
        const proyecto = proyectos[index];
        return (
        <ListItem style={style} key={proyecto.id_proyecto} component="div" disablePadding>
            <ListItemButton
            selected={selectedProyectoId === proyecto.id_proyecto}
            onClick={() => {
                onSelect(proyecto.id_proyecto);
                setOpen(false);
            }}
            >
            <ListItemText primary={proyecto.proyecto} />
            </ListItemButton>
        </ListItem>
        );
    };

    return (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
            <ListItemButton onClick={() => setOpen(!open)}>
            <ListItemText primary={displayProyectoName} />
            {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {loadingProyectos ? (
                    <Box sx={{ pl: 4, py: 1 }}>
                        <CircularProgress size={20} />
                    </Box>
                    ) : proyectos.length === 0 ? (
                    <ListItemText
                        sx={{ pl: 4, fontStyle: 'italic' }}
                        primary="No hay proyectos disponibles"
                    />
                    ) : (
                    <Box sx={{ height: 138, width: '100%' }}>
                        <FixedSizeList
                        height={138} // 46 * 4 = muestra 4 ítems
                        width="100%"
                        itemSize={46}
                        itemCount={proyectos.length}
                        overscanCount={2}
                        >
                        {renderRow}
                        </FixedSizeList>
                    </Box>
                )}
            </Collapse>
        </List>
    );
}