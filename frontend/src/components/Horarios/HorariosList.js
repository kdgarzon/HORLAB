import { useEffect, useState } from 'react';
import { Box, Button, Typography, Modal, } from '@mui/material';
import CsvUploader from './CsvUploader';
import {ImageButton, ImageSrc, ImageBackdrop, Image, ImageMarked,} from '../Complementos/styleImagesButton';
import { images } from '../Complementos/ArrayImagenes/HorariopictureList';
import {style} from '../Complementos/stylesFiles';
import { mostrarAlertaConfirmacion } from '../Alertas/Alert_Delete';
import { alertaSuccessorError } from '../Alertas/Alert_Success';
import { WithOptionalTooltip } from './DeshabilitarHorario';

export default function HorariosList() {
  const [hasData, setHasData] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Cargar si hay datos en matrizgeneral
  useEffect(() => {
    const checkData = async () => {
      try {
        const res = await fetch('http://localhost:5000/matrizgeneral/exists');
        const data = await res.json();
        setHasData(data.exists);
      } catch (error) {
        console.error('Error al verificar datos:', error);
        setHasData(false);
      }
    };
    checkData();
  }, []);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleDeleteData = async () => {
    mostrarAlertaConfirmacion({
      titulo: "¿Eliminar todos los datos?",
      texto: "Esta acción eliminará todos los datos de horarios y no se podrá deshacer.",
      textoExito: "Todos los datos han sido eliminados correctamente.",
      callbackConfirmacion: async () => {
        try {
          const res = await fetch('http://localhost:5000/matrizgeneral', {
            method: 'DELETE',
          });

          if (!res.ok) throw new Error('Error al eliminar los datos');

          alertaSuccessorError({
            titulo: 'Horarios eliminados correctamente',
            icono: 'success',
          });
          setHasData(false);
        } catch (err) {
          alertaSuccessorError({
            titulo: 'Error al eliminar los horarios',
            icono: 'error',
          });
          console.error(err);
        }
      },
      callbackCancelacion: () => {
        console.log("Operación cancelada");
      }
    });
  };

  return (
    <>
      {/* CABECERA */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, ml: 5, mr: 5 }}>
        <h1>GESTIÓN DE HORARIOS</h1>
        <Box>
          <Button variant="outlined" color="error" onClick={handleDeleteData} sx={{ mr: 1 }}>
            ELIMINAR DATOS
          </Button>
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            SUBIR ARCHIVO
          </Button>
        </Box>
      </Box>

      {/* BOTONES DE BLOQUES */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', px: 5 }}>
        {images.map((image) => (
          <WithOptionalTooltip
            key={image.title}
            disabled={!hasData}
            title="Debe subir un archivo CSV primero"
          >
            <ImageButton
              key={image.title}
              focusRipple
              disabled={!hasData}
              style={{ width: image.width }}
              onClick={() => { window.location.href = "/consultar-pisos"; }}
            >
              <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
              <ImageBackdrop className="MuiImageBackdrop-root" />
              <Image>
                <Typography
                  component="span"
                  variant="subtitle1"
                  color="inherit"
                  sx={(theme) => ({
                    position: 'relative',
                    p: 4,
                    pt: 2,
                    pb: `calc(${theme.spacing(1)} + 6px)`,
                  })}
                >
                  {image.title}
                  <ImageMarked className="MuiImageMarked-root" />
                </Typography>
              </Image>
            </ImageButton>
          </WithOptionalTooltip>
        ))}
      </Box>

      {/* MODAL DE SUBIDA */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" mb={2}>
            SUBIR ARCHIVO DE HORARIOS (CSV)
          </Typography>
          <CsvUploader onUploadSuccess={() => {
            setHasData(true);
            handleCloseModal();
          }} />
        </Box>
      </Modal>
    </>
  );
}
