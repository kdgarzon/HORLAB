import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, CircularProgress, Collapse, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useState, useEffect } from 'react';
import { FixedSizeList } from 'react-window';
import { alertaSuccessorError } from "../../Alertas/Alert_Success";
import { fusionarHorasConsecutivas } from "../../Docentes/Disponibilidad";

export default function Horas({ horas, setHoras, selectedHoraId, onSelect  }) {
    const [open, setOpen] = useState(false); //Que la lista de horas aparezca desplegada
    
    // Estado para indicar si se están cargando las horas
    const [loadingHoras, setLoadingHoras] = useState(false);
    const [horasFusionadas, setHorasFusionadas] = useState([]);

    // --- FETCHING DE HORAS ---
    useEffect(() => {
        const fetchHoras = async () => {
            setLoadingHoras(true); // Inicia la carga
            try {
                const response = await fetch('http://localhost:5000/hours'); // Endpoint para obtener horas
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // Asume que la data es un array de objetos: [{ id_hora: 1, hora: '8AM - 9AM' }, ...]
                setHoras(data);
                const fusionadas = fusionarHorasConsecutivas(data);
                setHorasFusionadas(fusionadas);
            } catch (error) {
                console.error("Error al obtener horas:", error);
                alertaSuccessorError({
                    titulo: 'Error al cargar las horas',
                    icono: 'error',
                });
            } finally {
                setLoadingHoras(false); // Termina la carga
            }
        };
        fetchHoras();
    }, [setHoras]); // El array vacío asegura que se ejecute solo una vez al montar el componente

    /*const selectedFusion = horasFusionadas.find(f => {
        if (!Array.isArray(selectedHoraId)) return false;
        return f.ids.every(id => selectedHoraId.includes(id));
    });*/
    const horaSeleccionada = Array.isArray(selectedHoraId) ? selectedHoraId : [];
    const selectedFusion = horasFusionadas.find(f => {
        return f.ids.every(id => horaSeleccionada.includes(id));
    });
    const displayHourName = selectedFusion ? selectedFusion.nombre : "Seleccionar Hora";

    const renderRow = ({ index, style }) => {
        const hora = horasFusionadas[index];
        return (
        <ListItem style={style} key={hora.id_fusion} component="div" disablePadding>
            <ListItemButton
            selected={horaSeleccionada?.join("-") === hora.ids.join("-")}
            onClick={() => {
                onSelect(hora.ids); // Llama a la función onSelect con los IDs de las horas seleccionadas
                setOpen(false);
            }}
            >
            <ListItemText primary={hora.nombre} />
            </ListItemButton>
        </ListItem>
        );
    };

    return (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
            <ListItemButton onClick={() => setOpen(!open)}>
            <ListItemText primary={displayHourName} />
            {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {loadingHoras ? (
                    <Box sx={{ pl: 4, py: 1 }}>
                        <CircularProgress size={20} />
                    </Box>
                    ) : horasFusionadas.length === 0 ? (
                    <ListItemText
                        sx={{ pl: 4, fontStyle: 'italic' }}
                        primary="No hay horas disponibles"
                    />
                    ) : (
                    <Box sx={{ height: 138, width: '100%' }}>
                        <FixedSizeList
                        height={138} // 46 * 4 = muestra 4 ítems
                        width="100%"
                        itemSize={46}
                        itemCount={horasFusionadas.length}
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