import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  People as PeopleIcon,
  LocalHospital as DoctorIcon,
  AssignmentInd as AuxiliarIcon,
  PersonAdd as PatientIcon,
  Event as EventIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import useAuthStore from '../../store/authStore';

interface DashboardStats {
  totalUsuarios: number;
  totalOdontologos: number;
  totalAuxiliares: number;
  totalPacientes: number;
  citasHoy: number;
  citasMes: number;
  ingresosDelMes: string;
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  subtitle 
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  color: string;
  subtitle?: string;
}) => (
  <Card 
    sx={{ 
      height: '100%',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4,
      },
    }}
  >
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ mt: 1, mb: 0.5, fontWeight: 600 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}15`,
            borderRadius: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon sx={{ fontSize: 32, color }} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Obtener usuarios por tipo
      const [odontologosRes, auxiliaresRes, pacientesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BACKEND_URL}/odontologos`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/auxiliares`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/pacientes`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const odontologosData = await odontologosRes.json();
      const auxiliaresData = await auxiliaresRes.json();
      const pacientesData = await pacientesRes.json();

      // Contar usuarios activos
      const totalOdontologos = odontologosData.data?.odontologos?.length || 0;
      const totalAuxiliares = auxiliaresData.data?.length || 0;
      // Corregir: usar pacientes.length en lugar de total
      const totalPacientes = pacientesData.data?.pacientes?.length || 0;

      // Obtener estadísticas de citas (si el endpoint existe)
      let citasHoy = 0;
      let citasMes = 0;
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        firstDayOfMonth.setHours(0, 0, 0, 0);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        lastDayOfMonth.setHours(23, 59, 59, 999);

        // Formatear fechas a 'YYYY-MM-DD'
        const formatDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        const todayStr = formatDate(today);
        const firstDayStr = formatDate(firstDayOfMonth);
        const lastDayStr = formatDate(lastDayOfMonth);

        // Obtener citas de hoy
        const citasHoyRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/citas?fecha_inicio=${todayStr}&fecha_fin=${todayStr}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (citasHoyRes.ok) {
          const citasHoyData = await citasHoyRes.json();
          citasHoy = citasHoyData.data?.total_items || 0;
        }

        // Obtener citas del mes
        const citasMesRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/citas?fecha_inicio=${firstDayStr}&fecha_fin=${lastDayStr}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (citasMesRes.ok) {
          const citasMesData = await citasMesRes.json();
          citasMes = citasMesData.data?.total_items || 0;
        }
      } catch (error) {
        console.log('No se pudieron obtener estadísticas de citas:', error);
      }

      // Obtener ingresos del mes (si el endpoint existe)
      let ingresosDelMes = '$0';
      try {
        const pagosRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/pagos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (pagosRes.ok) {
          const pagosData = await pagosRes.json();
          const today = new Date();
          const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          firstDayOfMonth.setHours(0, 0, 0, 0);
          const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          lastDayOfMonth.setHours(23, 59, 59, 999);
          
          const pagos = pagosData.data?.pagos || [];
          
          const totalIngresos = pagos.reduce((sum: number, pago: any) => {
            if (!pago.fecha_pago) return sum;
            const pagoDate = new Date(pago.fecha_pago);
            if (pagoDate >= firstDayOfMonth && pagoDate <= lastDayOfMonth) {
              return sum + (parseFloat(pago.monto) || 0);
            }
            return sum;
          }, 0);

          ingresosDelMes = `$${totalIngresos.toLocaleString('es-CO', { minimumFractionDigits: 0 })}`;
        }
      } catch (error) {
        console.log('No se pudieron obtener estadísticas de pagos:', error);
      }

      setStats({
        totalUsuarios: totalOdontologos + totalAuxiliares + totalPacientes,
        totalOdontologos,
        totalAuxiliares,
        totalPacientes,
        citasHoy,
        citasMes,
        ingresosDelMes,
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box p={3}>
        <Typography color="error">Error al cargar las estadísticas</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Panel de Administración
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Vista general del sistema DentAR
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        {/* Total Usuarios */}
        <StatCard
          title="Total Usuarios"
          value={stats.totalUsuarios}
          icon={PeopleIcon}
          color="#1976d2"
          subtitle="Usuarios activos"
        />

        {/* Odontólogos */}
        <StatCard
          title="Odontólogos"
          value={stats.totalOdontologos}
          icon={DoctorIcon}
          color="#2e7d32"
          subtitle="Profesionales registrados"
        />

        {/* Auxiliares */}
        <StatCard
          title="Auxiliares"
          value={stats.totalAuxiliares}
          icon={AuxiliarIcon}
          color="#ed6c02"
          subtitle="Personal de apoyo"
        />

        {/* Pacientes */}
        <StatCard
          title="Pacientes"
          value={stats.totalPacientes}
          icon={PatientIcon}
          color="#9c27b0"
          subtitle="Pacientes registrados"
        />
      </Box>

      {/* Citas e Ingresos Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, mt: 3 }}>
        {/* Citas Hoy */}
        <StatCard
          title="Citas Hoy"
          value={stats.citasHoy}
          icon={CalendarIcon}
          color="#0288d1"
          subtitle="Programadas para hoy"
        />

        {/* Citas del Mes */}
        <StatCard
          title="Citas del Mes"
          value={stats.citasMes}
          icon={EventIcon}
          color="#00796b"
          subtitle="Total del mes actual"
        />

        {/* Ingresos del Mes */}
        <StatCard
          title="Ingresos del Mes"
          value={stats.ingresosDelMes}
          icon={MoneyIcon}
          color="#388e3c"
          subtitle="Recaudado este mes"
        />
      </Box>

      {/* Info Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mt: 3 }}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Box display="flex" alignItems="center" mb={2}>
            <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Resumen del Sistema</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            El sistema DentAR cuenta actualmente con{' '}
            <strong>{stats.totalUsuarios} usuarios activos</strong>, distribuidos entre{' '}
            {stats.totalOdontologos} odontólogos, {stats.totalAuxiliares} auxiliares y{' '}
            {stats.totalPacientes} pacientes.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Este mes se han registrado <strong>{stats.citasMes} citas</strong> con ingresos 
            totales de <strong>{stats.ingresosDelMes}</strong>.
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, height: '100%' }}>
          <Box display="flex" alignItems="center" mb={2}>
            <EventIcon sx={{ mr: 1, color: 'secondary.main' }} />
            <Typography variant="h6">Acciones Rápidas</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            • Gestionar usuarios en la sección <strong>Administración</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • Revisar facturación y pagos en <strong>Facturación</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • Ver calendario de citas en <strong>Calendario</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Configurar el sistema en <strong>Configuración</strong>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
