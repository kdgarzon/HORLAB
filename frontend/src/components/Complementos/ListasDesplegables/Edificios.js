import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, CircularProgress, Collapse, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useState, useEffect } from 'react';
import { FixedSizeList } from 'react-window';
import { alertaSuccessorError } from "../../Alertas/Alert_Success";

export default function Edificios({ edificios, setEdificios, selectedEdificioId, onSelect  }) {
    const [open, setOpen] = useState(false); //Que la lista de edificios aparezca desplegada
    
    // Estado para indicar si se están cargando los edificios
    const [loadingEdificios, setLoadingEdificios] = useState(false);

    // --- FETCHING DE ASIGNATURAS ---
    useEffect(() => {
        const fetchEdificios = async () => {
            setLoadingEdificios(true); // Inicia la carga
            try {
                const response = await fetch('http://localhost:5000/buildings'); // Endpoint para obtener edificios
                if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setEdificios(data);
            } catch (error) {
                console.error("Error al obtener edificios:", error);
                alertaSuccessorError({
                    titulo: 'Error al cargar edificios',
                    icono: 'error',
                });
            } finally {
                setLoadingEdificios(false); // Termina la carga
            }
        };
        fetchEdificios();
    }, [setEdificios]); // El array vacío asegura que se ejecute solo una vez al montar el componente

    const selectedEdificio = edificios.find(e => e.id_edificio === selectedEdificioId);
    const displayEdificioName = selectedEdificio ? selectedEdificio.edificio : "Seleccionar Edificio";

    const renderRow = ({ index, style }) => {
        const edificio = edificios[index];
        return (
        <ListItem style={style} key={edificio.id_edificio} component="div" disablePadding>
            <ListItemButton
            selected={selectedEdificioId === edificio.id_edificio}
            onClick={() => {
                onSelect(edificio.id_edificio);
                setOpen(false);
            }}
            >
            <ListItemText primary={edificio.edificio} />
            </ListItemButton>
        </ListItem>
        );
    };

    return (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
            <ListItemButton onClick={() => setOpen(!open)}>
            <ListItemText primary={displayEdificioName} />
            {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {loadingEdificios ? (
                    <Box sx={{ pl: 4, py: 1 }}>
                        <CircularProgress size={20} />
                    </Box>
                    ) : edificios.length === 0 ? (
                    <ListItemText
                        sx={{ pl: 4, fontStyle: 'italic' }}
                        primary="No hay edificios disponibles"
                    />
                    ) : (
                    <Box sx={{ height: 138, width: '100%' }}>
                        <FixedSizeList
                        height={138} // 46 * 4 = muestra 4 ítems
                        width="100%"
                        itemSize={46}
                        itemCount={edificios.length}
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