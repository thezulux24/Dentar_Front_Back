import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Paper,
  Divider,
  IconButton,
  CircularProgress
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { formatDate, formatToReadableDate } from '../../utils/DatesUtils';

// types
import { Appointment } from "../../types";
import { appointmentStatusMap, mapEstadoToAppointmentStatusKey } from '../../utils/AppointmentStatus';
import dayjs from 'dayjs';

const monthsMap: Record<string, number> = {
  ENERO: 0, FEBRERO: 1, MARZO: 2, ABRIL: 3,
  MAYO: 4, JUNIO: 5, JULIO: 6, AGOSTO: 7,
  SEPTIEMBRE: 8, OCTUBRE: 9, NOVIEMBRE: 10, DICIEMBRE: 11,
};

interface MyProps {
  month: string;
  year: number; // Nuevo prop para el año
  handleOpen: (open: boolean, data: Appointment | null) => void;
  loading: boolean;
  events: Appointment[];
  setDateRange: (range: { start: string; end: string }) => void;
}

const Weekly: React.FC<MyProps> = ({
  month,
  year,
  handleOpen,
  loading,
  events,
  setDateRange,
}) => {
  // creo el estado de fecha central con mes y día recibidos 
  const [centerDate, setCenterDate] = useState(() => {
    if (!month || month == "" || !year) {
      return new Date(); // valor por defecto
    }

    const monthIndex = monthsMap[month.toUpperCase()];
    return new Date(year, monthIndex, 1);
  });

  // Calcular semana (lunes a domingo) a partir de centerDate
  const weekDays = useMemo(() => {

    const current = new Date(centerDate);
    const day = current.getDay(); // 0=domingo, 1=lunes...
    
    // Ajustar al lunes de la semana actual
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(current);
    monday.setDate(current.getDate() + diffToMonday);

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      d.setHours(0, 0, 0, 0)
      return d;
    });

  }, [centerDate]);

  // Obtener el nombre del mes en español
  const getMonthName = (date: Date): string => {
    const months = [
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];
    return months[date.getMonth()];
  };

  // Obtener el año de una fecha
  const getYearFromDate = (date: Date): number => {
    return date.getFullYear();
  };

  // Actualizar rango de fechas en cada cambio de semana
  useEffect(() => {
    const start = weekDays[0];
    const end = weekDays[weekDays.length - 1];

    // Pongo la hora al inicio del día
    start.setHours(0, 0, 0, 0);

    // Pongo la hora al final del día
    end.setHours(23, 59, 59, 999);
    
    setDateRange({
      start: formatDate(start),
      end: formatDate(end),
    });
  }, [weekDays, setDateRange]);

  // Navegar a la semana anterior
  const goToPreviousWeek = () => {
    setCenterDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 7);
      return newDate;
    });
  };

  // Navegar a la semana siguiente
  const goToNextWeek = () => {
    setCenterDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 7);
      return newDate;
    });
  };

  // Agrupar eventos por fecha
  const eventsByDate = useMemo(() => {
    return events.reduce<Record<string, Appointment[]>>((acc, ev) => {
      // console.log(ev || 'NADA')
      acc[ev.fecha] = acc[ev.fecha] || [];
      acc[ev.fecha].push(ev);
      return acc;
    }, {});
  }, [events]);

  return (
    <>
      {/* Leyenda de colores */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', my: 2 }}>
        {Object.entries(appointmentStatusMap).map(([key, { label, color }]) => (
          <Chip
            key={key}
            label={label}
            sx={{ backgroundColor: color, color: '#333' }}
          />
        ))}
      </Box>

      {/* Contenedor semana */}
      <Box
        sx={{
          border: 1,
          borderRadius: 2,
          borderColor: 'grey.300',
          p: 1,
          mt: 2,
          minHeight: '350px',
          position: "relative"
        }}
      >
        {/* Mes */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 0 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6">
              {getMonthName(centerDate).toUpperCase()} {getYearFromDate(centerDate)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2, mt: 1 }} />

        {/* Navegación de semanas */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton onClick={goToPreviousWeek} disabled={loading}>
            <ArrowBack />
          </IconButton>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Semana del {formatToReadableDate(weekDays[0].toString())} al {formatToReadableDate(weekDays[6].toString())}
            </Typography>
          </Box>
          
          <IconButton onClick={goToNextWeek} disabled={loading}>
            <ArrowForward />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", position: "absolute", top: "45%", left: "45%" }}>
            <CircularProgress />
          </Box>
        )}

        <Grid container spacing={1}>
          {weekDays.map((date) => {
            const iso = dayjs(date).format("YYYY-MM-DD");
            const dayName = date
              .toLocaleDateString('es-ES', { weekday: 'short' })
              .toUpperCase();
            const dayNumber = date.getDate();

            // Verificar si el día pertenece al mes actual
            const isCurrentMonth = date.getMonth() === centerDate.getMonth();

            return (
              <Grid size={{ xs: 12, sm: 6, md: 1.714 }} key={iso}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ 
                    textAlign: 'center',
                    color: isCurrentMonth ? 'text.primary' : 'text.secondary'
                  }}
                >
                  {dayName} <br /> {dayNumber}
                </Typography>

                {/* Eventos del día */}
                {eventsByDate[iso]?.map(event => (
                  <Paper
                    onClick={() => handleOpen(true, event)}
                    key={event.id_cita}
                    sx={{
                      backgroundColor:
                        appointmentStatusMap[mapEstadoToAppointmentStatusKey(event.estado.toLowerCase())]?.color || '#DADADA', // Fallback to a default grey
                      p: 1,
                      mb: 1,
                      borderRadius: 2,
                      cursor: 'pointer',
                    }}
                  >
                    <Box display="flex" alignItems="center" sx={{ gap: 1, mb: 0.5 }}>
                      <Typography variant="caption">
                        {event.hora_inicio.slice(0, 5)} - {event.hora_fin.slice(0, 5)}
                      </Typography>
                    </Box>
                    <Typography variant="body2">{event.motivo}</Typography>
                    <Typography variant="caption">{event.nombre_doctor}</Typography>
                  </Paper>
                ))}
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
};

export default Weekly;
