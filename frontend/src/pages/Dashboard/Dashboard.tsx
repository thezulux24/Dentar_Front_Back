import {
  Box,
  useTheme,
  useMediaQuery,
  Typography,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { RoleBasedGreeting, DailyAppointment, PendingAppointment, ReminderAppointment } from "../../components/imports";
import { useState, useEffect, useCallback } from 'react';
import useAuthStore from '../../store/authStore';
import useFetch, { FetchResponse } from '../../hooks/useFetch';
import useUIStore from '../../store/uiStore';
import { formatDate, formatTimeTo12Hour, validateDateFormat } from "../../utils/DatesUtils";
import { Appointment } from "../../types";

const KeyIndicator = ({ label, value }: { label: string; value: string | number }) => {
  const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'));

  return (
    <Box sx={{
      p: isMobile ? 1.5 : 2,
      border: '1px solid',
      borderColor: 'primary.main',
      borderRadius: 1,
      textAlign: 'left',
      minWidth: isMobile ? '100%' : '200px',
      flex:1
    }}>
      <Typography variant="h6" component="div" sx={{ color: 'primary.dark', fontWeight: 600 }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: 'primary.dark', fontWeight: 500 }}>
        {label}
      </Typography>
    </Box>
  );
};

const Dashboard = () => {
  const { user } = useAuthStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [dailyAppointments, setDailyAppointments] = useState<Appointment[]>([]);
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [needUpdateAppointments, setNeedUpdateAppointments] = useState(false);
  const [totalDayAppointments, setTotalDayAppointments] = useState(0);

  const { fetchData } = useFetch<FetchResponse>();
  const { token } = useAuthStore();
  const { openAlert } = useUIStore();

  const doctors = [
    { id: '1', name: 'Dr. Rodríguez' },
    { id: '2', name: 'Dr. García' },
    { id: '3', name: 'Dr. Martínez' }
  ];

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
    setNeedUpdateAppointments(true);
  };

  const formattedDate = currentDate.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const handleConfirmAppointment = () => {
    console.log('Cita confirmada');
  };

  const handleCancelAppointment = (reason: string) => {
    console.log('Cita cancelada:', reason);
  };

  const handleAddReminder = (reminderText: string) => {
    console.log('Recordatorio agregado:', reminderText);
  };

  const handleDoctorChange = (event: any) => {
    setSelectedDoctor(event.target.value);
    setNeedUpdateAppointments(true);
  };

  const fetchAppointments = useCallback(async () => {
    try {
      setLoadingAppointments(true);
      // Formatear fechas a 'YYYY-MM-DD'
      const formattedStartDate = formatDate(new Date(currentDate.setHours(0, 0, 0, 0)));
      const formattedEndDate = formatDate(new Date(currentDate.setHours(23, 59, 59, 999)));

      const valid_fecha_inicio = validateDateFormat(formattedStartDate);
      const valid_fecha_fin = validateDateFormat(formattedEndDate);

      if (!valid_fecha_inicio || !valid_fecha_fin) {
        throw new Error("Formato de fechas de consulta inválido");
      }

      const fetch_params: {
        fecha_inicio: string;
        fecha_fin: string;
        pagina: number;
        cantidad_por_pagina: number;
        id_odontologo?: string;
      } = {
        fecha_inicio: formattedStartDate,
        fecha_fin: formattedEndDate,
        pagina: 1,
        cantidad_por_pagina: 10
      };

      //Agrego parámetros según el rol
      if (user?.rol == 'doctor'){
        fetch_params.id_odontologo = user.id;
      }

      const response = await fetchData({
        url: `${import.meta.env.VITE_BACKEND_URL}/citas`,
        method: 'GET',
        params: fetch_params,
        token: token
      });

      if (!response?.success) throw new Error("Error al obtener las citas");

      if (response.success && response.data?.citas) {
        const appointments = response.data.citas;
        setDailyAppointments(appointments || []);
        setPendingAppointments((appointments || []).filter((app:Appointment) => app.estado.toLowerCase() === 'pendiente'));
        setTotalDayAppointments(response.data.total_items || 0);
      }

    } catch (err) {
      console.error(err);
      openAlert(`${err}`, "error");
    } finally {
      setNeedUpdateAppointments(false);
      setLoadingAppointments(false);
    }
  }, [currentDate, selectedDoctor, user, token, fetchData, openAlert]);

  useEffect(() => {
    if (user) { // Only fetch if user data is available
      fetchAppointments();
    }
  }, [currentDate, selectedDoctor, needUpdateAppointments, user, fetchAppointments]);

  return (
    <Box component="main" sx={{ p: isMobile ? 2 : 3 }}>
      {(user?.rol.toLowerCase()) === "doctor" && (
        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 4,
          mb: 4
        }}>

          <Box sx={{maxWidth:{xs:"100%", sm:"50%"}, mb:3, p:{xs:0, lg:4} }}>
            <Box sx={{ flex: 1 }}>
              <RoleBasedGreeting
                name={`${user?.nombres} ${user?.apellidos}`}
                role={user?.rol}
                photoSrc={`${import.meta.env.VITE_FILES_URL}${user?.foto_de_perfil}`} 
              />
            </Box>
            <Box sx={{ mt: { xs: 0, md: 15 } }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.dark' }}>
                Indicadores Clave
              </Typography>

              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: isMobile ? 'space-between' : 'flex-start'
              }}>
                <KeyIndicator value={totalDayAppointments} label="Consultas del día" />
                <KeyIndicator value={'--'} label="Consultas de la semana" />
                <KeyIndicator value={'--'} label="Tratamientos completados" />
                <KeyIndicator value="--" label="Eficiencia del diagnostico" />
              </Box>
            </Box>

          </Box>


          <Box sx={{ flex: 1, p:{xs:0, lg:4} }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 400, color: 'primary.dark' }}>
                Citas del {formattedDate}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => changeDate(-1)}
                >
                  Atrás
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => changeDate(1)}
                >
                  Siguiente
                </Button>
              </Stack>
            </Stack>

            <Box sx={{
              borderBottom: '1px solid',
              borderTop: '1px solid',
              borderColor: 'divider',
              py: 1
            }}>
              {loadingAppointments ? (
                <Typography sx={{ p: 2 }}>Cargando citas...</Typography>
              ) : dailyAppointments.length > 0 ? (
                dailyAppointments.map((appointment, index) => (
                  <DailyAppointment
                    key={appointment.id_cita}
                    photoSrc={`${import.meta.env.VITE_FILES_URL}${appointment.avatar_paciente}`}
                    name={`${appointment.nombre_paciente}`}
                    treatment={appointment.nombre_tratamiento}
                    time={formatTimeTo12Hour(appointment.hora_inicio)}
                    isLast={index === dailyAppointments.length - 1}
                  />
                ))
              ) : (
                <Typography sx={{ p: 2 }}>No hay citas para este día.</Typography>
              )}
            </Box>
          </Box>

        </Box>
      )}

      {(user?.rol.toLowerCase()) === "auxiliar" && (
        <>
          <Box sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 2 : 4,
            mb: 4
          }}>
            <Box sx={{ flex: 1 }}>
              <RoleBasedGreeting
                name={`${user?.nombres} ${user?.apellidos}`}
                role={user?.rol}
                photoSrc={`${import.meta.env.VITE_FILES_URL}${user?.foto_de_perfil}`}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 400, color: 'primary.dark' }}>
                  Citas por Confirmar
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => changeDate(-1)}
                  >
                    Atrás
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => changeDate(1)}
                  >
                    Siguiente
                  </Button>
                </Stack>
              </Stack>

              <Box sx={{
                borderBottom: '1px solid',
                borderTop: '1px solid',
                borderColor: 'divider',
                py: 1
              }}>
                {loadingAppointments ? (
                  <Typography sx={{ p: 2 }}>Cargando citas por confirmar...</Typography>
                ) : pendingAppointments.length > 0 ? (
                  pendingAppointments.map((appointment, index) => (
                    <PendingAppointment
                      key={appointment.id_cita}
                      photoSrc={`${import.meta.env.VITE_FILES_URL}${appointment.avatar_paciente}`}
                      name={`${appointment.nombre_paciente}`}
                      treatment={appointment.nombre_tratamiento}
                      time={formatTimeTo12Hour(appointment.hora_inicio)}
                      phone={appointment.telefono_paciente}
                      date={formattedDate}
                      doctor={appointment.nombre_doctor}
                      onConfirm={handleConfirmAppointment}
                      onCancel={handleCancelAppointment}
                      isLast={index === pendingAppointments.length - 1}
                    />
                  ))
                ) : (
                  <Typography sx={{ p: 2 }}>No hay citas por confirmar para este día.</Typography>
                )}
              </Box>
            </Box>
          </Box>

          
          {/******************************* ACTIVAR LUEGO IMPORTANTEEEEEEEE ******************************/}

          <Box sx={{
            display: 'none', // Quitar o Cambiar a 'flex' cuando se active la sección
            mb: 4,
            width: isMobile ? '100%' : '45%', // Ajuste del ancho
            alignSelf: 'flex-start' // Alineación a la izquierda
          }}>
            <Stack direction={isMobile ? 'column' : 'row'} justifyContent="space-between" alignItems={isMobile ? 'flex-start' : 'center'} spacing={2} mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Recordatorios
              </Typography>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Doctor</InputLabel>
                <Select
                  value={selectedDoctor}
                  onChange={handleDoctorChange}
                  label="Doctor"
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Box sx={{
              borderBottom: '1px solid',
              borderTop: '1px solid',
              borderColor: 'divider',
              py: 1
            }}>
              <ReminderAppointment
                photoSrc="https://randomuser.me/api/portraits/women/68.jpg"
                name="Sofía Ramírez"
                treatment="Blanqueamiento"
                time="11:45 AM"
                onAddReminder={handleAddReminder}
              />

              <ReminderAppointment
                photoSrc="https://randomuser.me/api/portraits/men/45.jpg"
                name="Carlos Sánchez"
                treatment="Extracción"
                time="02:15 PM"
                onAddReminder={handleAddReminder}
                isLast={true}
              />
            </Box>
          </Box>
        </>
      )}

    </Box>
  );
};

export default Dashboard;
