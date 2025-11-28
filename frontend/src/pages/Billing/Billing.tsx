import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  Avatar,
  Stack,
  Divider,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  PendingActions as PendingIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

// Tipos temporales - luego vendrán del backend
interface Paciente {
  id: string;
  nombre: string;
  identificacion: string;
  ultimaConsulta: string;
  totalFacturado: number;
  totalPagado: number;
  saldoPendiente: number;
}

const Billing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [busqueda, setBusqueda] = useState('');

  // Datos mock - luego vendrán del backend
  const pacientes: Paciente[] = [
    {
      id: '1',
      nombre: 'Juan Gómez',
      identificacion: '1234567890',
      ultimaConsulta: '2025-11-20',
      totalFacturado: 2500000,
      totalPagado: 1500000,
      saldoPendiente: 1000000,
    },
    // Más datos...
  ];

  const pacientesFiltrados = pacientes.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.identificacion.includes(busqueda)
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);

  // Estadísticas generales
  const totalFacturado = pacientes.reduce((sum, p) => sum + p.totalFacturado, 0);
  const totalPagado = pacientes.reduce((sum, p) => sum + p.totalPagado, 0);
  const totalPendiente = pacientes.reduce((sum, p) => sum + p.saldoPendiente, 0);

  return (
    <Box component="main" sx={{ py: isMobile ? 2 : 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Stack spacing={3} mb={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ReceiptIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              component="h1"
              sx={{ fontWeight: 600, color: 'primary.dark' }}
            >
              Facturación
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary">
            Administra los pagos y facturas de tus pacientes
          </Typography>
        </Stack>

        {/* Estadísticas */}
        <Grid container spacing={2} mb={4}>
          <Grid item xs={12} sm={4}>
            <Card elevation={2}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                    <MoneyIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Facturado
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {formatCurrency(totalFacturado)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card elevation={2}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}>
                    <CheckCircleIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Pagado
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {formatCurrency(totalPagado)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card elevation={2}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'warning.main', width: 48, height: 48 }}>
                    <PendingIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Saldo Pendiente
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main' }}>
                      {formatCurrency(totalPendiente)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Buscador */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Buscar por nombre o identificación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: 'background.paper',
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* Tabla de pacientes */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                    Paciente
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                    Identificación
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                    Última Consulta
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">
                    Total Facturado
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">
                    Pagado
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">
                    Saldo Pendiente
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pacientesFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No se encontraron pacientes
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  pacientesFiltrados.map((paciente) => (
                    <TableRow
                      key={paciente.id}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {paciente.nombre}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {paciente.identificacion}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(paciente.ultimaConsulta).toLocaleDateString('es-CO')}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {formatCurrency(paciente.totalFacturado)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="success.main">
                          {formatCurrency(paciente.totalPagado)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={formatCurrency(paciente.saldoPendiente)}
                          color={paciente.saldoPendiente > 0 ? 'warning' : 'success'}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="primary"
                          title="Ver detalle"
                          onClick={() => {
                            // TODO: Navegar a detalle de factura
                            console.log('Ver detalle:', paciente.id);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Botón para crear nueva factura */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<ReceiptIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 4,
            }}
            onClick={() => {
              // TODO: Abrir modal o navegar a crear factura
              console.log('Crear nueva factura');
            }}
          >
            Registrar Pago
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Billing;
