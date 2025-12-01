import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Typography, IconButton, Tooltip, useMediaQuery, List, ListItem, ListItemIcon, ListItemText, Drawer, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
/* import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import DescriptionIcon from '@mui/icons-material/Description'; */
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu'
import { useTheme } from '@mui/material/styles';
import useAuthStore from '../../store/authStore'; //**********************************************  PROVISIONAL */

const CustomIcon = ({ src, alt }: { src: string; alt: string }) => (
  <Box
    component="img"
    src={src}
    alt={alt}
    sx={{ width: 24, height: 24 }}
  />
);

const navItems = [
    { label: 'Inicio', icon: <CustomIcon src={`${import.meta.env.BASE_URL}icons/home.svg`} alt="Home" />, path: 'inicio' },
    { label: 'Calendario', icon: <CustomIcon src={`${import.meta.env.BASE_URL}icons/calendar.svg`} alt="Calendar" />, path: 'calendario' },
    { label: 'Pacientes', icon: <CustomIcon src={`${import.meta.env.BASE_URL}icons/patients.svg`} alt="Patients" />, path: 'diagnosticos' },
    { label: 'Pagos', icon: <ReceiptIcon />, path: 'pagos', roles: ['paciente'] }, // Solo paciente
    { label: 'Facturación', icon: <ReceiptIcon />, path: 'facturacion', roles: ['auxiliar', 'admin'] }, // Auxiliar y Admin
    { label: 'Administración', icon: <SettingsIcon />, path: 'administracion', roles: ['admin'] }, // Solo admin
    { label: 'Recursos', icon: <CustomIcon src={`${import.meta.env.BASE_URL}icons/resources.svg`} alt="Resources" />, path: 'recursos' },
    { label: 'Soporte', icon: <HelpOutlineIcon />, path: 'soporte' },
    //{ label: 'Configuración', icon: <SettingsIcon />, to: '/doctor/configuracion' },
];


const Navbar: React.FC = () => {
    const { user } = useAuthStore(); 
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open: boolean) => () => setDrawerOpen(open);

    const filteredNavItems = navItems.filter(item => {
        // rol "paciente", se omite el ítem Pacientes
        if ((user?.rol).toLowerCase() === 'paciente' && item.label === 'Pacientes') {
            return false;
        }
        // Si el item tiene roles específicos, verificar que el usuario tenga ese rol
        if (item.roles && !item.roles.includes((user?.rol).toLowerCase())) {
            return false;
        }
        return true;
    });

    const drawer = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                {filteredNavItems.map((item) => (
                    <ListItem key={item.label} component={RouterLink} to={`/${user?.rol}/${item.path}`}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
                <ListItem
                    component={RouterLink}
                    to={'/' + user?.rol + '/configuracion'}>
                    <ListItemIcon>
                        <Avatar
                            alt={"perfil"}
                            src={`${import.meta.env.VITE_FILES_URL}${user?.foto_de_perfil}`}

                        /></ListItemIcon>
                    <ListItemText primary="Configuración" />
                </ListItem>

            </List>
        </Box>
    );

    return (


        <>
            <AppBar position="static" sx={{ backgroundColor: '#0073cf', boxShadow: 'none' }}>
                <Toolbar sx={{ justifyContent: 'space-between', pl: "0px !important" }}>
                    {/* Logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }} component={RouterLink} to={'/' + user?.rol + '/inicio'}>
                        <Box
                            component="img"
                            src={`${import.meta.env.BASE_URL}logo/logo.svg`}
                            alt="DentAR Logo"
                            sx={{ height: 70, mr: 2, width: 'auto', mb: -0.5 }}
                        />
                    </Box>

                    {
                        isMobile ? (
                            <>
                                <IconButton edge="end" color="inherit" onClick={toggleDrawer(true)}>
                                    <MenuIcon />
                                </IconButton>
                            </>
                        ) : (

                            < Box sx={{ display: 'flex', gap: 3 }}>
                                {filteredNavItems.map((item) => (
                                    <Tooltip title={item.label} key={item.label}>
                                        <IconButton
                                            component={RouterLink}
                                            to={`/${user?.rol}/${item.path}`}
                                            sx={{ color: 'white', display: 'flex', flexDirection: 'column' }}
                                        >
                                            {item.icon}
                                            <Typography variant="caption" color="white">
                                                {item.label}
                                            </Typography>
                                        </IconButton>
                                    </Tooltip>
                                ))}



                                {/* Botón de config */}
                                <Tooltip title="Configuración">
                                    <IconButton
                                        component={RouterLink}
                                        to={'/' + user?.rol + '/configuracion'}
                                    >
                                        <Avatar
                                            alt={"perfil"}
                                            src={`${import.meta.env.VITE_FILES_URL}${user?.foto_de_perfil}`}
                                        />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )
                    }



                </Toolbar>
            </AppBar >

            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                {drawer}
            </Drawer>
        </>
    );
};

export default Navbar;