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
  CircularProgress,
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
import { usePagos } from '../../hooks/usePagos';

const iconosPago: Record<string, React.ReactElement> = {
  Efectivo: <CashIcon />,
  Tarjeta: <CardIcon />,
  PSE: <BankIcon />,
  Transferencia: <BankIcon />,
  Financiado: <CashIcon />,
};

const coloresPago: Record<string, string> = {
  Efectivo: '#4caf50',
  Tarjeta: '#2196f3',
  PSE: '#ff9800',
  Transferencia: '#9c27b0',
  Financiado: '#607d8b',
};

const Payment = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    citasPendientes,
    metodosPago,
    loading,
    error,
    registrarPago,
  } = usePagos();

  const [citasSeleccionadas, setCitasSeleccionadas] = useState<string[]>([]);
  const [metodoPago, setMetodoPago] = useState('');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [totalPagado, setTotalPagado] = useState(0);

  const totalAPagar = citasPendientes
    .filter((c) => citasSeleccionadas.includes(c.id))
    .reduce((sum, c) => sum + c.saldo_pendiente, 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);

  const handleToggleCita = (id: string) => {
    setCitasSeleccionadas((prev) =>
      prev.includes(id)
        ? prev.filter((idServicio) => idServicio !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (citasSeleccionadas.length === citasPendientes.length) {
      setCitasSeleccionadas([]);
    } else {
      setCitasSeleccionadas(citasPendientes.map((c) => c.id));
    }
  };

  const handleProcesarPago = () => {
    if (citasSeleccionadas.length === 0) {
      alert('Selecciona al menos un servicio para pagar');
      return;
    }
    if (!metodoPago) {
      alert('Selecciona un método de pago');
      return;
    }

    setOpenConfirmDialog(true);
  };

  const handleConfirmarPago = async () => {
    setProcesandoPago(true);
    setTotalPagado(totalAPagar); // Guardar el total antes de procesar

    const resultado = await registrarPago(
      citasSeleccionadas,
      metodoPago,
      'Pago realizado desde portal del paciente'
    );

    setProcesandoPago(false);

    if (resultado.success) {
      setOpenConfirmDialog(false);
      setPagoExitoso(true);
      setCitasSeleccionadas([]);
      setMetodoPago('');

      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setPagoExitoso(false);
      }, 5000);
    }
  };

  const metodoSeleccionado = metodosPago.find((m) => m.id_parametro === metodoPago);

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
                Selecciona las consultas y tratamientos que deseas pagar
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
              Tu pago de {formatCurrency(totalPagado)} ha sido procesado correctamente.
            </Typography>
          </Alert>
        )}

        {/* Alerta de error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Panel izquierdo - Citas pendientes */}
            <Box sx={{ flex: { md: '1 1 58%' } }}>
              <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ bgcolor: 'primary.main', p: 2 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    Servicios Pendientes de Pago
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
                          {citasSeleccionadas.length === citasPendientes.length
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
                              <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Descripción</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Odontólogo</TableCell>
                              <TableCell sx={{ fontWeight: 600 }} align="right">
                                Saldo Pendiente
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {citasPendientes.map((servicio) => (
                              <TableRow
                                key={servicio.id}
                                hover
                                onClick={() => handleToggleCita(servicio.id)}
                                sx={{
                                  cursor: 'pointer',
                                  bgcolor: citasSeleccionadas.includes(servicio.id)
                                    ? 'action.selected'
                                    : 'inherit',
                                }}
                              >
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={citasSeleccionadas.includes(servicio.id)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={servicio.tipo === 'cita' ? 'Consulta' : 'Tratamiento'}
                                    size="small"
                                    color={servicio.tipo === 'cita' ? 'primary' : 'secondary'}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {new Date(servicio.fecha_cita).toLocaleDateString('es-CO')}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {servicio.nombre_tratamiento}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {servicio.motivo}
                                  </Typography>
                                  {servicio.descripcion && (
                                    <Typography variant="caption" color="text.secondary" display="block">
                                      {servicio.descripcion}
                                    </Typography>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="text.secondary">
                                    {servicio.odontologo}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {formatCurrency(servicio.saldo_pendiente)}
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
                          Servicios seleccionados:
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
                        {metodosPago.map((metodo) => {
                          const color = coloresPago[metodo.nombre] || '#757575';
                          const icon = iconosPago[metodo.nombre] || <CashIcon />;
                          
                          return (
                            <Paper
                              key={metodo.id_parametro}
                              elevation={metodoPago === metodo.id_parametro ? 3 : 1}
                              sx={{
                                p: 2,
                                cursor: 'pointer',
                                border: 2,
                                borderColor:
                                  metodoPago === metodo.id_parametro ? color : 'transparent',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  borderColor: color,
                                  transform: 'translateY(-2px)',
                                },
                              }}
                              onClick={() => setMetodoPago(metodo.id_parametro)}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Radio value={metodo.id_parametro} />
                                <Avatar sx={{ bgcolor: color }}>{icon}</Avatar>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {metodo.nombre}
                                </Typography>
                              </Box>
                            </Paper>
                          );
                        })}
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
                      Selecciona al menos un servicio para continuar
                    </Typography>
                  </Alert>
                )}
              </Stack>
            </Box>
          </Box>
        )}
      </Container>

      {/* Dialog de confirmación */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => !procesandoPago && setOpenConfirmDialog(false)}
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
                {metodoSeleccionado?.nombre || 'N/A'}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Servicios a pagar:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                {citasSeleccionadas.length} servicio(s)
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
            disabled={procesandoPago}
            sx={{ textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarPago}
            variant="contained"
            disabled={procesandoPago}
            autoFocus
            sx={{ textTransform: 'none' }}
          >
            {procesandoPago ? <CircularProgress size={24} /> : 'Confirmar Pago'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payment;
