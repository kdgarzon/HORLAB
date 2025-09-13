import { useEffect, useState } from "react";
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Typography } from "@mui/material";

export default function ConsultarHorario() {
  const [horarios, setHorarios] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/filtrarHorarios")
      .then(res => res.json())
      .then(data => setHorarios(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Horarios por Día</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Día</TableCell>
            <TableCell>Hora</TableCell>
            <TableCell>Asignatura</TableCell>
            <TableCell>Grupo</TableCell>
            <TableCell>Docente</TableCell>
            <TableCell>Salón</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {horarios.map((h, i) => (
            <TableRow key={i}>
              <TableCell>{h.dia}</TableCell>
              <TableCell>{h.hora}</TableCell>
              <TableCell>{h.asignatura}</TableCell>
              <TableCell>{h.grupo}</TableCell>
              <TableCell>{h.docente || "Sin asignar"}</TableCell>
              <TableCell>{h.salon || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
