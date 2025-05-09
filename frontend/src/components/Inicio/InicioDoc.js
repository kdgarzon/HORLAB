import { Box, Grid, Typography } from "@mui/material"; 

export default function HomePage() { 
  return ( 
    <Box sx={{ width: "100%", minHeight: "100vh", px: { xs: 2, md: 8 }, py: 10 }}> 
      <Grid 
        container 
        spacing={4} 
        sx={{ 
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, 
          display: "grid", 
          alignItems: "center", 
          textAlign: "left", 
        }} 
      > 
        {/* Columna izquierda - Texto */} 
        <Grid item xs={12} md={6}> 
          <Box sx={{ maxWidth: "100%", width: "100%" }}> 
            <Typography variant="h3" fontWeight="bold" gutterBottom> 
              Bienvenido(a) a HORLAB 
            </Typography> 
            <Typography variant="h5" color="text.secondary" mt={2}> 
              Organiza tus clases de manera fácil y eficiente. 
            </Typography> 
            <Typography variant="subtitle1" color="text.secondary" mt={2}> 
              Aquí podrás consultar tus asignaturas, revisar tus horarios asignados y mantener todo bajo control para que tu experiencia docente sea más productiva y sin contratiempos. 
            </Typography> 
          </Box> 
        </Grid> 

        {/* Columna derecha - Imágenes */} 
        <Grid  
          item xs={12} md={6}  
          sx={{ 
            mt: { xs: 4, md: 18 }, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
          }}> 
          <Box 
            sx={{ 
              position: "relative", 
              width: "100%", 
              height: { xs: 400, sm: 500, md: 600 }, 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
            }} 
          > 
            {/* Imagen 2 (vertical grande) */} 
            <Box 
              component="img" 
              src="/Segunda imagen.jpg" 
              alt="Imagen 2" 
              sx={{ 
                width: { xs: 160, sm: 250, md: 350 }, 
                height: { xs: 300, sm: 500, md: 650 }, 
                ml: 15, 
                borderRadius: 2, 
                position: "absolute", 
                bottom: 30, 
                left: 60, 
                boxShadow: 4, 
                objectFit: "cover", 
              }} 
            /> 
            {/* Imagen 1 (vertical pequeña encima de la 2) */} 
            <Box 
              component="img" 
              src="/Primera imagen.jpg" 
              alt="Imagen 1" 
              sx={{ 
                width: { xs: 120, sm: 180, md: 280 }, 
                height: { xs: 250, sm: 350, md: 500 }, 
                borderRadius: 2, 
                position: "absolute", 
                top: 0, 
                left: 0, 
                boxShadow: 5, 
                objectFit: "cover", 
              }} 
            /> 
            {/* Imagen 3 (cuadrada pequeña) */} 
            <Box 
              component="img" 
              src="/Tercera imagen.jpg" 
              alt="Imagen 3" 
              sx={{ 
                width: { xs: 100, sm: 200, md: 300 }, 
                height: { xs: 100, sm: 200, md: 300 }, 
                borderRadius: 2, 
                position: "absolute", 
                bottom: 0, 
                left: 200, 
                boxShadow: 6, 
                objectFit: "cover", 
                ml: 20, 
              }} 
            /> 
          </Box> 
        </Grid> 
      </Grid> 
    </Box> 
  ); 
} 

 
 
 
 