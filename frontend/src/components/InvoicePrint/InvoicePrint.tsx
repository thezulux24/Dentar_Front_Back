import { useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Stack,
  Paper,
} from '@mui/material';
import { Print as PrintIcon, Close as CloseIcon } from '@mui/icons-material';

interface CitaFactura {
  id_cita: string;
  fecha: string;
  motivo: string;
  observaciones?: string;
  odontologo: string;
  estado: string;
  monto: number;
  pagado: number;
  saldo: number;
}

interface ServicioFactura {
  id_cita?: string;
  id_tratamiento_usuario?: string;
  tipo: 'cita' | 'tratamiento';
  fecha: string;
  motivo: string;
  observaciones?: string;
  odontologo: string;
  estado: string;
  monto: number;
  pagado: number;
  saldo: number;
}

interface InvoicePrintProps {
  detalle: {
    paciente: {
      id_paciente: string;
      nombre: string;
      identificacion: string;
      email?: string;
      telefono?: string;
    };
    resumen: {
      totalFacturado: number;
      totalPagado: number;
      saldoPendiente: number;
    };
    citas?: CitaFactura[];
    servicios?: ServicioFactura[];
  };
  onClose: () => void;
}

const InvoicePrint = ({ detalle, onClose }: InvoicePrintProps) => {
  const { paciente, resumen } = detalle;
  const componentRef = useRef<HTMLDivElement>(null);

  // Usar servicios o convertir citas a servicios para retrocompatibilidad
  const servicios: ServicioFactura[] = detalle.servicios || (detalle.citas || []).map(cita => ({
    id_cita: cita.id_cita,
    tipo: 'cita' as const,
    fecha: cita.fecha,
    motivo: cita.motivo,
    observaciones: cita.observaciones,
    odontologo: cita.odontologo,
    estado: cita.estado,
    monto: cita.monto,
    pagado: cita.pagado,
    saldo: cita.saldo,
  }));

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const numeroFactura = `F-${Date.now().toString().slice(-8)}`;
  const fechaEmision = new Date().toLocaleDateString('es-CO');

  return (
    <Box>
      {/* Botones de acción - No se imprimen */}
      <Box
        className="no-print"
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          mb: 3,
          '@media print': {
            display: 'none',
          },
        }}
      >
        <Button
          variant="outlined"
          startIcon={<CloseIcon />}
          onClick={onClose}
          sx={{ textTransform: 'none' }}
        >
          Cerrar
        </Button>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{ textTransform: 'none' }}
        >
          Imprimir Factura
        </Button>
      </Box>

      {/* Contenido de la factura */}
      <Paper
        ref={componentRef}
        elevation={0}
        sx={{
          p: 4,
          bgcolor: 'white',
          '@media print': {
            boxShadow: 'none',
            p: 2,
          },
        }}
      >
        {/* Encabezado de la clínica */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 1,
              '@media print': { fontSize: '2rem' },
            }}
          >
            DentAR Clínica Dental
          </Typography>
          <Typography variant="body2" color="text.secondary">
            NIT: 900.123.456-7
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dirección: Calle 123 #45-67, Cali, Colombia
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Teléfono: +57 (2) 555-0123 | Email: contacto@dentar.com
          </Typography>
          <Typography variant="body2" color="text.secondary">
            www.dentar.com
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Información de la factura */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
              FACTURA DE SERVICIOS ODONTOLÓGICOS
            </Typography>
            <Typography variant="body2">
              <strong>Factura N°:</strong> {numeroFactura}
            </Typography>
            <Typography variant="body2">
              <strong>Fecha de Emisión:</strong> {fechaEmision}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              FACTURADO A:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {paciente.nombre}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {paciente.identificacion}
            </Typography>
            {paciente.telefono && (
              <Typography variant="body2" color="text.secondary">
                Tel: {paciente.telefono}
              </Typography>
            )}
            {paciente.email && (
              <Typography variant="body2" color="text.secondary">
                Email: {paciente.email}
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Tabla de servicios */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Detalle de Servicios
        </Typography>

        <TableContainer>
          <Table sx={{ mb: 3 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Tipo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Fecha</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Descripción</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Profesional</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">
                  Valor
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">
                  Abonado
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">
                  Saldo
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servicios.map((servicio, index) => {
                const key = servicio.id_cita 
                  ? `cita-${servicio.id_cita}` 
                  : servicio.id_tratamiento_usuario 
                  ? `tratamiento-${servicio.id_tratamiento_usuario}`
                  : `servicio-${index}`;
                
                return (
                <TableRow key={key} hover>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: servicio.tipo === 'cita' ? 'primary.main' : 'secondary.main',
                      }}
                    >
                      {servicio.tipo === 'cita' ? 'Consulta' : 'Tratamiento'}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(servicio.fecha)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {servicio.motivo}
                    </Typography>
                    {servicio.observaciones && (
                      <Typography variant="caption" color="text.secondary">
                        {servicio.observaciones}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{servicio.odontologo}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{formatCurrency(servicio.monto)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="success.main">
                      {formatCurrency(servicio.pagado)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: servicio.saldo > 0 ? 'warning.main' : 'success.main',
                      }}
                    >
                      {formatCurrency(servicio.saldo)}
                    </Typography>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 3 }} />

        {/* Totales */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ minWidth: 300 }}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">Subtotal:</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {formatCurrency(resumen.totalFacturado)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" color="success.main">
                  Total Abonado:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }} color="success.main">
                  {formatCurrency(resumen.totalPagado)}
                </Typography>
              </Box>
              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  bgcolor: resumen.saldoPendiente > 0 ? 'warning.lighter' : 'success.lighter',
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  SALDO PENDIENTE:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: resumen.saldoPendiente > 0 ? 'warning.dark' : 'success.dark',
                  }}
                >
                  {formatCurrency(resumen.saldoPendiente)}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        {/* Nota importante */}
        {resumen.saldoPendiente > 0 && (
          <Box sx={{ mt: 4, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
            <Typography variant="body2" color="info.dark">
              <strong>Nota:</strong> Esta factura tiene un saldo pendiente de pago. Por favor,
              realice el pago lo antes posible para evitar recargos.
            </Typography>
          </Box>
        )}

        {/* Términos y condiciones */}
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            <strong>Términos y Condiciones:</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            • Los servicios prestados son responsabilidad de los profesionales asignados.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            • Los pagos realizados no son reembolsables.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            • Factura válida como soporte de gastos médicos para declaración de renta.
          </Typography>
        </Box>

        {/* Pie de página */}
        <Box sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="caption">
            Gracias por confiar en DentAR - Tu Sonrisa es Nuestra Prioridad
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default InvoicePrint;
