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


//PARA LEER EL ID_ROL DESDE CUALQUIER PARTE DEL FRONTEND

/*const idRol = localStorage.getItem('id_rol');
console.log('Rol actual:', idRol);

Por ejemplo, si quieres validar que solo un administrador acceda a una página:

React.useEffect(() => {
  const rol = localStorage.getItem('id_rol');
  if (rol !== '1') {
    alert('Acceso denegado. Solo administradores.');
    window.location.href = '/Login';
  }
}, []);

3. Borrar los datos de sesión (logout)
Cuando el usuario cierre sesión, puedes limpiar los datos así:

localStorage.removeItem('id_rol');
localStorage.removeItem('usuario');
// O si quieres borrar todo:
localStorage.clear();
window.location.href = '/Login';*/