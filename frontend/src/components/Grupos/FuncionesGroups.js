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


//FUNCIONES DEL ARCHIVO GRUPOSFORM.JS

export const handleDaySelect = (setGrupo) => (dayId) => {
  setGrupo((prevGroup) => ({
    ...prevGroup,
    dia: dayId 
  }));
};

export const handleHourSelect = (setGrupo) => (hourIds) => {
  setGrupo((prevGroup) => ({
    ...prevGroup,
    hora: hourIds
  }));
};

export const handleProjectSelect = (setGrupo, generarNombreGrupo, idAsignatura) => async (projectId) => {
  setGrupo((prevGroup) => ({
    ...prevGroup,
    proyecto: projectId 
  }));
  await generarNombreGrupo(idAsignatura, projectId, setGrupo);
};

export const handleChange = (setGrupo) => (e) => {
  setGrupo((prev) => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
};

export const generarNombreGrupo = async (idAsignatura, id_proyecto, setGrupo) => {
  const res = await fetch(`http://localhost:5000/subjects/${idAsignatura}/projects/${id_proyecto}/consecutive`);
  const data = await res.json();

  const nuevoNombre = `${data.codigo}-${data.siguiente}`;
  setGrupo((prev) => ({ 
    ...prev, 
    grupo: nuevoNombre 
  }));
};

export const loadOneGrupo = async (id_grupo, id_asignatura, setRawGrupo, setEditing) => {
  const res = await fetch(`http://localhost:5000/subjects/${id_asignatura}/groups/${id_grupo}`);
  const data = await res.json()
    
  console.log("Datos del grupo:", data);
  setRawGrupo(data); // Guarda los datos crudos
  setEditing(true);
};

export const handleSubmit = async (e, grupo, setLoadingCrear, editing, params, navigate, alertaSuccessorError, onExternalSubmit, groupId) => {
  e.preventDefault(); //Cancela el refresh del boton del formulario
  setLoadingCrear(true);

  if (
    !grupo.periodo || !grupo.dia || !grupo.hora || !grupo.grupo ||
    !grupo.id_asignatura || !grupo.proyecto || !grupo.inscritos
  ) {
    alertaSuccessorError({
      titulo: 'Campos incompletos',
      icono: 'warning',
    });
    setLoadingCrear(false);
    return;
  }
    
  if (editing) {
    const res = await fetch(`http://localhost:5000/subjects/${params.id}/groups/${groupId}`, {
      method: 'PUT',
      body: JSON.stringify(grupo),
      headers: {"Content-Type": "application/json"}
    });
    const data = await res.json()
    console.log("Respuesta del servidor: ", data);

    alertaSuccessorError({
      titulo: 'Grupo editado correctamente',
      icono: 'success',
    });

  } else {
    if (!grupo.periodo || !grupo.id_dia || !grupo.id_hora || !grupo.id_asignatura || !grupo.proyecto) {
      alertaSuccessorError({
        titulo: 'Campos incompletos',
        icono: 'warning',
      });
      return;
    }

    try {
      if (!Array.isArray(grupo.hora)) {
        throw new Error("Hora debe ser un array de IDs");
      } 

      for (const id_hora of grupo.hora) {
        const nuevoGrupo = {
          ...grupo,
          hora: id_hora
        };

        const res = await fetch(`http://localhost:5000/subjects/${params.id}/groups`, {
          method: 'POST',
          body: JSON.stringify(nuevoGrupo),
          headers: {"Content-Type": "application/json"}
        });

        if (!res.ok) {
          const errorData = await res.text();
          throw new Error(`Error del servidor: ${res.status} - ${errorData}`);
        }
        const data = await res.json()
        console.log("Respuesta del servidor: ", data);
      }
      alertaSuccessorError({
        titulo: 'Grupo creado correctamente',
        icono: 'success',
      });
        
    } catch (error) {
      console.error("Error al crear grupo:", error);
      alertaSuccessorError({
        titulo: 'Error al crear grupo',
        icono: 'error',
      });
    }
  }
  setLoadingCrear(false);
  if (onExternalSubmit) {
    onExternalSubmit();
  } else {
    navigate(`/ListarAsignaturas/Asignaturas/${params.id}/ListarGrupos`);
  }
}