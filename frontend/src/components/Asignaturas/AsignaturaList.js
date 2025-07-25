import {useEffect, useState} from 'react'
import { Paper, Table, TableBody, TablePagination, TableCell, TableContainer, TableHead, 
  TableRow, Button, Box, TextField, Modal} from "@mui/material";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import {useNavigate, useLocation} from 'react-router-dom'
import AddReactionIcon from '@mui/icons-material/AddReaction';
import GroupsIcon from '@mui/icons-material/Groups';
import AsignaturaForm from './AsignaturaForm';
import { mostrarAlertaConfirmacion } from '../Alertas/Alert_Delete';
import { style } from "../Complementos/stylesFiles";
import { columnsSubjects } from "../Complementos/modalDistribution";

export default function UserList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [asignaturas, setAsignaturas] = useState([]);
  const [search, setSearch] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const asigId = location.pathname.match(/^\/ListarAsignaturas\/Asignaturas\/(\d+)$/)?.[1] || null;
  const modalOpen = location.pathname === '/ListarAsignaturas/Asignaturas' || location.pathname.match(/^\/ListarAsignaturas\/Asignaturas\/\d+$/);

  const handleCloseModal = () => {
    navigate('/ListarAsignaturas');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const loadAsignaturas = async () => {
    const response = await fetch('http://localhost:5000/subjects')
    const data = await response.json()
    //console.log("Respuesta del backend:", data);
    setAsignaturas(data)
  }

  const handleDelete = async (id) => {
    mostrarAlertaConfirmacion({
      titulo: "¿Eliminar asignatura?",
      texto: "Esta acción eliminará permanentemente la asignatura.",
      textoExito: "Asignatura eliminada correctamente",
      callbackConfirmacion: async () => {
        try {
          await fetch(`http://localhost:5000/subjects/${id}`, {
            method: "DELETE",
          })
          setAsignaturas(asignaturas.filter(asig => asig.id_asignatura !== id));
        } catch (error) {
          console.log(error)
        }
      },
      callbackCancelacion: () => {
        console.log("Operación cancelada");
      }
    });
  }

  const handleVerGrupos = async (id) => {
    navigate(`/ListarAsignaturas/Asignaturas/${id}/ListarGrupos`);
  }

  useEffect(() => {
    loadAsignaturas()
  }, [])

  const filteredAsignaturas = asignaturas.filter((asignatura) =>
    Object.values(asignatura).some(
      (val) => typeof val === "string" && val.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, ml: 5, mr: 5 }}>
        <h1>LISTA DE ASIGNATURAS</h1>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/ListarAsignaturas/Asignaturas')}
        >
          <AddReactionIcon />
        </Button>
      </Box>

      <Box sx={{ mb: 5, ml: 5, mr: 5 }}>
        <TextField 
          fullWidth 
          label="Filtrar asignaturas..." 
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
                {columnsSubjects.map((column) => (
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
              {filteredAsignaturas
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((asignatura) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={asignatura.id_asignatura}>
                      {columnsSubjects.map((column) => {
                        const value = asignatura[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                      <TableCell align="center">
                        <Button 
                          variant='contained'
                          onClick={() => navigate(`/ListarAsignaturas/Asignaturas/${asignatura.id_asignatura}`)}
                          sx={{ backgroundColor: '#ffd94d', color: 'white', '&:hover': { backgroundColor: '#ffca1a' } }}
                        >
                          <EditSquareIcon />
                        </Button>
                        <Button 
                          variant='contained' 
                          onClick={() => handleDelete(asignatura.id_asignatura)}
                          style={{marginLeft: ".5rem"}}
                          sx={{ backgroundColor: '#ff6b6b', color: 'white', '&:hover': { backgroundColor: '#ff3d2a' } }}
                        >
                          <DeleteRoundedIcon />
                        </Button>
                        <Button
                          variant='contained'
                          onClick={() => handleVerGrupos(asignatura.id_asignatura)}
                          style={{marginLeft: ".5rem"}}
                          sx={{ backgroundColor: '#ffbd59', color: 'white', '&:hover': { backgroundColor: '#f6a23f' } }}
                        >
                          <GroupsIcon />
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
          count={asignaturas.length}
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
          <h2 id="modal-title"> {location.pathname.includes('/Asignaturas/') ? 'EDITAR ASIGNATURA' : 'CREAR ASIGNATURA'}</h2>
          <AsignaturaForm
            key={asigId || 'new'}
            asigId={asigId}
            hideInternalSubmitButton
            onExternalSubmit={() => {
              loadAsignaturas();
              handleCloseModal();
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" onClick={handleCloseModal} sx={{ mr: 1 }}>Cerrar</Button>
            <Button
              type="submit"
              form="asignatura-form"
              onClick={() => {
                // Triggerea el submit manualmente si lo necesitas
                const form = document.querySelector('form');
                if (form) form.requestSubmit();
              }}
              variant="contained"
              color="info"
            >
              {location.pathname.includes('/Asignaturas/') ? 'EDITAR ASIGNATURAS' : 'CREAR ASIGNATURAS'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}