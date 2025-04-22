import {useEffect, useState} from 'react'
import { Paper, Table, TableBody, TablePagination, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import {useNavigate} from 'react-router-dom'

const columns = [
  { id: 'id_usuario', label: 'ID Usuario', minWidth: 170 },
  { id: 'usuario', label: 'Usuario', minWidth: 100 },
  {id: 'pass', label: 'Contraseña', minWidth: 170, align: 'right'},
  {id: 'nombre_rol', label: 'Rol de usuario', minWidth: 170, align: 'right'}
];

export default function UserList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

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

  return (
    <>
      <h1>USER LIST</h1>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
              {users
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
                          onClick={() => navigate(`/Usuarios/${user.id_usuario}`)}
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

    </>
  )
}
