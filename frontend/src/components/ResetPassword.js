import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Typography, Container } from '@mui/material';

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
    <Container>
      <Typography variant="h5">Restablecer Contraseña</Typography>
      <form onSubmit={handleReset}>
        <TextField
          label="Nueva contraseña"
          fullWidth
          type="password"
          margin="normal"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        <Button type="submit" variant="contained">Actualizar contraseña</Button>
      </form>
      {msg && <Typography>{msg}</Typography>}
    </Container>
  );
}