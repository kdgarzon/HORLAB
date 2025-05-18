import {useEffect, useState} from 'react'
import { Paper, Table, TableBody, TablePagination, TableCell, TableContainer, TableHead, 
  TableRow, Button, Box, TextField, Modal} from "@mui/material";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import {useNavigate, useLocation} from 'react-router-dom'
import AddReactionIcon from '@mui/icons-material/AddReaction';
import AsignaturaForm from './AsignaturaForm';

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
  { id: 'id_asignatura', label: 'ID Asignatura'},
  { id: 'codigo_asig', label: 'Código de asignatura', minWidth: 100 },
  { id: 'nombre', label: 'Asignatura', minWidth: 100 }
];

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
    try {
      await fetch(`http://localhost:5000/subjects/${id}`, {
        method: "DELETE",
      })
      setAsignaturas(asignaturas.filter(asig => asig.id_asignatura !== id));
    } catch (error) {
      console.log(error)
    }
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
        <h1>SUBJECTS LIST</h1>
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
              {filteredAsignaturas
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((asignatura) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={asignatura.id_asignatura}>
                      {columns.map((column) => {
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
                          sx={{ backgroundColor: '#fbc02d', color: 'white', '&:hover': { backgroundColor: '#fdd835' } }}
                        >
                          <EditSquareIcon />
                        </Button>
                        <Button 
                          variant='contained' 
                          color='warning' 
                          onClick={() => handleDelete(asignatura.id_asignatura)}
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