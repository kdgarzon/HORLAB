import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './components/Login'
import InicioAdm from './components/Inicio/InicioAdm'
import InicioDoc from './components/Inicio/InicioDoc'
import NavBar from './components/NavBar'
import {Container} from "@mui/material"

export default function App() {
  return (
    <BrowserRouter>
    <NavBar />
      <Container>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/Administrador' element={<InicioAdm />} />
          <Route path='/Docente' element={<InicioDoc />} />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}