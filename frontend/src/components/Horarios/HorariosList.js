import { useEffect, useState } from 'react';
import { Box, Button, ButtonBase, Typography, Modal, } from '@mui/material';
import CsvUploader from './CsvUploader';
import { styled } from '@mui/material/styles';
import { images } from '../Complementos/ArrayImagenes/HorariopictureList';
import {style} from '../Complementos/stylesFiles';
import { mostrarAlertaConfirmacion } from '../Alertas/Alert_Delete';
import { alertaSuccessorError } from '../Alertas/Alert_Success';

// Estilos para los botones con imagen
const ImageButton = styled(ButtonBase)(({ theme, disabled }) => ({
  position: 'relative',
  height: 200,
  width: '30%',
  margin: 8,
  opacity: disabled ? 0.4 : 1,
  pointerEvents: disabled ? 'none' : 'auto',
  [theme.breakpoints.down('sm')]: {
    width: '100% !important',
    height: 100,
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.15,
    },
    '& .MuiImageMarked-root': {
      opacity: 0,
    },
    '& .MuiTypography-root': {
      border: '4px solid currentColor',
    },
  },
}));

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
});

const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: 'absolute',
  bottom: -2,
  left: 'calc(50% - 9px)',
  transition: theme.transitions.create('opacity'),
}));

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
          <ImageButton
            key={image.title}
            focusRipple
            disabled={!hasData}
            style={{ width: image.width }}
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
