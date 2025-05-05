import * as React from 'react';
import PropTypes from 'prop-types';
import {Box, Typography, createTheme} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useNavigate, useLocation} from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';
import SubjectIcon from '@mui/icons-material/Subject';
import DomainIcon from '@mui/icons-material/Domain';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const NAVIGATION = [
  {
    segment: 'Login/admin',
    title: 'Página Principal',
    icon: <DashboardIcon />,
  },
  {
    kind: 'divider',
  },
  {
    segment: 'ListarUsuarios',
    title: 'Usuarios',
    icon: <PersonIcon />,
  },
  {
    segment: 'ListarDocentes',
    title: 'Docentes',
    icon: <SchoolIcon />,
  },
  {
    segment: 'ListarAsignaturas',
    title: 'Asignaturas',
    icon: <SubjectIcon />,
  },
  {
    segment: 'ListarSalas',
    title: 'Salas',
    icon: <DomainIcon />,
  },
  {
    segment: 'ListarHorarios',
    title: 'Horarios',
    icon: <CalendarMonthIcon />,
  },
  {
    segment: 'ListarReportes',
    title: 'Reportes',
    icon: <DescriptionIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBranding(props) {
  const { window } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const router = {
    pathname: location.pathname,
    navigate: (path) => navigate(path),
  };

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // preview-start
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
        title: 'MUI',
        homeUrl: '/toolpad/core/introduction',
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >

      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}

DashboardLayoutBranding.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutBranding;

