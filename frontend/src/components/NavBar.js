import {AppBar, Box, Button, Container, Toolbar, Typography} from "@mui/material";
import {Link, useNavigate} from 'react-router-dom'

export default function NavBar() {

  const navigate = useNavigate()

  return (
      <Box sx={{flexGrow: 1}}>
        <AppBar position="static" color="transparent">
          <Container>
            <Toolbar>
              <Typography variant="h4" sx={{flexGrow: 1}}>
                <Link to={"/ListarUsuarios"} style={{textDecoration: 'none', color: 'green'}}>HORLAB</Link>
              </Typography>
              <Button variant="contained" color="info" onClick={() => navigate("/Usuarios")}>
                Usuarios
              </Button>
            </Toolbar>
          </Container>    
        </AppBar>
      </Box>
  )
}
