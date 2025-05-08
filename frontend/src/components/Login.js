import * as React from 'react';
import {
  Box, Button, TextField, InputAdornment, Link, IconButton, Typography
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';

const providers = [{ id: 'credentials', name: 'User and Password' }];

function Title() {
  return (
    <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
      Iniciar sesión en HORLAB
    </Typography>
  );
}

function CustomEmailField() {
  return (
    <TextField
      id="input-with-icon-textfield"
      label="Usuario"
      name="usuarioLogin"
      autoFocus="true"
      autoComplete="username"
      type="text"
      size="small"
      required
      fullWidth
      variant="standard"
      margin="normal"
    />
  );
}

function CustomPasswordField() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <TextField
      id="input_password"
      label="Contraseña"
      name="password"
      type={showPassword ? 'text' : 'password'}
      size="small"
      required
      fullWidth
      autoComplete="new-password"
      variant="standard"
      margin="normal"
      slotProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="small"
              >
                {showPassword ? (
                  <VisibilityOff fontSize="inherit" />
                ) : (
                  <Visibility fontSize="inherit" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

function CustomButton() {
  return (
    <Button
      type="submit"
      variant="contained"
      disableElevation
      fullWidth
      sx={{ mt: 2, mb: 1, borderRadius: 5, backgroundColor: "#FF4500"}}
    >
      Iniciar sesión
    </Button>
  );
}

function ForgotPasswordLink() {
  return (
    <Box textAlign="center" mt={1}>
      <Link href="/forgot-password" variant="body2" underline="hover" sx={{color: "red"}}>
        ¿Olvidaste tu contraseña?
      </Link>
    </Box>
  );
}

const signIn = async (provider, formData) => {
  const usuario = formData?.get('usuarioLogin');
  const pass = formData?.get('password');

  return new Promise(async (resolve) => {
    setTimeout(async () => {
      try {
        const res = await fetch('http://localhost:5000/Login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuario, pass }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          return {
            type: 'CredentialsSignin',
            error: errorText || 'Error al iniciar sesión',
          };
        }

        const data = await res.json();
        //localStorage.setItem('id_rol', data.id_rol);
        localStorage.setItem('id_rol', data.id_rol);
        localStorage.setItem('usuario', data.usuario);

        if (data.id_rol === 1) {
          window.location.href = '/Login/admin';
        } else if (data.id_rol === 2) {
          window.location.href = '/Login/docente';
        } else {
          alert('Rol desconocido');
        }

        resolve({ type: 'CredentialsSignin' });

      } catch (error) {
        return {
          type: 'CredentialsSignin',
          error: 'Error de red o del servidor',
        };
      }
    }, 300);
  });
};

export default function SlotsSignIn() {
  const theme = useTheme();
  return (
    <AppProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', 
          p: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            width: '100%',
            maxWidth: 960,
            height: { xs: 'auto', md: '80vh' },
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          {/* Panel izquierdo decorativo */}
          <Box
            sx={{
              width: { xs: '100%', md: '50%' },
              display: { xs: 'none', md: 'block' },
              backgroundImage: 'url("/Rojo_naranja.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'left',
            }}
          />

          {/* Panel derecho con el formulario */}
          <Box
            sx={{
              width: { xs: '100%', md: '60%' },
              p: { xs: 4, md: 6 },
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <SignInPage
              autoComplete= "off"
              signIn={signIn}
              providers={providers}
              slots={{
                title: Title,
                emailField: CustomEmailField,
                passwordField: CustomPasswordField,
                submitButton: CustomButton,
                forgotPasswordLink: ForgotPasswordLink,
              }}
            />
          </Box>
        </Box>
      </Box>
    </AppProvider>
  );
}

