import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useFetch from "../../hooks/useFetch";

// Stores
import useAuthStore from "../../store/authStore";
import useUIStore from "../../store/uiStore";

const sxText = {
  '& .MuiInputBase-root': {
    backgroundColor: '#ffffff', // blanco
    borderRadius: '4px',
    paddingLeft: 2,
    color: '#0B006A',
    border: '2px solid #1977CC'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none', // sin borde
  },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& label.Mui-focused': {
    display: 'none',
    color: 'black !important', //#E32780
  },
  '& input:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0 1000px #ffffff inset',
    WebkitTextFillColor: '#0B006A',
    transition: 'background-color 5000s ease-in-out 0s',
  },
  '& input::placeholder': {
    color: '#0B006A',
    opacity: 1,
  }
}

const Register: React.FC = () => {
  const theme = useTheme();
  const { isAuthenticated } = useAuthStore();
  const { openAlert } = useUIStore();
  const navigate = useNavigate();

  const { fetchData } = useFetch();

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    username: "",
    password: "",
    email: "",
    confirm: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validación de contraseña
    if( formData.password !== formData.confirm) {
      openAlert("Las contraseñas no coinciden", "error"); 
      setIsLoading(false);
      return;
    }

    try {
      // Crear Peticiíon al servidor
      const fetch_data = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        email: formData.email,
        clave: formData.password 
      };

      // Enviar petición al backend
      await fetchData({
        url: `${import.meta.env.VITE_BACKEND_URL}/pacientes`,
        method: 'POST',
        body: fetch_data
      });

      openAlert(`¡Registro exitoso!`, "success");

      // Redirigir al login
      navigate("/autenticacion");
    } catch (error: any) {
      openAlert(`${error?.message || error || 'Ha ocurrido un error'}`, "error"); //o para no incluir Error: ${error?.message}
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/doctor/inicio");
    }
  }, [isAuthenticated, navigate]);

  return (

    <Box
      sx={{
        display: 'flex',
        flexDirection: {
          xs: 'column',
          sm: 'row'
        },
        width: '100%',
        height: "100dvh",
        justifyContent: {
          xs: 'flex-start',
          sm: 'center'
        },
        pt: {
          xs: 5,
          sm: 0
        },
        alignItems: 'center'
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Container maxWidth="xs">
          <Typography variant="h5" fontWeight="bold" textAlign="center" color="primary.main">
            ¡Bienvenido a DentAR!
          </Typography>
          <Typography variant="h5" fontWeight="bold" textAlign="center" color={theme.palette.secondary.main}>
            Regístrate
          </Typography>

          <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
            {/* <TextField
              value={formData.username}
              onChange={handleFormChange}
              name="username"
              placeholder="Nombre de usuario"
              variant="outlined"
              fullWidth
              margin="normal"
              sx={sxText}

            /> */}
            <TextField
              value={formData.email}
              onChange={handleFormChange}
              name="email"
              placeholder="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              sx={sxText}
              required
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                value={formData.nombres}
                onChange={handleFormChange}
                name="nombres"
                placeholder="Nombres"
                variant="outlined"
                fullWidth
                sx={sxText}
                required
              />
              <TextField
                value={formData.apellidos}
                onChange={handleFormChange}
                name="apellidos"
                placeholder="Apellidos"
                variant="outlined"
                fullWidth
                sx={sxText}
                required
              />
            </Box>
            <TextField
              value={formData.password}
              onChange={handleFormChange}
              name="password"
              placeholder="Contraseña"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              margin="normal"
              sx={sxText}
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton sx={{ color: '#0B006A' }}
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              value={formData.confirm}
              onChange={handleFormChange}
              name="confirm"
              placeholder="Confirma contraseña"
              type={showConfPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              margin="normal"
              sx={sxText}
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton sx={{ color: '#0B006A' }}
                        onClick={() => setShowConfPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showConfPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                borderRadius: 1,
                backgroundColor: '#1977CC',
                '&:hover': {
                  backgroundColor: '#0B006A',
                },
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Cargando...' : 'Registrarse'}
            </Button>
          </form>



          {/* Separador */}
          <Box textAlign="center" my={2}>
            <Divider
              sx={{
                fontSize: "2rem",
                color: theme.palette.secondary.main,
                borderColor: theme.palette.secondary.main,
                '&::before, &::after': {
                  borderColor: theme.palette.secondary.main,
                },
              }}
            > ó </Divider>
          </Box>

          {/* Social icons */}
          <Box display="flex" justifyContent="center" gap={2} mb={2}>
            <IconButton color="primary">
              {/* <CustomYIcon sx={{ color: '#e5007e' }} /> */}
              <img
                src={`${import.meta.env.BASE_URL}icons/yahoo.svg`}
                alt="yahoo icon"
                style={{ maxWidth: '50px', height: 'auto' }}
              />
            </IconButton>
            <IconButton>
              {/* <GoogleIcon sx={{ color: '#e5007e' }} /> */}
              <img
                src={`${import.meta.env.BASE_URL}icons/google.svg`}
                alt="google icon"
                style={{ maxWidth: '50px', height: 'auto' }}
              />
            </IconButton>
            <IconButton>
              {/* <FacebookIcon sx={{ color: '#e5007e' }} /> */}
              <img
                src={`${import.meta.env.BASE_URL}icons/facebook.svg`}
                alt="facebook icon"
                style={{ maxWidth: '50px', height: 'auto' }}
              />
            </IconButton>
          </Box>

          {/* Registro */}
          <Typography variant="caption" display="block" textAlign="center" mb={2} color={theme.palette.secondary.main}>
            ¿Ya tienes cuenta?{' '}
            <Typography component="span" variant="caption" sx={{ color: "#0B006A", cursor: 'pointer' }}
              onClick={() => navigate('/autenticacion')}>
              Inicia sesión
            </Typography>
          </Typography>
        </Container>
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center">
        <img
          src={`${import.meta.env.BASE_URL}images/tooth.svg`}
          alt="Tooth"
          style={{ maxWidth: '80%', height: 'auto' }}
        />
      </Box>

    </Box>


  );
};

export default Register;
