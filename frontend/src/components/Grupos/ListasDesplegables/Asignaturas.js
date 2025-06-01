import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { CircularProgress, Collapse, List, ListItemButton, ListItemText } from '@mui/material';
import { useState, useEffect } from 'react';

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

    return (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
            <ListItemButton onClick={() => setOpen(!open)}>
            <ListItemText primary={displayAsignaturaName} />
            {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {loadingAsignaturas ? (
                <ListItemText sx={{ pl: 4 }} primary={<CircularProgress size={20} />} />
                ) : asignaturas.length === 0 ? (
                <ListItemText sx={{ pl: 4, fontStyle: 'italic' }} primary="No hay asignaturas disponibles" />
                ) : (
                asignaturas.map((asignatura) => (
                    <ListItemButton
                    key={asignatura.id_asignatura}
                    sx={{ pl: 4 }}
                    onClick={() => {
                        onSelect(asignatura.id_asignatura);
                        setOpen(false);
                        }
                    }
                    selected={selectedAsignaturaId === asignatura.id_asignatura}
                    >
                    <ListItemText primary={asignatura.nombre} />
                    </ListItemButton>
                ))
                )}
            </List>
            </Collapse>
        </List>
    );
}