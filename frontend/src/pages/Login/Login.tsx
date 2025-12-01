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
import useFetch, { FetchResponse } from "../../hooks/useFetch";

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

const Login: React.FC = () => {
  const theme = useTheme();
  const { login, user, isAuthenticated } = useAuthStore();
  const { openAlert } = useUIStore();
  const navigate = useNavigate();

  const { fetchData } = useFetch<FetchResponse>();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

    try {
      // Se envía la petición
      const response = await fetchData({
        url: `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        method: 'POST',
        body: {
          correo: formData.username,
          clave: formData.password
        }
      });

      if(response.success){
        const data = response.data;
        // Manejar respuesta exitosa
        if(!data?.token) {
          openAlert("No ha sido posible iniciar sesión correctamente", "error"); 
        }else {
          login(data.token);
        }
      }
      else {
        throw new Error("Ha ocurrido un error");
      }
    } catch (error) {
      openAlert(`${error}`, "error"); // NOTA: para no incluir "Error:" usar -> ${error?.message}
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Aquí puedes redirigir al usuario según su rol
      if(!user) {
        openAlert("No se han podido obtener los datos del usuario", "error");
        return;
      }

      const rol = user.rol;

      if ( rol === "doctor") {
        navigate("/doctor/inicio");
      } else if (rol === "auxiliar") {
        navigate("/auxiliar/inicio"); 
      }else if (rol === "paciente") {
        navigate("/paciente/inicio");
      }else if (rol === "admin") {
        navigate("/admin/inicio");
      }else {
        openAlert("Rol de usuario no reconocido", "error");
      }
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
            Inicia sesión con
          </Typography>
          <Typography variant="h5" fontWeight="bold" textAlign="center" color={theme.palette.secondary.main}>
            tu cuenta
          </Typography>

          <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
            <TextField
              value={formData.username}
              onChange={handleFormChange}
              name="username"
              placeholder="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              sx={sxText}
              required
            />
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

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                borderRadius: 1,
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Cargando...' : 'Iniciar sesión'}
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
            ¿No tienes cuenta?{' '}
            <Typography component="span" variant="caption" sx={{ color: "#0B006A", cursor: 'pointer' }}
              onClick={() => navigate('/registro')}>
              Regístrate
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

export default Login;
