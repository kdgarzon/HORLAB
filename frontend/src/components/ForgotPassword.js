import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/forgot-password', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ correo: email })
    });
    const data = await res.json();
    setMsg(data.message);
    console.log(data);
    
  };

  return (
    <Box
      sx={{
        backgroundImage: `url('Rojo_naranja.jpg')`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          <Typography variant="h5">¿Olvidaste tu contraseña?</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Correo electrónico"
              fullWidth
              margin="normal"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="contained"
              fullWidth
              sx={{ mt: 2, bgcolor: '#FF4500', '&:hover': { bgcolor: '#b30000' } }}
            >
              Enviar enlace
            </Button>
          </form>
          {msg && <Typography sx={{ mt: 2 }} color="text.secondary">
            {msg}
          </Typography>}
        </Box>
      </Container>
    </Box>
  );
}