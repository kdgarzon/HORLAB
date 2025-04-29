import * as React from 'react';
import PropTypes from 'prop-types';
import {Box, Typography, createTheme} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useNavigate, useLocation} from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const NAVIGATION = [
  /*{
    segment: 'orders',
    title: 'Página Principal',
    icon: <ShoppingCartIcon />,
  },*/
  {
    kind: 'divider',
  },
  {
    segment: 'ListarUsuarios',
    title: 'Usuarios',
    icon: <DashboardIcon />,
  },/*
  {
    segment: 'orders',
    title: 'Docentes',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'orders',
    title: 'Asignaturas',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'orders',
    title: 'Salas',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'orders',
    title: 'Salas',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'orders',
    title: 'Salas',
    icon: <ShoppingCartIcon />,
  },*/
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

