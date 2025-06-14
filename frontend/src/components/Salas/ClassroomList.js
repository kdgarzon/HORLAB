/*
Los campos que se muestran en la lista de aulas son:
- Nombre del aula (SALON EN LA BASE DE DATOS)
- Capacidad del aula (CAPACIDAD EN LA BASE DE DATOS)
- Area del aula (AREA EN LA BASE DE DATOS)
- Edificio del aula (EDIFICIO EN LA BASE DE DATOS)
- Sede del aula (SEDE EN LA BASE DE DATOS)
Para dar una ubicación más precisa, debemos crear una nueva tabla con los salones en donde diga en que piso del 
edificio se encuentra el aula, y así poder mostrarlo en la lista de aulas.

*/

import {useEffect, useState} from 'react'
import { Paper, Table, TableBody, TablePagination, TableCell, TableContainer, TableHead, 
  TableRow, Button, Box, TextField, Modal} from "@mui/material";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import {useNavigate, useLocation} from 'react-router-dom'
import AddReactionIcon from '@mui/icons-material/AddReaction';
import { ClassroomForm } from "./ClassroomForm";
import { mostrarAlertaConfirmacion } from '../Alertas/Alert_Delete';
import { style } from "../Complementos/stylesFiles";
import { columnsClassrooms } from "../Complementos/modalDistribution";

export default function UserList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [classrooms, setClassrooms] = useState([]);
  const [search, setSearch] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const classId = location.pathname.match(/^\/ListarSalas\/Salas\/(\d+)$/)?.[1] || null;
  const modalOpen = location.pathname === '/ListarSalas/Salas' || location.pathname.match(/^\/ListarSalas\/Salas\/\d+$/);

  const handleCloseModal = () => {
    navigate('/ListarSalas');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const loadClassrooms = async () => {
    const response = await fetch('http://localhost:5000/classrooms');
    const data = await response.json()
    setClassrooms(data)
  }

  const handleDelete = async (id) => {
    mostrarAlertaConfirmacion({
      titulo: "¿Eliminar sala?",
      texto: "Esta acción eliminará permanentemente la sala.",
      textoExito: "Sala eliminada correctamente",
      callbackConfirmacion: async () => {
        try {
          await fetch(`http://localhost:5000/classrooms/${id}`, {
            method: "DELETE",
          })
          setClassrooms(classrooms.filter(classroom => classroom.id_salon !== id)); //PENDIENTE REVISAR FUNCIONAMIENTO
        } catch (error) {
          console.log(error)
        }
      },
      callbackCancelacion: () => {
        console.log("Operación cancelada");
      }
    });
  }

  useEffect(() => {
    loadClassrooms()
  }, [])

  const filteredClassrooms = classrooms.filter((classroom) =>
    Object.values(classroom).some(
      (val) => typeof val === "string" && val.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, ml: 5, mr: 5 }}>
        <h1>GESTIÓN DE SALAS</h1>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/ListarSalas/Salas')}
        >
          <AddReactionIcon />
        </Button>
      </Box>

      <Box sx={{ mb: 5, ml: 5, mr: 5 }}>
        <TextField 
          fullWidth 
          label="Filtrar salas..." 
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
                {columnsClassrooms.map((column) => (
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
              {filteredClassrooms
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((classroom) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={classroom.id_salon}>
                      {columnsClassrooms.map((column) => {
                        const value = classroom[column.id];
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
                          onClick={() => navigate(`/ListarSalas/Salas/${classroom.id_salon}`)}
                          sx={{ backgroundColor: '#fbc02d', color: 'white', '&:hover': { backgroundColor: '#fdd835' } }}
                        >
                          <EditSquareIcon />
                        </Button>
                        <Button 
                          variant='contained' 
                          color='warning' 
                          onClick={() => handleDelete(classroom.id_salon)}
                          style={{marginLeft: ".5rem"}}
                        >
                          <DeleteRoundedIcon />
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
          count={classrooms.length}
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
          <h2 id="modal-title"> {location.pathname.includes('/Salas/') ? 'EDITAR SALA' : 'CREAR SALA'}</h2>
          <ClassroomForm
            key={classId || 'new'}
            userId={classId}
            hideInternalSubmitButton
            onExternalSubmit={() => {
              loadClassrooms();
              handleCloseModal();
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" onClick={handleCloseModal} sx={{ mr: 1 }}>Cerrar</Button>
            <Button
              type="submit"
              form="classroom-form"
              onClick={() => {
                // Triggerea el submit manualmente si lo necesitas
                const form = document.querySelector('form');
                if (form) form.requestSubmit();
              }}
              variant="contained"
              color="info"
            >
              {location.pathname.includes('/Salas/') ? 'EDITAR SALA' : 'CREAR SALA'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}
