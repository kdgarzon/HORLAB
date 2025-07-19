import { Box, ButtonBase, Typography } from '@mui/material';
import CsvUploader from './CsvUploader'; // Asegúrate de la ruta correcta
import { styled } from '@mui/material/styles';

const images = [
  {
    url: '/static/images/buttons/breakfast.jpg',
    title: 'BLOQUE 1, 2, 3 y 4',
    width: '30%',
  },
  {
    url: '/static/images/buttons/burgers.jpg',
    title: 'BLOQUE 5',
    width: '30%',
  },
  {
    url: '/static/images/buttons/camera.jpg',
    title: 'BLOQUE 9',
    width: '30%',
  },
  {
    url: '/static/images/buttons/breakfast.jpg',
    title: 'BLOQUE 11 - 12',
    width: '30%',
  },
  {
    url: '/static/images/buttons/burgers.jpg',
    title: 'BLOQUE 13 - CAFETERIA',
    width: '30%',
  },
  {
    url: '/static/images/buttons/camera.jpg',
    title: 'TECHNE',
    width: '30%',
  },
];

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: 200,
  [theme.breakpoints.down('sm')]: {
    width: '100% !important', // Overrides inline-style
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
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, ml: 5, mr: 5 }}>
        <h1>GESTIÓN DE HORARIOS</h1>
        <Button 
          variant='contained'
          onClick={() => navigate(`/ListarHorarios/Asignaturas/${id}/ListarGrupos/Grupos/${group.id_grupo}`)}
          sx={{ backgroundColor: '#ffd94d', color: 'white', '&:hover': { backgroundColor: '#ffca1a' } }}
        >
          <EditSquareIcon />
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, ml: 5, mr: 5}}>
        <CsvUploader />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', minWidth: 300, width: '100%' }}>
          {images.map((image) => (
            <ImageButton
              focusRipple
              key={image.title}
              style={{
                width: image.width,
              }}
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
      </Box>

      {/* MODAL PADRE */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModalCallback}
        aria-labelledby="modal-title"
      >
        <Box sx={style}>
          <h2 id="modal-title">{'SUBIR ARCHIVO DE HORARIOS (CSV)'}</h2>
          <GruposForm
            key={groupId || 'new'}
            groupId={groupId}
            hideInternalSubmitButton
            onExternalSubmit={() => {
              loadGroupsCallback();
              handleCloseModal(navigate, id);
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" onClick={() => handleCloseModal(navigate, id)} sx={{ mr: 1 }}>Cerrar</Button>
            <Button
              type="submit"
              form="group-form"
              onClick={() => {
                // Triggerea el submit manualmente si lo necesitas
                const form = document.querySelector('form');
                if (form) form.requestSubmit();
              }}
              variant="contained"
              color="info"
            >
              {groupId ? 'EDITAR GRUPO' : 'CREAR GRUPO'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}