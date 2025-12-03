import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface User {
  id_usuario: string;
  nombres: string;
  apellidos: string;
  email_: string;
  identificacion: string;
  telefono?: string;
  eliminado: number;
  rol?: string;
}

const Administration = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { token } = useAuthStore();

  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');

  const [formData, setFormData] = useState({
    email: '',
    clave: '',
    nombres: '',
    apellidos: '',
    identificacion: '',
    telefono: '',
    direccion: '',
    fecha_de_nacimiento: '',
    especialidad: '',
    rol: 'Paciente',
  });

  const roles = ['Paciente', 'Odontologo', 'Auxiliar', 'Admin'];

  useEffect(() => {
    fetchUsers();
  }, [tabValue]);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const roleEndpoints: Record<number, string> = {
        0: '/pacientes',
        1: '/odontologos',
        2: '/auxiliares',
      };

      const endpoint = roleEndpoints[tabValue];
      if (!endpoint) return;

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al cargar usuarios');

      const data = await response.json();
      
      // Adaptar la respuesta según el endpoint
      let userList: User[] = [];
      
      if (data.success && data.data) {
        // Para auxiliares, los datos vienen directamente en data.data (array)
        if (Array.isArray(data.data)) {
          userList = data.data.map((a: any) => ({
            ...a,
            rol: 'Auxiliar',
          }));
        } 
        // Para pacientes y odontólogos, vienen en data.data.pacientes o data.data.odontologos
        else if (data.data.pacientes) {
          userList = data.data.pacientes.map((p: any) => ({
            id_usuario: p.id,
            nombres: p.nombres,
            apellidos: p.apellidos,
            email_: p.correo,
            identificacion: p.identificacion,
            telefono: p.telefono || null,
            eliminado: -1, // Los que retorna findAll son activos
            rol: 'Paciente',
          }));
        } else if (data.data.odontologos) {
          userList = data.data.odontologos.map((o: any) => ({
            id_usuario: o.id,
            nombres: o.nombres,
            apellidos: o.apellidos,
            email_: o.correo,
            identificacion: o.identificacion,
            telefono: o.telefono || null,
            eliminado: -1, // Los que retorna findAll son activos
            rol: 'Odontologo',
          }));
        }
      }

      setUsers(userList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(
      (user) =>
        user.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email_?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.identificacion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredUsers(filtered);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSearchTerm('');
  };

  const handleOpenDialog = (mode: 'create' | 'edit', user?: User) => {
    setDialogMode(mode);
    if (mode === 'edit' && user) {
      setSelectedUser(user);
      setFormData({
        email: user.email_ || '',
        clave: '',
        nombres: user.nombres || '',
        apellidos: user.apellidos || '',
        identificacion: user.identificacion || '',
        telefono: user.telefono || '',
        direccion: '',
        fecha_de_nacimiento: '',
        especialidad: '',
        rol: user.rol || 'Paciente',
      });
    } else {
      setSelectedUser(null);
      setFormData({
        email: '',
        clave: '',
        nombres: '',
        apellidos: '',
        identificacion: '',
        telefono: '',
        direccion: '',
        fecha_de_nacimiento: '',
        especialidad: '',
        rol: tabValue === 0 ? 'Paciente' : tabValue === 1 ? 'Odontologo' : 'Auxiliar',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleToggleUserStatus = async (user: User) => {
    try {
      const roleEndpoints: Record<number, string> = {
        0: '/pacientes',
        1: '/odontologos',
        2: '/auxiliares',
      };

      const endpoint = `${import.meta.env.VITE_BACKEND_URL}${roleEndpoints[tabValue]}/${user.id_usuario}`;
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al cambiar estado del usuario');

      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const handleSubmit = async () => {
    try {
      // Validar email siempre requerido
      if (!formData.email) {
        setError('Por favor complete el campo de Email');
        return;
      }

      // Validar contraseña solo en modo creación
      if (dialogMode === 'create' && !formData.clave) {
        setError('Por favor complete el campo de Contraseña');
        return;
      }

      const roleEndpoints: Record<string, string> = {
        Paciente: '/pacientes',
        Odontologo: '/odontologos',
        Auxiliar: '/auxiliares',
        Admin: '/administradores',
      };

      let endpoint = `${import.meta.env.VITE_BACKEND_URL}${roleEndpoints[formData.rol]}`;
      let method = 'POST';

      // Si estamos en modo edición, cambiar el endpoint y el método
      if (dialogMode === 'edit' && selectedUser) {
        endpoint = `${endpoint}/${selectedUser.id_usuario}`;
        method = 'PATCH';
      }

      // Construir el body solo con los campos que tienen valor
      const requestBody: any = {
        email: formData.email.trim(),
      };

      // Solo agregar contraseña si estamos en modo creación o si se proporcionó en modo edición
      if (dialogMode === 'create' || (formData.clave && formData.clave.trim())) {
        requestBody.clave = formData.clave.trim();
      }

      // Agregar campos opcionales solo si tienen valor
      if (formData.nombres && formData.nombres.trim()) {
        requestBody.nombres = formData.nombres.trim();
      }
      if (formData.apellidos && formData.apellidos.trim()) {
        requestBody.apellidos = formData.apellidos.trim();
      }
      if (formData.identificacion && formData.identificacion.trim()) {
        requestBody.identificacion = formData.identificacion.trim();
      }
      if (formData.telefono && formData.telefono.trim()) {
        requestBody.telefono = formData.telefono.trim();
      }
      if (formData.direccion && formData.direccion.trim()) {
        requestBody.direccion = formData.direccion.trim();
      }
      if (formData.fecha_de_nacimiento && formData.fecha_de_nacimiento.trim()) {
        requestBody.fecha_de_nacimiento = formData.fecha_de_nacimiento.trim();
      }
      if (formData.especialidad && formData.especialidad.trim()) {
        requestBody.especialidad = formData.especialidad.trim();
      }

      console.log('Enviando datos:', requestBody); // Para debug

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Error response:', responseData);
        // Extraer el mensaje de error de forma más detallada
        let errorMessage = dialogMode === 'create' ? 'Error al crear usuario' : 'Error al actualizar usuario';
        if (responseData.message) {
          if (Array.isArray(responseData.message)) {
            errorMessage = responseData.message.join(', ');
          } else {
            errorMessage = responseData.message;
          }
        }
        throw new Error(errorMessage);
      }

      handleCloseDialog();
      fetchUsers();
      setError(null);
    } catch (err) {
      console.error('Error completo:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  return (
    <Box component="main" sx={{ py: isMobile ? 2 : 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              component="h1"
              sx={{ fontWeight: 600, color: 'primary.dark', mb: 1 }}
            >
              Administración de Usuarios
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestiona pacientes, odontólogos y auxiliares del sistema
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => handleOpenDialog('create')}
            sx={{ display: isMobile ? 'none' : 'flex' }}
          >
            Crear Usuario
          </Button>
          <IconButton
            color="primary"
            onClick={() => handleOpenDialog('create')}
            sx={{ display: isMobile ? 'flex' : 'none' }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Pacientes" />
            <Tab label="Odontólogos" />
            <Tab label="Auxiliares" />
          </Tabs>
        </Paper>

        {/* Search */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Buscar por nombre, apellido, email o identificación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Users Table */}
        <TabPanel value={tabValue} index={tabValue}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Nombre</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Identificación</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Teléfono</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Estado</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No se encontraron usuarios
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id_usuario} hover>
                        <TableCell>{`${user.nombres} ${user.apellidos}`}</TableCell>
                        <TableCell>{user.email_}</TableCell>
                        <TableCell>{user.identificacion}</TableCell>
                        <TableCell>{user.telefono || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip
                            icon={user.eliminado === -1 ? <ActiveIcon /> : <BlockIcon />}
                            label={user.eliminado === -1 ? 'Activo' : 'Inactivo'}
                            color={user.eliminado === -1 ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog('edit', user)}
                            title="Editar"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color={user.eliminado === -1 ? 'error' : 'success'}
                            onClick={() => handleToggleUserStatus(user)}
                            title={user.eliminado === -1 ? 'Desactivar' : 'Activar'}
                          >
                            {user.eliminado === -1 ? <BlockIcon /> : <ActiveIcon />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        {/* Create/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {dialogMode === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
                required
              />
              {dialogMode === 'create' ? (
                <TextField
                  label="Contraseña"
                  type="password"
                  value={formData.clave}
                  onChange={(e) => setFormData({ ...formData, clave: e.target.value })}
                  fullWidth
                  required
                />
              ) : (
                <TextField
                  label="Nueva Contraseña (opcional)"
                  type="password"
                  value={formData.clave}
                  onChange={(e) => setFormData({ ...formData, clave: e.target.value })}
                  fullWidth
                  helperText="Déjalo en blanco si no deseas cambiar la contraseña"
                />
              )}
              <TextField
                label="Nombres"
                value={formData.nombres}
                onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Apellidos"
                value={formData.apellidos}
                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Identificación"
                value={formData.identificacion}
                onChange={(e) => setFormData({ ...formData, identificacion: e.target.value })}
                fullWidth
                required={formData.rol !== 'Odontologo'}
              />
              <TextField
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                fullWidth
                required={formData.rol === 'Odontologo'}
                helperText={formData.rol === 'Odontologo' ? 'Campo requerido para odontólogos' : ''}
              />
              <TextField
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                fullWidth
                required={formData.rol === 'Odontologo'}
                helperText={formData.rol === 'Odontologo' ? 'Campo requerido para odontólogos' : ''}
              />
              <TextField
                label="Fecha de Nacimiento"
                type="date"
                value={formData.fecha_de_nacimiento}
                onChange={(e) => setFormData({ ...formData, fecha_de_nacimiento: e.target.value })}
                fullWidth
                required={formData.rol === 'Odontologo'}
                helperText={formData.rol === 'Odontologo' ? 'Campo requerido para odontólogos' : ''}
                InputLabelProps={{ shrink: true }}
              />
              {formData.rol === 'Odontologo' && (
                <TextField
                  label="Especialidad"
                  value={formData.especialidad}
                  onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                  fullWidth
                  required
                  helperText="Campo requerido para odontólogos"
                />
              )}
              {dialogMode === 'create' && (
                <FormControl fullWidth>
                  <InputLabel>Rol</InputLabel>
                  <Select
                    value={formData.rol}
                    label="Rol"
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSubmit} variant="contained">
              {dialogMode === 'create' ? 'Crear' : 'Guardar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Administration;
