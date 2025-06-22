import * as React from 'react';
import PropTypes from 'prop-types';
import {Box, Typography, createTheme} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useNavigate, useLocation, Outlet} from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';
import SubjectIcon from '@mui/icons-material/Subject';
import DomainIcon from '@mui/icons-material/Domain';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LogoutIcon from '@mui/icons-material/Logout';
import { Account } from '@toolpad/core/Account';

const NAVIGATION_ADMIN = [
  {segment: 'Login/admin', title: 'Página Principal', icon: <DashboardIcon />,},
  {kind: 'divider',},
  {segment: 'ListarUsuarios', title: 'Usuarios', icon: <PersonIcon />,},
  {segment: 'ListarDocentes', title: 'Docentes', icon: <SchoolIcon />,},
  {segment: 'ListarAsignaturas', title: 'Asignaturas', icon: <SubjectIcon />,},
  {segment: 'ListarSalas', title: 'Salas', icon: <DomainIcon />,},
  {segment: 'ListarHorarios', title: 'Horarios', icon: <CalendarMonthIcon />,},
  {segment: 'ListarReportes', title: 'Reportes', icon: <DescriptionIcon />,},
  {kind: 'divider',},
  {title: 'Cerrar Sesión', icon: <LogoutIcon />},
];

const NAVIGATION_DOCENTE = [
  {segment: 'Login/docente', title: 'Página Principal', icon: <DashboardIcon />,},
  {kind: 'divider',},
  {segment: 'ListarDocentes', title: 'Docentes', icon: <SchoolIcon />,},
  {kind: 'divider',},
  {title: 'Cerrar Sesión', icon: <LogoutIcon />},
]

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  palette: {
    primary: {
      main: '#ff0000', // rojo puro
    },
  },
  breakpoints: {
    values: {
      xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536,
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 0, 0, 0.1)', // Rojo clarito al hacer hover
            '& .MuiListItemIcon-root, & .MuiTypography-root': {
              color: '#ff0000', // rojo claro en hover
            },
            '& .MuiListItemIcon-root svg': {
              color: '#ff0000 !important',
            },
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            '& .MuiListItemIcon-root, & .MuiTypography-root': {
              color: '#bd0402', // rojo al estar seleccionado
            },
            '& .MuiListItemIcon-root svg': {
              color: '#bd0402 !important',
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: 'inherit', // Forzar que herede color del ListItemButton
        },
      },
    },
  },
});

function DashboardLayoutBranding(props) {
  const { window } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const router = {
    pathname: location.pathname,
    navigate: (path) => navigate(path),
  };

  const [session, setSession] = React.useState(() => {
    const name = `${localStorage.getItem('nombre') || ''} ${localStorage.getItem('apellido') || ''}`.trim();
    const email = localStorage.getItem('correo');
    const image = '/avatar.png'; // Opcional: reemplazar si tienes imagen real
    return name && email
      ? { user: { name, email, image } }
      : null;
  });

  const authentication = React.useMemo(() => {
    return {
      signIn: () => setSession({
        user: {
          name: `${localStorage.getItem('nombre') || ''} ${localStorage.getItem('apellido') || ''}`.trim(),
          email: localStorage.getItem('correo'),
          image: '/avatar.png',
        },
      }),
      signOut: () => {
        localStorage.clear();
        setSession(null);
        navigate('/Login');
      },
    };
  }, []);

  React.useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest('[data-toolpad-navigation-item]');
      if (!target) return;

      const title = target.textContent?.trim();

      if (title === 'Cerrar Sesión') {
        e.preventDefault();
        localStorage.clear();
        navigate('/Login');
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [navigate, authentication]);
  
  const demoWindow = window !== undefined ? window() : undefined;
  const rol = localStorage.getItem('id_rol');

  const filteredNavigation =
  rol === '1' ? NAVIGATION_ADMIN :
  rol === '2' ? NAVIGATION_DOCENTE :
  [];

  const homeUrl =
  rol === '1' ? '/Login/admin' :
  rol === '2' ? '/Login/docente' :
  '/Login'; // Por si no hay rol válido

  return (
    <AppProvider
      authentication={authentication}
      session={session}
      navigation={filteredNavigation}
      userMenu={<Account />}
      branding={{
        logo: (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img src="/cientifico.png" alt="HORLAB logo" />
          </Box>
        ),
        title: (
          <Typography variant="h6" sx={{ color: 'red', fontWeight: 'bold' }}>
            HORLAB
          </Typography>
        ),
        homeUrl: homeUrl,
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutBranding.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutBranding;

