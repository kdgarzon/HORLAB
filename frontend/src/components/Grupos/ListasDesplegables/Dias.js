import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { CircularProgress, Collapse, List, ListItemButton, ListItemText, ListItem, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { FixedSizeList } from 'react-window';

export default function Dias({ dias, setDias, selectedDiaId, onSelect  }) {
    const [open, setOpen] = useState(false); //Que la lista de dias aparezca desplegada
    
    // Estado para indicar si se están cargando los roles
    const [loadingDias, setLoadingDias] = useState(false);

    // --- FETCHING DE DIAS ---
    useEffect(() => {
        const fetchDias = async () => {
            setLoadingDias(true); // Inicia la carga
            try {
                const response = await fetch('http://localhost:5000/days'); // Endpoint para obtener dias
                if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // Asume que la data es un array de objetos: [{ id_dia: 1, dia: 'Lunes' }, ...]
                setDias(data);
            } catch (error) {
                console.error("Error al obtener dias:", error);
            } finally {
                setLoadingDias(false); // Termina la carga
            }
        };
        fetchDias();
    }, [setDias]); // El array vacío asegura que se ejecute solo una vez al montar el componente

    const selectedDia = dias.find(d => d.id_dia === selectedDiaId);
    const displayDayName = selectedDia ? selectedDia.dia : "Seleccionar Dia";

    const renderRow = ({ index, style }) => {
        const dia = dias[index];
        return (
        <ListItem style={style} key={dia.id_dia} component="div" disablePadding>
            <ListItemButton
            selected={selectedDiaId === dia.id_dia}
            onClick={() => {
                onSelect(dia.id_dia);
                setOpen(false);
            }}
            >
            <ListItemText primary={dia.dia} />
            </ListItemButton>
        </ListItem>
        );
    };

    return (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
            <ListItemButton onClick={() => setOpen(!open)}>
            <ListItemText primary={displayDayName} />
            {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {loadingDias ? (
                    <Box sx={{ pl: 4, py: 1 }}>
                        <CircularProgress size={20} />
                    </Box>
                    ) : dias.length === 0 ? (
                    <ListItemText
                        sx={{ pl: 4, fontStyle: 'italic' }}
                        primary="No hay dias disponibles"
                    />
                    ) : (
                    <Box sx={{ height: 138, width: '100%' }}>
                        <FixedSizeList
                        height={138} // 46 * 4 = muestra 4 ítems
                        width="100%"
                        itemSize={46}
                        itemCount={dias.length}
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