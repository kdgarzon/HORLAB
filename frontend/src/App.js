import {BrowserRouter, Routes, Route, Navigate, useLocation} from 'react-router-dom'
import Login from './components/Login'
import InicioAdm from './components/Inicio/InicioAdm'
import InicioDoc from './components/Inicio/InicioDoc'
import User from './components/User/UserForm'
import UserList from './components/User/UserList'
import NavBar from './components/NavBar'
import {Container} from "@mui/material"
import PrivateRoute from './components/Inicio/PrivateRoute'

function AppContent() {
  const location = useLocation();
  
  return (
    <>
    {location.pathname !== '/Login' && <NavBar />}
      <Container>
        <Routes>
          <Route path='/' element={<Navigate to={"/Login"} />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Login/admin' element={<PrivateRoute allowedRoles={[1]}><InicioAdm /></PrivateRoute>} />
          <Route path='/Login/docente' element={<PrivateRoute allowedRoles={[2]}><InicioDoc /></PrivateRoute>} />
          <Route path='/Usuarios' element={<PrivateRoute allowedRoles={[1]}><User /></PrivateRoute>} />
          <Route path='/ListarUsuarios' element={<PrivateRoute allowedRoles={[1]}><UserList /></PrivateRoute>} />
          <Route path='/Usuarios/:id' element={<PrivateRoute allowedRoles={[1]}><User /></PrivateRoute>} />
        </Routes>
      </Container>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}