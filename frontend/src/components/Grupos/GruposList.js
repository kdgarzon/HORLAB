import {useEffect, useState, useCallback} from 'react'
import { Paper, Table, TableBody, TablePagination, TableCell, TableContainer, TableHead, 
  TableRow, Button, Box, TextField, Modal} from "@mui/material";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import {useNavigate, useLocation, useParams} from 'react-router-dom'
import AddReactionIcon from '@mui/icons-material/AddReaction';
import GruposForm from './GruposForm';
import { handleCloseModal, loadGroups, handleDelete, getfilteredGroups, getGruposFusionados } from "./FuncionesGroups";
import {extraerHoraInicial} from '../Docentes/Disponibilidad';
import { style } from "../Complementos/stylesFiles";
import { columnsGroups } from "../Complementos/modalDistribution";

export default function GruposList() {
  const [page, setPage] = useState(0);
  const {id} = useParams();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const groupId = location.pathname.match(/^\/ListarAsignaturas\/Asignaturas\/\d+\/ListarGrupos\/Grupos\/(\d+)$/)?.[1] || null;
  const modalOpen = location.pathname === `/ListarAsignaturas/Asignaturas/${id}/ListarGrupos/Grupos` || location.pathname.match(/^\/ListarAsignaturas\/Asignaturas\/\d+\/ListarGrupos\/Grupos\/\d+$/);

  const [disponibilidad, setDisponibilidad] = useState([]);
  const [sinDisponibilidad, setSinDisponibilidad] = useState(false);

  // Cambio de página en la tabla
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Cambio de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const loadGroupsCallback = useCallback(() => {
    loadGroups(id, setGroups, setDisponibilidad, setSinDisponibilidad);
  }, [id]);

  useEffect(() => {
    loadGroupsCallback();
  }, [loadGroupsCallback]);

  const handleCloseModalCallback = useCallback(() => {
    handleCloseModal(navigate, id);
  }, [navigate, id]);

  const handleDeleteCallback = (id_grupo) => {
    handleDelete(id, id_grupo, navigate, groups, setGroups);
  };  

  const filteredGroups = getfilteredGroups(groups, search);
  const gruposFusionados = getGruposFusionados(filteredGroups);

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
                {columnsGroups.map((column) => (
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
              {gruposFusionados
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((group, index) => (
                  <TableRow key={index}>
                    <TableCell>{group.dia}</TableCell>
                    <TableCell>{`${extraerHoraInicial(group.hora_inicio)} - ${group.hora_fin}`}</TableCell>
                    <TableCell>{group.grupo}</TableCell>
                    <TableCell>{group.nombre}</TableCell>
                    <TableCell>{group.proyecto}</TableCell>
                    <TableCell>{group.inscritos}</TableCell>
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
                        onClick={() => handleDeleteCallback(group.id_grupo)}
                        style={{marginLeft: ".5rem"}}
                      >
                        <DeleteRoundedIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={gruposFusionados.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* MODAL PADRE */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModalCallback}
        aria-labelledby="modal-title"
      >
        <Box sx={style}>
          <h2 id="modal-title"> {groupId ? 'EDITAR GRUPO' : 'CREAR GRUPO'}</h2>
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
  )
}