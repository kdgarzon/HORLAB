import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box } from '@mui/material';

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword }) 
    });
    const data = await res.json();
    setMsg(data.message);
  };

  return (
    <Box
      sx={{
        backgroundImage: `url('/Rojo_naranja.jpg')`, 
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
          <Typography variant="h5">Restablecer Contraseña</Typography>
          <form onSubmit={handleReset}>
            <TextField
              label="Nueva contraseña"
              type="password"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, bgcolor: '#FF4500', '&:hover': { bgcolor: '#b30000' } }}
            >
              Actualizar contraseña
            </Button>
          </form>
          {msg && (
            <Typography sx={{ mt: 2 }} color="text.secondary">
              {msg}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
}