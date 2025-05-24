import {useEffect, useState} from 'react'
import { Paper, Table, TableBody, TablePagination, TableCell, TableContainer, TableHead, 
  TableRow, Button, Box, TextField, Modal, Alert, AlertTitle} from "@mui/material";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import {useNavigate, useLocation} from 'react-router-dom'
import AddReactionIcon from '@mui/icons-material/AddReaction';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DocenteForm from './DocenteForm';
import { mostrarAlertaConfirmacion } from '../Alertas/Alert_Delete';

//Estilo del modal que vamos a generar
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 4,
};

const columns = [
  { id: 'id_docente', label: 'ID Docente'},
  { id: 'nombre', label: 'Nombre del docente'}
];

function agruparDisponibilidadPorDia(disponibilidad) {
  const agrupado = {};

  disponibilidad.forEach(item => {
    const key = `${item.dia}|${item.salon}|${item.edificio}|${item.nombre_asignatura}`;
    if (!agrupado[key]) {
      agrupado[key] = [];
    }
    agrupado[key].push(item);
  });

  return agrupado;
}

function fusionarFranjasConsecutivas(agrupado) {
  const resultadoFusionado = [];

  Object.entries(agrupado).forEach(([key, items]) => {
    // Ordenar por hora
    const ordenado = items.sort((a, b) => convertirA24Horas(a.hora) - convertirA24Horas(b.hora));
    let actual = {
      ...ordenado[0], 
      hora_inicio: ordenado[0].hora,
      hora_fin: sumarUnaHora(ordenado[0].hora)
    };

    for (let i = 1; i < ordenado.length; i++) {
      const siguiente = ordenado[i];
      const horaFinActual = convertirA24Horas(actual.hora_fin);
      const horaInicioSiguiente = convertirA24Horas(siguiente.hora);

      if (horaInicioSiguiente === horaFinActual) {
        // Expandir franja
        actual.hora_fin = sumarUnaHora(siguiente.hora);
      } else {
        resultadoFusionado.push({...actual});
        actual = {
          ...siguiente, 
          hora_inicio: siguiente.hora,
          hora_fin: sumarUnaHora(siguiente.hora)
        };
      }
    }
    resultadoFusionado.push({...actual});
  });
  console.log("Fusionado:", resultadoFusionado);

  return resultadoFusionado;
}

function convertirA24Horas(horaStr) {
  if (!horaStr) return null;

  // Elimina espacios y símbolos extra (como en "12PM - 1PM")
  const limpio = horaStr.trim().split(/[^A-Za-z0-9]/)[0]; // solo toma la primera hora

  const match = limpio.match(/^(\d{1,2})(AM|PM)$/i);
  if (!match) return null;

  let [, hora, periodo ] = match;
  hora = parseInt(hora, 10);

  if (periodo.toUpperCase() === 'PM' && hora !== 12) {
    hora += 12;
  } else if (periodo.toUpperCase() === 'AM' && hora === 12) {
    hora = 0;
  }

  return hora; // En formato 24h
}

function convertirAAMPM(hora24) {
  const ampm = hora24 >= 12 ? 'PM' : 'AM';
  const hora12 = hora24 % 12 === 0 ? 12 : hora24 % 12;
  return `${hora12}${ampm}`;
}

function sumarUnaHora(horaStr) {
  const hora24 = convertirA24Horas(horaStr);
  if (hora24 === null || isNaN(hora24)) return ''; // evita errores
  const siguiente = (hora24 + 1) % 24;
  return convertirAAMPM(siguiente);
}

function extraerHoraInicial(horaInicioStr) {
  if (!horaInicioStr) return '';
  const match = horaInicioStr.trim().match(/^(\d{1,2}(AM|PM))/i);
  return match ? match[1] : horaInicioStr;
}

