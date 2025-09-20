import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Box } from "@mui/material";
import jsPDF from "jspdf";

export default function PDFHorarios() {

  const location = useLocation();
  const { edificioId, edificio, pisoId, pisoNombre, diaId } = location.state || {};
  const [data, setData] = useState([]);

  useEffect(() => {
    if (edificioId && pisoId && diaId) {
      console.log("Consultando horarios con:", { edificioId, pisoId, diaId ,edificio, pisoNombre});
      fetch(`http://localhost:5000/schedule/filtrar/${edificioId}/${pisoId}/${diaId}`)
        .then((res) => res.json())
        .then((result) => {
          console.log('Horarios recibidos:', result);
          setData(result); 
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

      {/* Vista en pantalla */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );

}
