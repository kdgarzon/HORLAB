import * as React from 'react';
import {
  Button, TextField, InputAdornment, Link, IconButton
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';

const providers = [{ id: 'credentials', name: 'User and Password' }];

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
      name="password"
      id="input_password"
      label="Contraseña"
      type={showPassword ? 'text' : 'password'}
      size="small"
      required
      fullWidth
      autoComplete="new-password"
      variant="standard"
      slotProps={{
        input: {
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
      color="info"
      size="small"
      disableElevation
      fullWidth
      sx={{ my: 2 }}
    >
      Iniciar sesión
    </Button>
  );
}

function ForgotPasswordLink() {
  return (
    <Link href="/forgot-password" variant="body2">
      ¿Olvidaste tu contraseña?
    </Link>
  );
}

function Title() {
  return <h2 style={{ marginBottom: 8 }}>Iniciar sesión</h2>;
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
          body: JSON.stringify({usuario, pass}),
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          return {
            type: 'CredentialsSignin',
            error: errorText || 'Error al iniciar sesión',
          };
        }
    
        const data = await res.json();

        // Guardar el id_rol y el usuario en localStorage
        localStorage.setItem('id_rol', data.id_rol);
        localStorage.setItem('usuario', data.usuario);
    
        //Se redirecciona segun el rol del usuario
    
        if (data.id_rol === 1) {
          window.location.href = '/Login/admin';
        } else if (data.id_rol === 2) {
          window.location.href = '/Login/docente';
        } else {
          alert('Rol desconocido');
        }
    
        resolve ({ type: 'CredentialsSignin' });
    
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
      <SignInPage
        autoComplete= "off"
        signIn={signIn}
        slots={{
          title: Title,
          emailField: CustomEmailField,
          passwordField: CustomPasswordField,
          submitButton: CustomButton,
          forgotPasswordLink: ForgotPasswordLink,
        }}
        providers={providers}
      />
    </AppProvider>
  );
}
