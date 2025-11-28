import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Divider,
  Stack,
  Checkbox,
  FormControl,
  RadioGroup,
  Radio,
  Alert,
  Chip,
  useTheme,
  useMediaQuery,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  AccountBalance as BankIcon,
  CreditCard as CardIcon,
  AttachMoney as CashIcon,
  CheckCircle as CheckIcon,
  Receipt as ReceiptIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

// Tipos según la base de datos
interface CitaPendiente {
  id_cita: string;
  fecha_cita: string;
  motivo: string;
  nombre_tratamiento: string;
  odontologo: string;
  monto: number;
  estado_pago: string;
  seleccionada: boolean;
}

// Métodos de pago disponibles (vendrán de parametros en el backend)
const metodosPago = [
  { id: 'efectivo', nombre: 'Efectivo', icon: <CashIcon />, color: '#4caf50' },
  { id: 'tarjeta', nombre: 'Tarjeta Débito/Crédito', icon: <CardIcon />, color: '#2196f3' },
  { id: 'pse', nombre: 'PSE', icon: <BankIcon />, color: '#ff9800' },
  { id: 'transferencia', nombre: 'Transferencia Bancaria', icon: <BankIcon />, color: '#9c27b0' },
];

const Payment = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Estado del componente
  const [citasPendientes, setCitasPendientes] = useState<CitaPendiente[]>([
    // Mock data - vendrá del backend
    {
      id_cita: '1',
      fecha_cita: '2025-11-15',
      motivo: 'Limpieza dental',
      nombre_tratamiento: 'Profilaxis',
      odontologo: 'Dr. Carlos Martínez',
      monto: 150000,
      estado_pago: 'pendiente',
      seleccionada: false,
    },
    {
      id_cita: '2',
      fecha_cita: '2025-11-20',
      motivo: 'Ortodoncia - Control',
      nombre_tratamiento: 'Ortodoncia',
      odontologo: 'Dra. Ana López',
      monto: 200000,
      estado_pago: 'pendiente',
      seleccionada: false,
    },
    {
      id_cita: '3',
      fecha_cita: '2025-11-22',
      motivo: 'Resina dental',
      nombre_tratamiento: 'Resina',
      odontologo: 'Dr. Carlos Martínez',
      monto: 180000,
      estado_pago: 'pendiente',
      seleccionada: false,
    },
  ]);

  const [metodoPago, setMetodoPago] = useState('');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);

  // Calcular totales
  const citasSeleccionadas = citasPendientes.filter((c) => c.seleccionada);
  const totalAPagar = citasSeleccionadas.reduce((sum, c) => sum + c.monto, 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);

  const handleToggleCita = (id_cita: string) => {
    setCitasPendientes((prev) =>
      prev.map((c) =>
        c.id_cita === id_cita ? { ...c, seleccionada: !c.seleccionada } : c
      )
    );
  };

  const handleSelectAll = () => {
    const todasSeleccionadas = citasPendientes.every((c) => c.seleccionada);
    setCitasPendientes((prev) =>
      prev.map((c) => ({ ...c, seleccionada: !todasSeleccionadas }))
    );
  };

  const handleProcesarPago = () => {
    if (citasSeleccionadas.length === 0) {
      alert('Selecciona al menos una cita para pagar');
      return;
    }
    if (!metodoPago) {
      alert('Selecciona un método de pago');
      return;
    }

    setOpenConfirmDialog(true);
  };

  const handleConfirmarPago = () => {
    // Simular procesamiento de pago
    const pagoData = {
      citas: citasSeleccionadas.map((c) => ({
        id_cita: c.id_cita,
        monto: c.monto,
      })),
      metodo_pago: metodoPago,
      total: totalAPagar,
      fecha_pago: new Date().toISOString(),
    };

    console.log('Procesando pago:', pagoData);

    // Simular éxito
    setTimeout(() => {
      setOpenConfirmDialog(false);
      setPagoExitoso(true);

      // Limpiar selección después de 3 segundos
      setTimeout(() => {
        setCitasPendientes((prev) =>
          prev.filter((c) => !c.seleccionada)
        );
        setMetodoPago('');
        setPagoExitoso(false);
      }, 3000);
    }, 1500);
  };

  return (
    <Box component="main" sx={{ py: isMobile ? 2 : 4, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Stack spacing={2} mb={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <PaymentIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography
                variant={isMobile ? 'h5' : 'h4'}
                component="h1"
                sx={{ fontWeight: 600, color: 'primary.dark' }}
              >
                Realizar Pago
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Selecciona las citas que deseas pagar
              </Typography>
            </Box>
          </Box>
        </Stack>

        {/* Alerta de éxito */}
        {pagoExitoso && (
          <Alert
            icon={<CheckIcon fontSize="inherit" />}
            severity="success"
            sx={{ mb: 3, borderRadius: 2 }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              ¡Pago registrado exitosamente!
            </Typography>
            <Typography variant="body2">
              Tu pago de {formatCurrency(totalAPagar)} ha sido procesado correctamente.
            </Typography>
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Panel izquierdo - Citas pendientes */}
          <Box sx={{ flex: { md: '1 1 58%' } }}>
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ bgcolor: 'primary.main', p: 2 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                  Citas Pendientes de Pago
                </Typography>
              </Box>

              <Box sx={{ p: 2 }}>
                {citasPendientes.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <CheckIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      ¡No tienes pagos pendientes!
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Button
                        size="small"
                        onClick={handleSelectAll}
                        sx={{ textTransform: 'none' }}
                      >
                        {citasPendientes.every((c) => c.seleccionada)
                          ? 'Deseleccionar todo'
                          : 'Seleccionar todo'}
                      </Button>
                      <Chip
                        label={`${citasSeleccionadas.length} de ${citasPendientes.length} seleccionadas`}
                        color="primary"
                        size="small"
                      />
                    </Box>

                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell padding="checkbox"></TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Tratamiento</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Odontólogo</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="right">
                              Monto
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {citasPendientes.map((cita) => (
                            <TableRow
                              key={cita.id_cita}
                              hover
                              onClick={() => handleToggleCita(cita.id_cita)}
                              sx={{
                                cursor: 'pointer',
                                bgcolor: cita.seleccionada ? 'action.selected' : 'inherit',
                              }}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox checked={cita.seleccionada} />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {new Date(cita.fecha_cita).toLocaleDateString('es-CO')}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {cita.nombre_tratamiento}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {cita.motivo}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  {cita.odontologo}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {formatCurrency(cita.monto)}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
              </Box>
            </Paper>
          </Box>

          {/* Panel derecho - Método de pago */}
          <Box sx={{ flex: { md: '1 1 42%' } }}>
            <Stack spacing={3}>
              {/* Resumen */}
              <Card elevation={2} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Resumen de Pago
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Citas seleccionadas:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {citasSeleccionadas.length}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Total a pagar:
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: 'primary.main' }}
                      >
                        {formatCurrency(totalAPagar)}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Método de pago */}
              <Paper elevation={2} sx={{ borderRadius: 2, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Método de Pago
                </Typography>

                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                  >
                    <Stack spacing={1.5}>
                      {metodosPago.map((metodo) => (
                        <Paper
                          key={metodo.id}
                          elevation={metodoPago === metodo.id ? 3 : 1}
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            border: 2,
                            borderColor:
                              metodoPago === metodo.id ? metodo.color : 'transparent',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: metodo.color,
                              transform: 'translateY(-2px)',
                            },
                          }}
                          onClick={() => setMetodoPago(metodo.id)}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Radio value={metodo.id} />
                            <Avatar sx={{ bgcolor: metodo.color }}>
                              {metodo.icon}
                            </Avatar>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {metodo.nombre}
                            </Typography>
                          </Box>
                        </Paper>
                      ))}
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </Paper>

              {/* Botón de pago */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={citasSeleccionadas.length === 0 || !metodoPago}
                onClick={handleProcesarPago}
                startIcon={<PaymentIcon />}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                }}
              >
                Procesar Pago - {formatCurrency(totalAPagar)}
              </Button>

              {citasSeleccionadas.length === 0 && (
                <Alert severity="warning" icon={<WarningIcon />}>
                  <Typography variant="caption">
                    Selecciona al menos una cita para continuar
                  </Typography>
                </Alert>
              )}
            </Stack>
          </Box>
        </Box>
      </Container>

      {/* Dialog de confirmación */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'warning.main' }}>
              <ReceiptIcon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Confirmar Pago
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity="info">
              Estás a punto de procesar el siguiente pago:
            </Alert>

            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Método de pago:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                {metodosPago.find((m) => m.id === metodoPago)?.nombre}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Citas a pagar:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                {citasSeleccionadas.length} cita(s)
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Total:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: 'primary.main' }}
                >
                  {formatCurrency(totalAPagar)}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setOpenConfirmDialog(false)}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarPago}
            variant="contained"
            autoFocus
            sx={{ textTransform: 'none' }}
          >
            Confirmar Pago
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payment;
