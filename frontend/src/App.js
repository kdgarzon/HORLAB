import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from './components/Login'
import InicioAdm from './components/Inicio/InicioAdm'
import InicioDoc from './components/Inicio/InicioDoc'
import UserList from './components/User/UserList'
import DocenteList from './components/Docentes/DocenteList'
import PrivateRoute from './components/Inicio/PrivateRoute'
import DashboardLayoutBranding from './components/NavBar'
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

function AppContent() {
  return (

        <Routes>
          {/* Rutas accesibles para cualquier usuario */}
          <Route path='/Login' element={<Login />} />
          <Route path='/' element={<Navigate to='/Login' />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Rutas accesibles para usuario de administrador */}
          <Route element={<PrivateRoute allowedRoles={[1]}><DashboardLayoutBranding /></PrivateRoute>}>
            <Route path='/Login/admin' element={<InicioAdm />} />
            <Route path='/ListarUsuarios' element={<UserList />}>
              <Route path='/ListarUsuarios/Usuarios' element={null} />
              <Route path='/ListarUsuarios/Usuarios/:id' element={null} />
            </Route>
            <Route path='/ListarDocentes' element={<DocenteList />}>
              <Route path='/ListarDocentes/Docentes' element={null} />
              <Route path='/ListarDocentes/Docentes/:id' element={null} />
            </Route>
          </Route>

          {/* Rutas accesibles para usuario de docente */}
          <Route element={<PrivateRoute allowedRoles={[2]}><DashboardLayoutBranding /></PrivateRoute>}>
            <Route path='/Login/docente' element={<InicioDoc />} />            
          </Route>
        </Routes>

  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

/*<Route path='/ListarUsuarios' element={<PrivateRoute allowedRoles={[1]}><UserList /></PrivateRoute>} />*/
/*<Route path='/Usuarios' element={<User />} />
            <Route path='/Usuarios/:id' element={<User />} />
            <Route path='/ListarUsuarios' element={<UserList />} />*/