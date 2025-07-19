import Card from '@mui/material/Card'; 
import CardContent from '@mui/material/CardContent'; 
import CardMedia from '@mui/material/CardMedia'; 
import Typography from '@mui/material/Typography'; 
import CardActionArea from '@mui/material/CardActionArea'; 
import { Box } from '@mui/material'; 
import { tarjetas } from '../Complementos/ArrayImagenes/AdmPictureList';

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