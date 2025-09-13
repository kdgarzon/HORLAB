import { useEffect, useState } from 'react';
import { Box, Button, Typography, Modal, RadioGroup, FormControlLabel, Radio, Accordion, AccordionSummary, AccordionDetails, } from '@mui/material';
import CsvUploader from './CsvUploader';
import {ImageButton, ImageSrc, ImageBackdrop, Image, ImageMarked,} from '../Complementos/styleImagesButton';
import {style} from '../Complementos/stylesFiles';
import { mostrarAlertaConfirmacion } from '../Alertas/Alert_Delete';
import { alertaSuccessorError } from '../Alertas/Alert_Success';
import { WithOptionalTooltip } from './DeshabilitarHorario';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function HorariosList() {
  const [hasData, setHasData] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pisosModalOpen, setPisosModalOpen] = useState(false);
  const [pisos, setPisos] = useState([]);
  const [selectedPiso, setSelectedPiso] = useState(null);
  const [selectedEdificio, setSelectedEdificio] = useState(null);
  const [images, setImages] = useState([]); // ahora se carga desde BD
  const [selectedDia, setSelectedDia] = useState(null);
  const [dias, setDias] = useState([]);
  const [expanded, setExpanded] = useState(false); // controlar acordeones

  const resetSelections = () => {
    setSelectedPiso(null);
    setSelectedDia(null);
    setSelectedEdificio(null);
    setPisos([]);
  };

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

  useEffect(() => {
    const fetchEdificios = async () => {
      try {
        const res = await fetch('http://localhost:5000/buildings');
        const data = await res.json();

        const mapped = data.map((ed) => ({
          id: ed.id_edificio,
          url: `/${ed.edificio.replace(/\s+/g, '').replace(/,/g, '').replace(/-/g, '')}.jpg`,
          title: ed.edificio,
          width: '30%',
        }));

        setImages(mapped);
      } catch (error) {
        console.error('Error al cargar edificios:', error);
      }
    };

    fetchEdificios();
  }, []);

  useEffect(() => {
    const fetchDias = async () => {
      try {
        const res = await fetch('http://localhost:5000/days');
        const data = await res.json();
        setDias(data);
      } catch (error) {
        console.error('Error al cargar días:', error);
      }
    };

    fetchDias();
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

  const handleConsultarPisos = async (edificioId, edificioTitle) => {
    setSelectedEdificio({ id: edificioId, title: edificioTitle });
    try {
      const res = await fetch(`http://localhost:5000/buildings/${edificioId}/floors`);
      const data = await res.json();
      console.log(data);

      if (data.pisos?.length > 0) {
        setPisos(data.pisos);
      } else {
        setPisos([]);
        alertaSuccessorError({
          titulo: 'No hay pisos asociados',
          icono: 'warning',
        });
      }
      setPisosModalOpen(true);
    } catch (error) {
      console.error(error);
      alertaSuccessorError({
        titulo: 'Error consultando pisos',
        icono: 'error',
      });
    }
  };

  const handleConsultarHorario = () => {
    if (selectedPiso && selectedEdificio) {
      window.location.href = `/consultar-horario?edificioId=${selectedEdificio.id}&edificio=${encodeURIComponent(selectedEdificio.title)}&piso=${encodeURIComponent(selectedPiso)}`;
    }
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
              onClick={() => handleConsultarPisos(image.id, image.title)} //PEDNIENTE DE REVISAR QUE LA IMAGEN TENGA EL NOMBRE DEL EDIFICIO
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

      {/* MODAL DE PISOS */}
      <Modal
        open={pisosModalOpen}
        onClose={() => {setPisosModalOpen(false); resetSelections(); setExpanded(false);}}
        aria-labelledby="pisos-modal-title"
      >
        <Box sx={{...style, width: 700 }}>
          <Typography id="pisos-modal-title" variant="h6" mb={2}>
            Información disponible en {selectedEdificio?.title || ''}
          </Typography>
  
          <Accordion expanded={expanded === 'pisos'} onChange={() => setExpanded(expanded === 'pisos' ? false : 'pisos')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="pisos-content"
              id="pisos-header"
            >
              <Typography component="span">Pisos disponibles</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {pisos.length > 0 ? (
                <RadioGroup
                  value={selectedPiso || ''}
                  onChange={(e) => {setSelectedPiso(e.target.value); setExpanded(false);}}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr", // tres columnas
                    gap: 1, // espacio entre columnas/filas
                  }}
                >
                  {pisos.map((piso, idx) => (
                    <FormControlLabel
                      key={idx}
                      value={piso}
                      control={<Radio />}
                      label={piso}
                    />
                  ))}
                </RadioGroup>
              ) : (
                <Typography>No hay pisos asociados</Typography>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'dias'} onChange={() => setExpanded(expanded === 'dias' ? false : 'dias')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="dias-content"
              id="dias-header"
            >
              <Typography component="span">Días disponibles</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <RadioGroup
                value={selectedDia || ''}
                onChange={(e) => {setSelectedDia(e.target.value); setExpanded(false);}}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr", // dos columnas
                  gap: 1,
                }}
              >
                {dias.map((dia) => (
                    <FormControlLabel
                      key={dia.id_dia}
                      value={dia.dia}
                      control={<Radio />}
                      label={dia.dia}
                    />
                  )
                )}
              </RadioGroup>
            </AccordionDetails>
          </Accordion>

          {/* Texto dinámico */}
          {selectedEdificio && selectedPiso && selectedDia && (
            <Typography mt={2}>
              Se va a consultar el horario del edificio{" "}
              <b>{selectedEdificio.title}</b>, {selectedPiso} del día{" "}
              <b>{selectedDia}</b>.
            </Typography>
          )}

          <Button
            variant="contained"
            disabled={!selectedPiso || !selectedDia}
            onClick={handleConsultarHorario}
            sx={{ mt: 2 }}
          >
            CONSULTAR HORARIO
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              resetSelections();
              setPisosModalOpen(false);
            }}
          >
            CANCELAR
          </Button>
        </Box>
      </Modal>
    </>
  );
}
