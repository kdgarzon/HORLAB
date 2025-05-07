import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';

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
    <Container>
      <Typography variant="h5">¿Olvidaste tu contraseña?</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Correo electrónico"
          fullWidth
          margin="normal"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Button type="submit" variant="contained">Enviar enlace</Button>
      </form>
      {msg && <Typography>{msg}</Typography>}
    </Container>
  );
}