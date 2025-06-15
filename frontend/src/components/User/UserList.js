import {useEffect, useState} from 'react'
import { Paper, Table, TableBody, TablePagination, TableCell, TableContainer, TableHead, 
  TableRow, Button, Box, TextField, Modal} from "@mui/material";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import {useNavigate, useLocation} from 'react-router-dom'
import AddReactionIcon from '@mui/icons-material/AddReaction';
import UserForm from './UserForm';
import { mostrarAlertaConfirmacion } from '../Alertas/Alert_Delete';
import { style } from "../Complementos/stylesFiles";
import { columnsUsers } from "../Complementos/modalDistribution";

export default function UserList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.pathname.match(/^\/ListarUsuarios\/Usuarios\/(\d+)$/)?.[1] || null;
  const modalOpen = location.pathname === '/ListarUsuarios/Usuarios' || location.pathname.match(/^\/ListarUsuarios\/Usuarios\/\d+$/);

  const handleCloseModal = () => {
    navigate('/ListarUsuarios');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const loadUsers = async () => {
    const response = await fetch('http://localhost:5000/users')
    const data = await response.json()
    setUsers(data)
  }

  const handleDelete = async (id) => {
    mostrarAlertaConfirmacion({
      titulo: "¿Eliminar usuario?",
      texto: "Esta acción eliminará permanentemente el usuario.",
      textoExito: "Usuario eliminado correctamente",
      callbackConfirmacion: async () => {
        try {
          await fetch(`http://localhost:5000/users/${id}`, {
            method: "DELETE",
          })
          setUsers(users.filter(user => user.id_usuario !== id));
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
    loadUsers()
  }, [])

  const filteredUsers = users.filter((user) =>
    Object.values(user).some(
      (val) => typeof val === "string" && val.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, ml: 5, mr: 5 }}>
        <h1>GESTIÓN DE USUARIOS</h1>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/ListarUsuarios/Usuarios')}
        >
          <AddReactionIcon />
        </Button>
      </Box>

      <Box sx={{ mb: 5, ml: 5, mr: 5 }}>
        <TextField 
          fullWidth 
          label="Filtrar usuarios..." 
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
                {columnsUsers.map((column) => (
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
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={user.id_usuario}>
                      {columnsUsers.map((column) => {
                        const value = user[column.id];
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
                          onClick={() => navigate(`/ListarUsuarios/Usuarios/${user.id_usuario}`)}
                          sx={{ backgroundColor: '#ffd94d', color: 'white', '&:hover': { backgroundColor: '#ffca1a' } }}
                        >
                          <EditSquareIcon />
                        </Button>
                        <Button 
                          variant='contained'
                          onClick={() => handleDelete(user.id_usuario)}
                          style={{marginLeft: ".5rem"}}
                          sx={{ backgroundColor: '#ff6b6b', color: 'white', '&:hover': { backgroundColor: '#ff3d2a' } }}
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
          count={users.length}
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
          <h2 id="modal-title"> {location.pathname.includes('/Usuarios/') ? 'EDITAR USUARIO' : 'CREAR USUARIO'}</h2>
          <UserForm
            key={userId || 'new'}
            userId={userId}
            hideInternalSubmitButton
            onExternalSubmit={() => {
              loadUsers();
              handleCloseModal();
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" onClick={handleCloseModal} sx={{ mr: 1 }}>Cerrar</Button>
            <Button
              type="submit"
              form="user-form"
              onClick={() => {
                // Triggerea el submit manualmente si lo necesitas
                const form = document.querySelector('form');
                if (form) form.requestSubmit();
              }}
              variant="contained"
              color="info"
            >
              {location.pathname.includes('/Usuarios/') ? 'EDITAR USUARIO' : 'CREAR USUARIO'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}
