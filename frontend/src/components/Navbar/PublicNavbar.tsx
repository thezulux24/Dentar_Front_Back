import React from 'react';
import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { HelpOutline, AccountCircle } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const CustomIcon = ({ src, alt }: { src: string; alt: string }) => (
  <Box
    component="img"
    src={src}
    alt={alt}
    sx={{ width: 24, height: 24 }}
  />
);

const PublicNavbar: React.FC = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#0073cf', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between', pl:"0px !important" }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }} component={RouterLink} to="/">
          <Box
            component="img"
            src={`${import.meta.env.BASE_URL}logo/logo.svg`}
            alt="DentAR Logo"
            sx={{ height: 70, mr: 2, width:'auto', mb:-0.5 }}
          />
        </Box>

        {/* Botones */}
        <Box>
          <Button
            component={RouterLink}
            to="/recursos"
            startIcon={<CustomIcon src={`${import.meta.env.BASE_URL}icons/resources.svg`} alt="Resources" />}
            sx={{ color: 'white', textTransform: 'none', px:{xs:1, sm:3} }}
          >
            Recursos
          </Button>
          <Button
            component={RouterLink}
            to="/autenticacion"
            startIcon={<AccountCircle />}
            sx={{ color: 'white', textTransform: 'none', px:{xs:1, sm:3} }}
          >
            Login
          </Button>
          <Button
            component={RouterLink}
            to="/soporte"
            startIcon={<HelpOutline />}
            sx={{ color: 'white', textTransform: 'none', px:{xs:1, sm:3} }}
          >
            Soporte
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default PublicNavbar;