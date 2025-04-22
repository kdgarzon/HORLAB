import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './components/Login'
import InicioAdm from './components/Inicio/InicioAdm'
import InicioDoc from './components/Inicio/InicioDoc'
import User from './components/User/UserForm'
import UserList from './components/User/UserList'
import NavBar from './components/NavBar'
import {Container} from "@mui/material"

export default function App() {
  return (
    <BrowserRouter>
    <NavBar />
      <Container>
        <Routes>
          <Route path='/Login' element={<Login />} />
          <Route path='/Login/admin' element={<InicioAdm />} />
          <Route path='/Login/docente' element={<InicioDoc />} />
          <Route path='/Usuarios' element={<User />} />
          <Route path='/ListarUsuarios' element={<UserList />} />
          <Route path='/Usuarios/:id' element={<User />} />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}