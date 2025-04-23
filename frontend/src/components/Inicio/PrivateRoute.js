import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, allowedRoles }) {
  const idRol = localStorage.getItem('id_rol');

  if (!idRol) {
    // Si no hay sesión, redirige al login
    return <Navigate to="/Login" />;
  }

  if (allowedRoles && !allowedRoles.includes(Number(idRol))) {
    // Si hay sesión pero el rol no tiene permisos para esta ruta
    return <Navigate to="/Login" />;
  }

  return children;
}

