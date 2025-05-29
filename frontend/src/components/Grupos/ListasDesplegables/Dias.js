import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { CircularProgress, Collapse, List, ListItemButton, ListItemText } from '@mui/material';
import { useState, useEffect } from 'react';

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

    return (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
            <ListItemButton onClick={() => setOpen(!open)}>
            <ListItemText primary={displayDayName} />
            {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {loadingDias ? (
                <ListItemText sx={{ pl: 4 }} primary={<CircularProgress size={20} />} />
                ) : dias.length === 0 ? (
                <ListItemText sx={{ pl: 4, fontStyle: 'italic' }} primary="No hay dias disponibles" />
                ) : (
                dias.map((dia) => (
                    <ListItemButton
                    key={dia.id_dia}
                    sx={{ pl: 4 }}
                    onClick={() => {
                        onSelect(dia.id_dia);
                        setOpen(false);
                        }
                    }
                    selected={selectedDiaId === dia.id_dia}
                    >
                    <ListItemText primary={dia.dia} />
                    </ListItemButton>
                ))
                )}
            </List>
            </Collapse>
        </List>
    );
}