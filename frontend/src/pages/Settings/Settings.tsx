import { useState, useEffect, useCallback } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fieldsConfig } from './fieldsConfig';

// Icons
import EditIcon from '@mui/icons-material/Edit';
// import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LogoutIcon from '@mui/icons-material/Logout';

// Stores
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';
import useFetch, { FetchResponse } from '../../hooks/useFetch';

const formatDateForInput = (dateString?: string) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return ''; // si es inválido
  return d.toISOString().split('T')[0]; // "YYYY-MM-DD"
};

const Settings = () => {
  const { logout, token, user } = useAuthStore();
  const { openAlert } = useUIStore();
  const navigate = useNavigate();
  const theme = useTheme();

  const { fetchData } = useFetch<FetchResponse>();
  const { fetchData: fetchUpdate, loading: loadingFetchUpdate } = useFetch<FetchResponse>();

  const [modoEdicion, setModoEdicion] = useState(false);
  const [datos, setDatos] = useState<Record<string, string>>({});
  const [datosEditados, setDatosEditados] = useState<Record<string, string>>({});
  const [foto, setFoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [nuevaClave, setNuevaClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [errorClave, setErrorClave] = useState('');

  useEffect(() => {
    // Construir URL de petición para cargar los datos del usuario
    let endpoint = '';

    switch( user?.rol.toLowerCase() ){
      case 'paciente':
        endpoint = `${import.meta.env.VITE_BACKEND_URL}/pacientes/perfil`
        break;
      case 'doctor':
        endpoint = `${import.meta.env.VITE_BACKEND_URL}/odontologos/perfil`
        break;
      case 'auxiliar':
        endpoint = `${import.meta.env.VITE_BACKEND_URL}/auxiliares/perfil`
        break;
      case 'admin':
        endpoint = `${import.meta.env.VITE_BACKEND_URL}/administradores/perfil`
        break;
      default:
        endpoint = `${import.meta.env.VITE_BACKEND_URL}/auth/profile`
    }

    // obtener perfil de usuario
    getProfile(endpoint);
  }, [user]);

  // Función para obtener los datos de perfil 
  const getProfile = useCallback(async (url: string) => {
    try {
      setLoading(true);

      const response = await fetchData({
        url,
        method: 'GET',
        token: token
      });

      if (!response?.success) throw new Error("Error al obtener las los datos del perfil");

      if(response.success && response.data){
        const profile_data = response.data;
        console.log('Perfil:', profile_data);
        setDatos(profile_data);
        setDatosEditados(profile_data);
      }

    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        openAlert(`${err.message}`, "error");
      } else {
        openAlert(`${String(err)}`, "error");
      }
    } finally {
      setLoading(false);
    }
  }, [token, datos, datosEditados, fetchData, openAlert]);

  // Función para guardar los datos del perfil
  const updateProfile = useCallback(async (url: string, body: any) => {
    try {
      const response = await fetchUpdate({
        url,
        body,
        method: 'PATCH',
        token: token
      });

      if (!response?.success) throw new Error("Error al actualizar los datos");

      if(response.success){
        setModoEdicion(false);
        setFoto(null);
        setPreviewUrl(null);
        openAlert(`${response.message || 'Actualización exitosa'}`, "success");

        // Re-fetch profile data to get the new avatar URL
        let endpoint = '';
        switch( user?.rol.toLowerCase() ){
          case 'paciente':
            endpoint = `${import.meta.env.VITE_BACKEND_URL}/pacientes/perfil`
            break;
          case 'doctor':
            endpoint = `${import.meta.env.VITE_BACKEND_URL}/odontologos/perfil`
            break;
          case 'auxiliar':
            endpoint = `${import.meta.env.VITE_BACKEND_URL}/auxiliares/perfil`
            break;
          case 'admin':
            endpoint = `${import.meta.env.VITE_BACKEND_URL}/administradores/perfil`
            break;
          default:
            endpoint = `${import.meta.env.VITE_BACKEND_URL}/auth/profile`
        }
        getProfile(endpoint);
      }

    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        openAlert(`${err.message}`, "error");
      } else {
        openAlert(`${String(err)}`, "error");
      }
    } finally {
    }
  }, [token, datos, datosEditados, fetchData, openAlert]);

  const handleLogout = () => {
    logout();
    navigate('/autenticacion');
  };

  const handleEditClick = () => {
    setDatosEditados(datos);
    setModoEdicion(true);
  };

  const handleCancel = () => {
    setModoEdicion(false);
    setDatosEditados(datos);
    setFoto(null);
    setPreviewUrl(null);
    setNuevaClave('');
    setConfirmarClave('');
    setErrorClave('');
  };

  const handleSave = () => {
    // Validar contraseñas si se ingresaron
    if (nuevaClave || confirmarClave) {
      if (nuevaClave !== confirmarClave) {
        setErrorClave('Las contraseñas no coinciden');
        openAlert('Las contraseñas no coinciden', 'error');
        return;
      }
      if (nuevaClave.length < 6) {
        setErrorClave('La contraseña debe tener al menos 6 caracteres');
        openAlert('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
      }
    }

    setErrorClave('');
    
    // Construir URL de petición
    let endpoint = '';
    let updateData: Record<string, any> = {}

    switch( user?.rol.toLowerCase() ){
      case 'paciente':
        endpoint = `${import.meta.env.VITE_BACKEND_URL}/pacientes`;
        updateData = {
          "nombres": datosEditados.nombres,
          "apellidos": datosEditados.apellidos,
          "informacion_personal": datosEditados.informacion_personal,
          "fecha_de_nacimiento": datosEditados.fecha_de_nacimiento,
          "telefono": datosEditados.telefono,
          "direccion": datosEditados.direccion,
          "identificacion": datosEditados.identificacion,
          "alergias": datosEditados.alergias,
          "tratamientos_previos": datosEditados.tratamientos_previos,
          "tolerante_anestesia": datosEditados.tolerante_anestesia,
        }
        break;
      case 'doctor':
        endpoint = `${import.meta.env.VITE_BACKEND_URL}/odontologos`;
        updateData = {
          "nombres": datosEditados.nombres,
          "apellidos": datosEditados.apellidos,
          "informacion_personal": datosEditados.informacion_personal,
          "fecha_de_nacimiento": datosEditados.fecha_de_nacimiento,
          "telefono": datosEditados.telefono,
          "direccion": datosEditados.direccion,
          "identificacion": datosEditados.identificacion,
          "especialidad": datosEditados.especialidad,
          "sede": datosEditados.sede,
        }
        break;
      case 'auxiliar':
        endpoint = `${import.meta.env.VITE_BACKEND_URL}/auxiliares`
        updateData = {
          "nombres": datosEditados.nombres,
          "apellidos": datosEditados.apellidos,
          "informacion_personal": datosEditados.informacion_personal,
          "fecha_de_nacimiento": datosEditados.fecha_de_nacimiento,
          "telefono": datosEditados.telefono,
          "direccion": datosEditados.direccion,
          "identificacion": datosEditados.identificacion,
          "sede": datosEditados.sede,
        }
        break;
      case 'admin':
        endpoint = `${import.meta.env.VITE_BACKEND_URL}/administradores`
        updateData = {
          "nombres": datosEditados.nombres,
          "apellidos": datosEditados.apellidos,
          "telefono": datosEditados.telefono,
          "direccion": datosEditados.direccion,
          "identificacion": datosEditados.identificacion,
        }
        break;
      default:
        endpoint = ''
    }

    // Agregar contraseña solo si se ingresó
    if (nuevaClave && nuevaClave.trim()) {
      updateData.clave = nuevaClave.trim();
    }

    // Crear FormData
    const formData = new FormData();
    Object.entries(updateData).forEach(([key, value]) => {
      if(value) formData.append(key, value as string);
    });

    if (foto) {
      formData.append("foto", foto);
    }

    // Se envía la petición para guardar los datos
    updateProfile(endpoint, formData);
    
    // Limpiar campos de contraseña después de guardar
    setNuevaClave('');
    setConfirmarClave('');
  };

  const handleChange = (campo: string, valor: string) => {
    setDatosEditados((prev) => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleFotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      openAlert('Formato de archivo no válido. Solo se permiten JPG o PNG.', 'error');
      event.target.value = ''; // Limpiar input
      return;
    }

    // Validar tamaño de archivo (3MB)
    const maxSizeInBytes = 3 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      openAlert('El archivo es demasiado grande. El tamaño máximo es de 3 MB.', 'error');
      event.target.value = ''; // Limpiar input
      return;
    }

    setFoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <Box sx={{
      p: { xs: 2, sm: 3, md: 4 },
      maxWidth: 1200,
      mx: 'auto',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <CircularProgress />
        </Box>
      ) : (
      <>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h5" component="h1">
          {modoEdicion?"Edita tu perfil":"Perfil"}
        </Typography>
        {!modoEdicion ? (
          <IconButton
            onClick={handleEditClick}
            disabled={loadingFetchUpdate}
            sx={{
              backgroundColor: theme.palette.secondary.main,
              color: 'white',
              borderRadius: 1,
              ml: 3,
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark
              }
            }}
          >
            <EditIcon />
          </IconButton>
        ) : (
          <Box>
            {/* <IconButton
              onClick={handleSave}
              sx={{
                backgroundColor: 'green',
                color: 'white',
                borderRadius: 1,
                ml: 3,
                mr: 1,
                '&:hover': { backgroundColor: 'darkgreen' },
              }}
            >
              <SaveIcon />
            </IconButton> */}
            <IconButton
              onClick={handleCancel}
              disabled={loadingFetchUpdate}
              sx={{
                backgroundColor: 'error.main',
                color: 'white',
                borderRadius: 1,
                '&:hover': { backgroundColor: 'error.dark' },
              }}
            >
              <CancelIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      <Box sx={{
        border: modoEdicion?"none":"2px solid #B4B4B4",
        borderRadius: 2,
        p: { xs: 2, md: 3 },
        mb: 3,
        /* backgroundColor: 'background.paper', */
        /* flex: 1 */
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: { xs: '100%', md: 400 },
            maxWidth: { xs: '100%', md: '50%' }
          }}>
            <Avatar
              alt={datos.nombres + " perfil"}
              src={previewUrl || `${import.meta.env.VITE_FILES_URL}${datos.avatar_url}`}
              sx={{
                width: { xs: 150, md: 200 },
                height: { xs: 150, md: 200 },
                mb: 2,
                bgcolor: '#898989ff'
              }}
            />

            <Box sx={{ 
              mb: 2, 
              textAlign: 'center', 
              display: modoEdicion?'none':'initial', 
              maxWidth:'100%'
            }}>
              <Typography 
                variant="h4" 
                component="div" 
                sx={{ fontWeight: 'bold' }} 
                color={datos.nombres ? 'textPrimary' : 'error'}>
                {datos.nombres}
              </Typography>

              <Typography 
                variant="h4" 
                component="div" 
                // sx={{ fontWeight: 'bold' }}
                sx={{
                  width:'100%',
                  fontWeight: 'bold',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: '2', // Number of lines to display before truncating
                  WebkitBoxOrient: 'vertical',
                }}
                color={datos.nombres ? 'textPrimary' : 'error'}>
                {datos.apellidos}
              </Typography>
            </Box>


            {modoEdicion && (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                width: '100%',
                maxWidth: 200
              }}>
                <Button
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  color="secondary"
                  component="label"
                >
                  Cambiar foto
                  <input
                    hidden
                    accept="image/png, image/jpeg"
                    type="file"
                    onChange={handleFotoChange}
                  />
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={handleSave}
                  loading={loadingFetchUpdate}
                >
                  Guardar cambios
                </Button>
              </Box>
            )}
          </Box>

          <Box sx={{ flex: 1 }}>
            {modoEdicion ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(12, 1fr)',
                  gap: 2,
                }}
              >
                {fieldsConfig
                  .filter(field => field.roles.includes((user?.rol)?.toLowerCase() as any))
                  .map((field) => (
                    <Box
                      key={field.name}
                      sx={{
                        gridColumn: {
                          xs: 'span 12',
                          sm: `span ${field.gridSpan}`,
                        },
                        borderRadius: 2, 
                        border: modoEdicion ? '1px solid' : 'none', 
                        borderColor: 'primary.light', 
                        py: modoEdicion ? 1 : 0, 
                        px: modoEdicion ? 2 : 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                       <Typography variant="body1" sx={{ minWidth: 150, }}>
                        {field.label}:
                      </Typography>
                      <TextField
                        fullWidth
                        type={field.type}
                        value={field.type === 'date'
                          ? formatDateForInput(datosEditados[field.name])
                          : datosEditados[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        disabled={!field.editable || loadingFetchUpdate}
                        variant="standard"
                        size="small"
                        InputLabelProps={{
                          shrink: field.type === 'date' || !!datosEditados[field.name],
                        }}
                        sx={{
                          '& .MuiInputBase-root': {
                            backgroundColor: 'background.paper',
                            borderRadius: 1,
                          },
                          '& .MuiInput-underline:before': {
                            borderBottom: 'none',
                          },
                          '& .MuiInput-underline:after': {
                            borderBottom: 'none',
                          }, 
                          '& .MuiInput-underline:hover:before': {
                            borderBottom: 'none',
                          },
                        }}
                      />
                    </Box>
                  ))}

                {/* Campos de cambio de contraseña */}
                <Box
                  sx={{
                    gridColumn: 'span 12',
                    mt: 2,
                  }}
                >
                  <Divider sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Cambiar Contraseña (Opcional)
                    </Typography>
                  </Divider>
                </Box>

                <Box
                  sx={{
                    gridColumn: {
                      xs: 'span 12',
                      sm: 'span 6',
                    },
                    borderRadius: 2, 
                    border: '1px solid', 
                    borderColor: errorClave && nuevaClave ? 'error.main' : 'primary.light', 
                    py: 1, 
                    px: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Typography variant="body1" sx={{ minWidth: 150 }}>
                    Nueva Contraseña:
                  </Typography>
                  <TextField
                    fullWidth
                    type="password"
                    value={nuevaClave}
                    onChange={(e) => {
                      setNuevaClave(e.target.value);
                      setErrorClave('');
                    }}
                    disabled={loadingFetchUpdate}
                    variant="standard"
                    size="small"
                    placeholder="Dejar en blanco para mantener la actual"
                    sx={{
                      '& .MuiInputBase-root': {
                        backgroundColor: 'background.paper',
                        borderRadius: 1,
                      },
                      '& .MuiInput-underline:before': {
                        borderBottom: 'none',
                      },
                      '& .MuiInput-underline:after': {
                        borderBottom: 'none',
                      }, 
                      '& .MuiInput-underline:hover:before': {
                        borderBottom: 'none',
                      },
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    gridColumn: {
                      xs: 'span 12',
                      sm: 'span 6',
                    },
                    borderRadius: 2, 
                    border: '1px solid', 
                    borderColor: errorClave && confirmarClave ? 'error.main' : 'primary.light', 
                    py: 1, 
                    px: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Typography variant="body1" sx={{ minWidth: 150 }}>
                    Confirmar Contraseña:
                  </Typography>
                  <TextField
                    fullWidth
                    type="password"
                    value={confirmarClave}
                    onChange={(e) => {
                      setConfirmarClave(e.target.value);
                      setErrorClave('');
                    }}
                    disabled={loadingFetchUpdate}
                    variant="standard"
                    size="small"
                    placeholder="Confirmar nueva contraseña"
                    error={!!errorClave && !!confirmarClave}
                    helperText={errorClave && confirmarClave ? errorClave : ''}
                    sx={{
                      '& .MuiInputBase-root': {
                        backgroundColor: 'background.paper',
                        borderRadius: 1,
                      },
                      '& .MuiInput-underline:before': {
                        borderBottom: 'none',
                      },
                      '& .MuiInput-underline:after': {
                        borderBottom: 'none',
                      }, 
                      '& .MuiInput-underline:hover:before': {
                        borderBottom: 'none',
                      },
                    }}
                  />
                </Box>
              </Box>
            ) : (
              <Box>
                {fieldsConfig
                  .filter(field => field.roles.includes((user?.rol)?.toLowerCase() as any) && !field.onlyOnEdit)
                  .map((field) => (
                    <Box key={field.name} sx={{ mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {field.label}:
                      </Typography>
                      <Typography
                        component="span"
                        color={datos[field.name] ? 'textPrimary' : 'error'}
                        sx={{
                          p: 1,
                          px: 0,
                          mt:1,
                          backgroundColor: datos[field.name] ? 'transparent' : 'rgba(255,0,0,0.05)',
                        }}
                      >
                        {datos[field.name] || 'Sin completar'}
                      </Typography>
                      <Divider sx={{ borderColor: 'primary.main', borderBottomWidth: 2, opacity: 0.5, mt:2 }} />
                    </Box>
                  ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Button
        onClick={handleLogout}
        variant="contained"
        color="primary"
        startIcon={<LogoutIcon />}
        sx={{
          alignSelf: 'flex-start',
          width: { xs: '100%', sm: 'auto' },
          mt: 2,
          py: 1.5,
          fontWeight: 'bold',
          display: modoEdicion?'none':'flex'
        }}
      >
        Cerrar sesión
      </Button>
      </>
      )}
    </Box>
  );
};

export default Settings;
