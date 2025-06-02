import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, CircularProgress, Collapse, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useState, useEffect } from 'react';
import { FixedSizeList } from 'react-window';

export default function Asignaturas({ asignaturas, setAsignaturas, selectedAsignaturaId, onSelect  }) {
    const [open, setOpen] = useState(false); //Que la lista de asignaturas aparezca desplegada
    
    // Estado para indicar si se están cargando las asignaturas
    const [loadingAsignaturas, setLoadingAsignaturas] = useState(false);

    // --- FETCHING DE ASIGNATURAS ---
    useEffect(() => {
        const fetchAsignaturas = async () => {
            setLoadingAsignaturas(true); // Inicia la carga
            try {
                const response = await fetch('http://localhost:5000/subjects'); // Endpoint para obtener asignaturas
                if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // Asume que la data es un array de objetos: [{ id_asignatura: 1, asignatura: 'CALCULO' }, ...]
                setAsignaturas(data);
            } catch (error) {
                console.error("Error al obtener asignaturas:", error);
            } finally {
                setLoadingAsignaturas(false); // Termina la carga
            }
        };
        fetchAsignaturas();
    }, [setAsignaturas]); // El array vacío asegura que se ejecute solo una vez al montar el componente

    const selectedAsignatura = asignaturas.find(a => a.id_asignatura === selectedAsignaturaId);
    const displayAsignaturaName = selectedAsignatura ? selectedAsignatura.nombre : "Seleccionar Asignatura";

    const renderRow = ({ index, style }) => {
        const asignatura = asignaturas[index];
        return (
        <ListItem style={style} key={asignatura.id_asignatura} component="div" disablePadding>
            <ListItemButton
            selected={selectedAsignaturaId === asignatura.id_asignatura}
            onClick={() => {
                onSelect(asignatura.id_asignatura);
                setOpen(false);
            }}
            >
            <ListItemText primary={asignatura.nombre} />
            </ListItemButton>
        </ListItem>
        );
    };

    return (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
            <ListItemButton onClick={() => setOpen(!open)}>
            <ListItemText primary={displayAsignaturaName} />
            {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {loadingAsignaturas ? (
                    <Box sx={{ pl: 4, py: 1 }}>
                        <CircularProgress size={20} />
                    </Box>
                    ) : asignaturas.length === 0 ? (
                    <ListItemText
                        sx={{ pl: 4, fontStyle: 'italic' }}
                        primary="No hay asignaturas disponibles"
                    />
                    ) : (
                    <Box sx={{ height: 138, width: '100%' }}>
                        <FixedSizeList
                        height={138} // 46 * 4 = muestra 4 ítems
                        width="100%"
                        itemSize={46}
                        itemCount={asignaturas.length}
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