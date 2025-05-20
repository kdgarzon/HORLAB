import Swal from 'sweetalert2';

const swalWithMuiButtons = Swal.mixin({
  customClass: {
    confirmButton: 'mui-confirm-button',
    cancelButton: 'mui-cancel-button'
  },
  buttonsStyling: false
});

export const mostrarAlertaConfirmacion = async ({
  titulo = "¿Estás seguro?",
  texto = "Esta acción no se puede revertir",
  textoConfirmacion = "Sí, eliminar",
  textoCancelacion = "Cancelar",
  icono = "warning",
  textoExito = "¡Eliminado!",
  textoCancelado = "Acción cancelada",
  callbackConfirmacion = () => {},
  callbackCancelacion = () => {}
}) => {
  const result = await swalWithMuiButtons.fire({
    title: titulo,
    text: texto,
    icon: icono,
    showCancelButton: true,
    confirmButtonText: textoConfirmacion,
    cancelButtonText: textoCancelacion,
    reverseButtons: true
  });

  if (result.isConfirmed) {
    await swalWithMuiButtons.fire({
      title: textoExito,
      icon: "success"
    });
    callbackConfirmacion(); // Ejecuta función que pasaste como argumento
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    await swalWithMuiButtons.fire({
      title: textoCancelado,
      icon: "error"
    });
    callbackCancelacion();
  }
};

export const mostrarAlertaSimple = ({ titulo, texto, icono = "info" }) => {
  return Swal.fire({
    title: titulo,
    text: texto,
    icon: icono,
    confirmButtonText: 'OK'
  });
};

