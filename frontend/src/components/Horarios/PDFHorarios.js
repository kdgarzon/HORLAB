import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Box, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Table } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

    doc.setFontSize(8);
    doc.text(`Horario de ${edificio} - Piso ${pisoNombre || pisoId}`, 10, 10);

    const head = [["Franja horaria", ...salones]];

    const body = franjas.map((franja) => {
      const row = [franja];
      salones.forEach((salon) => {
        const horario = data.find(
          (h) => h.salon === salon && h.hora === franja
        );
        row.push(horario ? `${horario.grupo} ${horario.asignatura} ${horario.docente}` : "");
      });
      return row;
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // Ancho total de la página
    const margins = 20; // Márgenes izquierdo y derecho
    const availableWidth = pageWidth - margins;
    const firstColWidth = 9; //Ancho fijo para la primera columna
    const colWidth = (availableWidth - firstColWidth) / salones.length;

    const colStyles = {
      0: { cellWidth: firstColWidth }, // Columna fija
    };

    salones.forEach((_, i) => {
      colStyles[i + 1] = { cellWidth: colWidth };
    });

    autoTable(doc, {
      startY: 20,
      head: head,
      body: body,
      styles: { fontSize: 6, halign: "center", valign: "middle" },
      headStyles: { fillColor: "#ff6b6b", textColor: 255 },
      theme: "striped",
      margin: { top: 20, left: 10, right: 10 },
      tableWidth: "auto",
      columnStyles: colStyles,
    });
    //doc.save(`Horario_${edificio}_${pisoNombre || pisoId}.pdf`);

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
                      {horario ? `${horario.grupo} ${horario.asignatura} ${horario.docente}` : ""}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

}
