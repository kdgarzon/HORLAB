import Card from '@mui/material/Card'; 
import CardContent from '@mui/material/CardContent'; 
import CardMedia from '@mui/material/CardMedia'; 
import Typography from '@mui/material/Typography'; 
import CardActionArea from '@mui/material/CardActionArea'; 
import { Box } from '@mui/material'; 

const tarjetas = [ 
  { 
    imagen: "/Imagen de usuarios.png", 
    titulo: "Gestión de Usuarios", 
    texto: "Permite administrar los perfiles de los usuarios que acceden a la aplicación para garantizar un acceso seguro y personalizado.", 
  }, 
  { 
    imagen: "/Imagen de docentes.png", 
    titulo: "Gestión de Docentes", 
    texto: "En este módulo se registran y gestionan los datos de los docentes facilitando su organización dentro del sistema.", 
  }, 
  { 
    imagen: "/Imagen de asignaturas.png", 
    titulo: "Gestión de Asignaturas", 
    texto: "Aquí se administran las asignaturas disponibles, incluyendo detalles como nombre, carga horaria, etc", 
  }, 
  { 
    imagen: "/Imagen de salas.png", 
    titulo: "Gestión de Salas", 
    texto: "Se encarga de la administración de las salas o espacios físicos donde se imparten las clases para optimizar la asignación en los horarios.", 
  }, 
  { 
    imagen: "/Imagen de horarios.png", 
    titulo: "Gestión de Horarios", 
    texto: "El núcleo de la aplicación, donde se crean y organizan los horarios de clases asegurando un calendario eficiente y sin conflictos.", 
  }, 
  { 
    imagen: "/Imagen de reportes.png", 
    titulo: "Gestión de Reportes", 
    texto: "Permite generar informes detallados y personalizados facilitando el análisis y la toma de decisiones.", 
  }, 
]; 

export default function InicioAdm() { 
  return ( 
    <Box> 
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          textAlign: "center", 
          my: 4, // margen vertical 
        }} 
      > 
        <Typography variant="h2" component="h1" gutterBottom fontWeight={400}> 
          Productividad para equipos felices 
        </Typography> 
        <Typography variant="h4" color="text.secondary" fontWeight={200}> 
          Software de gestión enfocado a un flujo de trabajo neutral en los Laboratorios de Informática. 
        </Typography> 
      </Box> 
      <Box 
        sx={{ 
          display: 'grid', 
          rowGap: 4, 
          columnGap: 3,  
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, 
          justifyItems: "center", 
        }} 
      > 
        {tarjetas.map((tarjeta, index) => ( 
          <Card key={index} sx={{ maxWidth: 345 }}> 
            <CardActionArea> 
              <CardMedia 
                component="img" 
                height="180" 
                image={tarjeta.imagen} 
                alt={tarjeta.titulo} 
              /> 
              <CardContent> 
                <Typography gutterBottom variant="h5" component="div"> 
                  {tarjeta.titulo} 
                </Typography> 
                <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "justify" }}> 
                  {tarjeta.texto} 
                </Typography> 
              </CardContent> 
            </CardActionArea> 
          </Card> 
        ))} 
      </Box> 
    </Box> 
  ); 

} 