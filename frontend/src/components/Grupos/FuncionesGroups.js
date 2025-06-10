import { agruparDisponibilidadPorDiaenGrupos, fusionarFranjasConsecutivas } from '../Docentes/Disponibilidad';
import { mostrarAlertaConfirmacion } from '../Alertas/Alert_Delete';

export const handleCloseModal = (navigate, id) => {
  navigate(`/ListarAsignaturas/Asignaturas/${id}/ListarGrupos`);
};

export const loadGroups = async (id, setGroups, setDisponibilidad, setSinDisponibilidad) => {
    try {
      const res = await fetch(`http://localhost:5000/subjects/${id}/groups`, {
          method: "GET",
      })
      if (!res.ok) {
        // Si la respuesta no es 200, abrir modal vacío y terminar
        setDisponibilidad([]);
        return;
      }
      const data = await res.json();
      setGroups(data);
    
      if (!Array.isArray(data)) {
        // Si por alguna razón no es un arreglo, también mostramos vacío
        setDisponibilidad([]);
      } else {
        // Aplicar lógica de fusión solo si hay datos
        const agrupado = agruparDisponibilidadPorDiaenGrupos(data);
        const fusionado = fusionarFranjasConsecutivas(agrupado);
        setDisponibilidad(fusionado);
        setSinDisponibilidad(fusionado.length === 0); // activa la alerta si no hay datos
      }
    } catch (error) {
      console.log(error)
      setDisponibilidad([]); // Mostrar alerta si hubo error de red
    }
};

export const handleDelete = async (id, id_grupo, groups, setGroups) => {
    mostrarAlertaConfirmacion({
      titulo: "¿Eliminar grupo?",
      texto: "Esta acción eliminará permanentemente el grupo.",
      textoExito: "Grupo eliminado correctamente",
      callbackConfirmacion: async () => {
        try {
          await fetch(`http://localhost:5000/subjects/${id}/groups/${id_grupo}`, { 
            method: "DELETE", 
          });
          setGroups(groups.filter(group => group.id_grupo !== id_grupo));
        } catch (error) {
          console.log(error)
        }
      },
      callbackCancelacion: () => {
        console.log("Operación cancelada");
      }
    });
}

// Filtra los grupos por texto de búsqueda
export const getfilteredGroups = (groups, search) => { 
    return groups.filter((group) =>
        Object.values(group).some(
            (val) => typeof val === "string" && val.toLowerCase().includes(search.toLowerCase())
        )
    );
};

// Obtiene grupos fusionados (opcional, para mantener GruposList limpio)
export const getGruposFusionados = (filteredGroups) => {
  const disponibilidadAgrupada = agruparDisponibilidadPorDiaenGrupos(filteredGroups);
  return fusionarFranjasConsecutivas(disponibilidadAgrupada);
};