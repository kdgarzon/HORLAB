import Swal from 'sweetalert2';

export const alertaSuccessorError = ({
  titulo,
  texto = '',
  icono = 'success',
  position = 'center',
  timer = 1500
}) => {
  return Swal.fire({
    position: position,
    icon: icono,
    title: titulo,
    text: texto,
    showConfirmButton: false,
    timer: timer
  });
};