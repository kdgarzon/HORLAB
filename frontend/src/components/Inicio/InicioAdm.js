import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Box } from '@mui/material';

const tarjetas = [
  {
    imagen: "/Rojo_naranja.jpg",
    titulo: "Lizard",
    texto: "Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica",
  },
  {
    imagen: "/Rojo_naranja.jpg",
    titulo: "Tortuga",
    texto: "Las tortugas son reptiles que llevan un caparazón y pueden vivir tanto en agua como en tierra.",
  },
  {
    imagen: "/Rojo_naranja.jpg",
    titulo: "Pájaro",
    texto: "Los pájaros son animales voladores con plumas y pico, adaptados para vivir en diversos hábitats.",
  },
  {
    imagen: "/Rojo_naranja.jpg",
    titulo: "Lizard",
    texto: "Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica",
  },
  {
    imagen: "/Rojo_naranja.jpg",
    titulo: "Tortuga",
    texto: "Las tortugas son reptiles que llevan un caparazón y pueden vivir tanto en agua como en tierra.",
  },
  {
    imagen: "/Rojo_naranja.jpg",
    titulo: "Pájaro",
    texto: "Los pájaros son animales voladores con plumas y pico, adaptados para vivir en diversos hábitats.",
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
        <Typography variant="h2" component="h1" gutterBottom fontWeight={300}>
          Productividad para equipos felices
        </Typography>
        <Typography variant="h4" color="text.secondary" fontWeight={200}>
          Software de gestión enfocado a un flujo de trabajo neutral en los Laboratorios de Informática.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          rowGap: 5,
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
                height="200"
                image={tarjeta.imagen}
                alt={tarjeta.titulo}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {tarjeta.titulo}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
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
