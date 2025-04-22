import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';

const providers = [{ id: 'credentials', name: 'Usuario y contraseña' }];

const signIn = async (provider, formData) => {

  const usuario = formData?.get('email');
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
    
        //Se redirecciona segun el rol del usuario
    
        if (data.id_rol === 1) {
          window.location.href = 'http://localhost:5000/admin';
        } else if (data.id_rol === 2) {
          window.location.href = 'http://localhost:5000/docente';
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

export default function Login() {
  const theme = useTheme();
  return (
    
    <AppProvider theme={theme}>
      <SignInPage
        signIn={signIn}
        providers={providers}
        slotProps={{ 
          emailField: { label: 'Usuario', autoFocus: true }, 
          form: { noValidate: true } 
        }}
      />
    </AppProvider>
  );
}
