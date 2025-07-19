import { useEffect, useState } from 'react';
import { Box, Button, ButtonBase, Typography, Modal, } from '@mui/material';
import CsvUploader from './CsvUploader';
import { styled } from '@mui/material/styles';
import { images } from '../Complementos/ArrayImagenes/HorariopictureList';
import axios from 'axios';



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

// Modal Style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #1976d2',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

export default function HorariosList() {
  const [hasData, setHasData] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Cargar si hay datos en matrizgeneral
  useEffect(() => {
    axios
      .get('http://localhost:5000/matrizgeneral/exists')
      .then((res) => setHasData(res.data.exists))
      .catch((err) => {
        console.error('Error al verificar datos:', err);
        setHasData(false);
      });
  }, []);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleDeleteData = () => {
    if (confirm('¿Estás seguro de que deseas eliminar todos los datos?')) {
      axios.delete('http://localhost:5000/matrizgeneral')
        .then(() => {
          alert('Datos eliminados correctamente');
          setHasData(false);
        })
        .catch(() => alert('Error al eliminar los datos'));
    }
  };

  return (
    <>
      {/* CABECERA */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 5 }}>
        <Typography variant="h4">GESTIÓN DE HORARIOS</Typography>
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
        <Box sx={modalStyle}>
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
