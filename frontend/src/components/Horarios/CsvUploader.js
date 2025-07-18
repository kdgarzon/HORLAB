import { useState, useEffect } from 'react';
import {
  Button, Box, Snackbar, Paper, Typography
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { alertaSuccessorError } from "../Alertas/Alert_Success";
import Alert from '@mui/material/Alert';

const CsvUploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [alertaEstado, setAlertaEstado] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false); 

    useEffect(() => {
        if (alertaEstado) {
            alertaSuccessorError(alertaEstado);
            setSnackbarOpen(true);
        }
    }, [alertaEstado]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        setAlertaEstado(null); // Resetea el estado de alerta
        if (!selectedFile) {
            setAlertaEstado({
                titulo: 'Por favor, selecciona un archivo CSV',
                icono: 'warning',
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('csv', selectedFile);

            const res = await fetch('http://localhost:5000/upload-horarios', {
                method: 'POST',
                body: formData,
            });
            
            if(!res.ok){
                const errorData = await res.json(); 
                throw new Error(errorData.message || 'Error del servidor');
            }
            const data = await res.json();
            console.log("Respuesta del servidor: ", data);
            setAlertaEstado({
                titulo: '¡Archivo cargado exitosamente!',
                icono: 'success',
            });

            setSelectedFile(null);
        } catch (error) {
            console.error(error);
            setAlertaEstado({
                titulo: 'Error al subir el archivo. Revisa el formato.',
                icono: 'error',
            });
        }
    };
    const handleCloseAlert = () => {
        setSnackbarOpen(false);
    };

    return (
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600, mx: 'auto', mt: 5 }}>
        <Typography variant="h6" gutterBottom>
            Subir archivo de horarios (CSV)
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
            <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
            Seleccionar Archivo
            <input
                type="file"
                accept=".csv"
                hidden
                onChange={handleFileChange}
            />
            </Button>
            <Typography variant="body2">
            {selectedFile ? selectedFile.name : 'Ningún archivo seleccionado'}
            </Typography>
        </Box>
        <Box mt={2}>
            <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!selectedFile}
            >
            Subir Archivo
            </Button>
        </Box>

        <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={handleCloseAlert}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            {alertaEstado && (
                <Alert onClose={handleCloseAlert} severity={alertaEstado.icono} sx={{ width: '100%' }}>
                    {alertaEstado.titulo}
                </Alert>
            )}
        </Snackbar>
        </Paper>
    );
};

export default CsvUploader;