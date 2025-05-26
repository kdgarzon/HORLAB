import {useEffect, useState, useCallback} from 'react'
import { Paper, Table, TableBody, TablePagination, TableCell, TableContainer, TableHead, 
  TableRow, Button, Box, TextField, Modal} from "@mui/material";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import {useNavigate, useLocation, useParams} from 'react-router-dom'
import AddReactionIcon from '@mui/icons-material/AddReaction';
import GruposForm from './GruposForm';
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
  { id: 'id_grupo', label: 'ID Grupo', align: 'center', minWidth: 50 },
  { id: 'dia', label: 'Dia', minWidth: 50, align: 'center' },
  { id: 'hora', label: 'Franja Horaria', minWidth: 50, align: 'center' },
  { id: 'grupo', label: 'Grupo', align: 'center' },
  { id: 'nombre', label: 'Asignatura', align: 'center'},
  {id: 'proyecto', label: 'Proyecto', align: 'center', minWidth: 80},
  {id: 'inscritos', label: 'Número de inscritos', align: 'center'}
];

export default function GruposList() {
  const [page, setPage] = useState(0);
  const {id} = useParams();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const groupId = location.pathname.match(/^\/ListarAsignaturas\/Asignaturas\/\d+$\/ListarGrupos\/Grupos\/(\d+)$/)?.[1] || null;
  const modalOpen = location.pathname === `/ListarAsignaturas/Asignaturas/${id}/ListarGrupos/Grupos` || location.pathname.match(/^\/ListarAsignaturas\/Asignaturas\/\d+\/ListarGrupos\/Grupos\/\d+$/);

  const handleCloseModal = () => {
    navigate(`/ListarAsignaturas/Asignaturas/${id}/ListarGrupos`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const loadGroups = useCallback(async () => {
    const response = await fetch(`http://localhost:5000/subjects/${id}/groups`);
    const data = await response.json();
    //console.log("Respuesta del backend:", data);
    setGroups(data);
  }, [id]); 

  const handleDelete = async (id_grupo) => {
    mostrarAlertaConfirmacion({
      titulo: "¿Eliminar grupo?",
      texto: "Esta acción eliminará permanentemente el grupo.",
      textoExito: "Grupo eliminado correctamente",
      callbackConfirmacion: async () => {
        try {
          await fetch(`http://localhost:5000/subjects/${id}/groups/${id_grupo}`, { 
            method: "DELETE", 
          });
          setGroups(groups.filter(group => group.id_grupo !== id_grupo));
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
    loadGroups()
  }, [loadGroups])

  const filteredGroups = groups.filter((group) =>
    Object.values(group).some(
      (val) => typeof val === "string" && val.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, ml: 5, mr: 5 }}>
        <h1>GESTIÓN DE GRUPOS DE ASIGNATURAS</h1>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate(`/ListarAsignaturas/Asignaturas/${id}/ListarGrupos/Grupos`)}
        >
          <AddReactionIcon />
        </Button>
      </Box>

      <Box sx={{ mb: 5, ml: 5, mr: 5 }}>
        <TextField 
          fullWidth 
          label="Filtrar grupos..." 
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
              {filteredGroups
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((group) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={group.id_grupo}>
                      {columns.map((column) => {
                        const value = group[column.id];
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
                          onClick={() => navigate(`/ListarAsignaturas/Asignaturas/${id}/ListarGrupos/Grupos/${group.id_grupo}`)}
                          sx={{ backgroundColor: '#fbc02d', color: 'white', '&:hover': { backgroundColor: '#fdd835' } }}
                        >
                          <EditSquareIcon />
                        </Button>
                        <Button 
                          variant='contained' 
                          color='warning' 
                          onClick={() => handleDelete(group.id_grupo)}
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
          count={groups.length}
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
          <h2 id="modal-title"> {location.pathname.includes(`/Asignaturas/${id}/ListarGrupos/Grupos`) ? 'EDITAR GRUPO' : 'CREAR GRUPO'}</h2>
          <GruposForm
            key={groupId || 'new'}
            groupId={groupId}
            hideInternalSubmitButton
            onExternalSubmit={() => {
              loadGroups();
              handleCloseModal();
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" onClick={handleCloseModal} sx={{ mr: 1 }}>Cerrar</Button>
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
              {location.pathname.includes(`/Asignaturas/${id}/ListarGrupos/Grupos`) ? 'EDITAR GRUPO' : 'CREAR GRUPO'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}