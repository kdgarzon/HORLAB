import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from './components/Login'
import InicioAdm from './components/Inicio/InicioAdm'
import InicioDoc from './components/Inicio/InicioDoc'
import User from './components/User/UserForm'
import UserList from './components/User/UserList'
import PrivateRoute from './components/Inicio/PrivateRoute'
import DashboardLayoutBranding from './components/NavBar'

function AppContent() {
  
  return (

        <Routes>

          <Route path='/Login' element={<Login />} />
          <Route path='/' element={<Navigate to='/Login' />} />

          <Route element={<PrivateRoute allowedRoles={[1]}><DashboardLayoutBranding /></PrivateRoute>}>
            <Route path='/Login/admin' element={<InicioAdm />} />
            <Route path='/Usuarios' element={<User />} />
            <Route path='/Usuarios/:id' element={<User />} />
            <Route path='/ListarUsuarios' element={<UserList />} />
          </Route>

          <Route path='/Login/docente' element={<PrivateRoute allowedRoles={[2]}><InicioDoc /></PrivateRoute>} />

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