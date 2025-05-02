import {useEffect, useState} from 'react'
import { Paper, Table, TableBody, TablePagination, TableCell, TableContainer, TableHead, 
  TableRow, Button, Box, TextField, Modal} from "@mui/material";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import {useNavigate, useLocation} from 'react-router-dom'
import AddReactionIcon from '@mui/icons-material/AddReaction';
import UserForm from './UserForm';

import React from 'react';

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
  { id: 'id_usuario', label: 'ID Usuario'},
  { id: 'nombre', label: 'Nombre del usuario', minWidth: 100 },
  { id: 'apellido', label: 'Apellido del usuario', minWidth: 100 },
  { id: 'correo', label: 'Correo institucional' },
  { id: 'usuario', label: 'Usuario'},
  {id: 'pass', label: 'Contraseña', align: 'right'},
  {id: 'nombre_rol', label: 'Rol de usuario', align: 'right'}
];

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
    //console.log("Respuesta del backend:", data);
    setUsers(data)
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/users/${id}`, {
        method: "DELETE",
      })
      setUsers(users.filter(user => user.id_usuario !== id));
    } catch (error) {
      console.log(error)
    }
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
        <h1>USER LIST</h1>
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
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={user.id_usuario}>
                      {columns.map((column) => {
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
                          sx={{ backgroundColor: '#fbc02d', color: 'white', '&:hover': { backgroundColor: '#fdd835' } }}
                        >
                          <EditSquareIcon />
                        </Button>
                        <Button 
                          variant='contained' 
                          color='warning' 
                          onClick={() => handleDelete(user.id_usuario)}
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