export default function DocenteList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [docentes, setDocentes] = useState([]);
  const [search, setSearch] = useState("");
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [disponibilidadModalOpen, setDisponibilidadModalOpen] = useState(false);
  const [sinDisponibilidad, setSinDisponibilidad] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const docenteId = location.pathname.match(/^\/ListarDocentes\/Docentes\/(\d+)$/)?.[1] || null;
  const modalOpen = location.pathname === '/ListarDocentes/Docentes' || location.pathname.match(/^\/ListarDocentes\/Docentes\/\d+$/);

  const handleCloseModal = () => {
    navigate('/ListarDocentes');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const loadDocentes = async () => {
    const response = await fetch('http://localhost:5000/teachers')
    const data = await response.json()
    //console.log("Respuesta del backend:", data);
    setDocentes(data)
  }

  const handleDelete = async (id) => {
    mostrarAlertaConfirmacion({
      titulo: "¿Eliminar docente?",
      texto: "Esta acción eliminará permanentemente el docente.",
      textoExito: "Docente eliminado correctamente",
      callbackConfirmacion: async () => {
        try {
          await fetch(`http://localhost:5000/teachers/${id}`, {
            method: "DELETE",
          })
          setDocentes(docentes.filter(docente => docente.id_docente !== id));
        } catch (error) {
          console.log(error)
        }
      },
      callbackCancelacion: () => {
        console.log("Operación cancelada");
      }
    });
  }

  const handleDisponibilidad = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/teachers/${id}/disponibilidad`, {
        method: "GET",
      })

      if (!res.ok) {
        // Si la respuesta no es 200, abrir modal vacío y terminar
        setDisponibilidad([]);
        setDisponibilidadModalOpen(true);
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        // Si por alguna razón no es un arreglo, también mostramos vacío
        setDisponibilidad([]);
      } else {
        // Aplicar lógica de fusión solo si hay datos
        const agrupado = agruparDisponibilidadPorDia(data);
        const fusionado = fusionarFranjasConsecutivas(agrupado);
        setDisponibilidad(fusionado);
        setSinDisponibilidad(fusionado.length === 0); // activa la alerta si no hay datos
      }
      setDisponibilidadModalOpen(true);
      
    } catch (error) {
      console.log(error)
      setDisponibilidad([]); // Mostrar alerta si hubo error de red
      setDisponibilidadModalOpen(true);
    }
  }

  useEffect(() => {
    loadDocentes()
  }, [])

  const filteredDocentes = docentes.filter((docente) =>
    Object.values(docente).some(
      (val) => typeof val === "string" && val.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, ml: 5, mr: 5 }}>
        <h1>DOCENTE LIST</h1>
        {localStorage.getItem('id_rol') === '1' && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/ListarDocentes/Docentes')}
          >
            <AddReactionIcon />
          </Button>
        )}
      </Box>
      <Box sx={{ mb: 5, ml: 5, mr: 5 }}>
        <TextField 
          fullWidth 
          label="Filtrar docentes..." 
          variant="outlined" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
      </Box>

      <Paper sx={{ width: '95.2%', overflow: 'hidden', ml: 5 }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell align="center">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDocentes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((docente) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={docente.id_docente}>
                      {columns.map((column) => {
                        const value = docente[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                      <TableCell align="center">
                        {localStorage.getItem('id_rol') === '1' && (
                          <>
                            <Button 
                              variant='contained'
                              onClick={() => navigate(`/ListarDocentes/Docentes/${docente.id_docente}`)}
                              sx={{ backgroundColor: '#fbc02d', color: 'white', '&:hover': { backgroundColor: '#fdd835' } }}
                            >
                              <EditSquareIcon />
                            </Button>
                            <Button 
                              variant='contained' 
                              color='warning' 
                              onClick={() => handleDelete(docente.id_docente)}
                              style={{marginLeft: ".5rem"}}
                            >
                              <DeleteRoundedIcon />
                            </Button>
                          </>
                        )}
                        <Button 
                          variant='contained' 
                          color='success' 
                          onClick={() => handleDisponibilidad(docente.id_docente)}
                          style={{marginLeft: ".5rem"}}
                        >
                          <CalendarMonthIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={docentes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* MODAL PADRE */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
      >
        <Box sx={style}>
          <h2 id="modal-title"> {location.pathname.includes('/Docentes/') ? 'EDITAR DOCENTE' : 'CREAR DOCENTE'}</h2>
          <DocenteForm
            key={docenteId || 'new'}
            docenteId={docenteId}
            hideInternalSubmitButton
            onExternalSubmit={() => {
              loadDocentes();
              handleCloseModal();
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" onClick={handleCloseModal} sx={{ mr: 1 }}>Cerrar</Button>
            <Button
              type="submit"
              form="docente-form"
              onClick={() => {
                const form = document.querySelector('form');
                if (form) form.requestSubmit();
              }}
              variant="contained"
              color="info"
            >
              {location.pathname.includes('/Docentes/') ? 'EDITAR DOCENTE' : 'CREAR DOCENTE'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* MODAL PARA DISPONIBILIDAD DE DOCENTES */}

      <Modal
        open={disponibilidadModalOpen}
        onClose={() => setDisponibilidadModalOpen(false)}
        aria-labelledby="disponibilidad-modal-title"
      >
        <Box sx={{ ...style, width: 900 }}>
          <h2 id="disponibilidad-modal-title">Disponibilidad del docente</h2>
          {disponibilidad.length > 0 ? (
            <Box sx={{ maxHeight: '50vh', overflowY: 'auto', mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Día</TableCell>
                    <TableCell>Hora</TableCell>
                    <TableCell>Salón</TableCell>
                    <TableCell>Edificio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {disponibilidad.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.dia}</TableCell>
                      <TableCell>{`${extraerHoraInicial(item.hora_inicio)} - ${item.hora_fin}`}</TableCell>
                      <TableCell>{item.salon}</TableCell>
                      <TableCell>{item.edificio}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ) : (
            <Alert severity="error" sx={{ mt: 2 }}>
              <AlertTitle>Error</AlertTitle>
              El docente no tiene carga académica asignada hasta el momento.
            </Alert>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" onClick={() => setDisponibilidadModalOpen(false)}>
              Cerrar
            </Button>
          </Box>
        </Box>
      </Modal>

    </>
  )
}