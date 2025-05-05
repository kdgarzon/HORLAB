import {useEffect, useState} from 'react'
import { Paper, Table, TableBody, TablePagination, TableCell, TableContainer, TableHead, 
  TableRow, Button, Box, TextField, Modal} from "@mui/material";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import {useNavigate, useLocation} from 'react-router-dom'
import AddReactionIcon from '@mui/icons-material/AddReaction';
import DocenteForm from './DocenteForm';

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
  { id: 'id_docente', label: 'ID Docente'},
  { id: 'nombre', label: 'Nombre del docente'}
];

export default function DocenteList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [docentes, setDocentes] = useState([]);
  const [search, setSearch] = useState("");
  
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
    try {
      await fetch(`http://localhost:5000/teachers/${id}`, {
        method: "DELETE",
      })
      setDocentes(docentes.filter(docente => docente.id_docente !== id));
    } catch (error) {
      console.log(error)
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
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/ListarDocentes/Docentes')}
        >
          <AddReactionIcon />
        </Button>
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
    </>
  )
}