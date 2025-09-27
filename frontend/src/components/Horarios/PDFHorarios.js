import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Box, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Table } from "@mui/material";
import jsPDF from "jspdf";

export default function PDFHorarios() {

  const location = useLocation();
  const { edificioId, edificio, pisoId, pisoNombre, diaId } = location.state || {};
  const [data, setData] = useState([]);
  const [salones, setSalones] = useState([]);
  const [franjas, setFranjas] = useState([]);

  useEffect(() => {
    if (edificioId && pisoId && diaId) {
      console.log("Consultando horarios con:", { edificioId, pisoId, diaId ,edificio, pisoNombre});
      fetch(`http://localhost:5000/schedule/filtrar/${edificioId}/${pisoId}/${diaId}`)
        .then((res) => res.json())
        .then((result) => {
          console.log('Horarios recibidos:', result);
          setData(result); 

          const salonesUnicos = [...new Set(result.map((h) => h.salon))];
          setSalones(salonesUnicos);

          const franjasUnicas = [...new Set(result.map((h) => h.hora))];
          setFranjas(franjasUnicas);
        })
        .catch((err) => console.error("Error consultando horarios:", err));
    }
  }, [edificioId, pisoId, diaId]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape", // horizontal
      unit: "mm",
      format: "letter",
    });

    doc.setFontSize(12);
    doc.text(`Horario de ${edificio} - Piso ${pisoNombre || pisoId}`, 10, 10);

    // Por ahora solo mostramos los datos JSON como string
    const jsonText = JSON.stringify(data, null, 2);
    doc.setFontSize(8);
    doc.text(jsonText, 10, 20);

    // Abrir vista previa en nueva pestaña
    window.open(doc.output("bloburl"), "_blank");
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>
          Horario de {edificio} - Piso {pisoNombre || pisoId}
        </h2>
        <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
          DESCARGAR PDF
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="center"><b>Franja horaria</b></TableCell>
              {salones.map((salon) => (
                <TableCell key={salon} align="center"><b>{salon}</b></TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {franjas.map((franja) => (
              <TableRow key={franja}>
                <TableCell component="th" scope="row">{franja}</TableCell>
                {salones.map((salon) => {
                  const horario = data.find(
                    (h) => h.salon === salon && h.hora === franja
                  );
                  return (
                    <TableCell key={salon + franja} align="center">
                      {horario ? `${horario.grupo} ${horario.docente}` : ""}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Vista en pantalla */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );

}
