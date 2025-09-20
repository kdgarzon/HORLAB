import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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

  return (
    <div>
      <h2>Horario de {edificio} - Piso {pisoNombre || pisoId}</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );

}
