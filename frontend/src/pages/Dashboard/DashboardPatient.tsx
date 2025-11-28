import { useEffect, useState } from 'react';
import { 
  Box, 
  useTheme,
  useMediaQuery,
  Typography,
  Tabs,
  Tab
} from '@mui/material';
import { RoleBasedGreeting, PatientAppointment, DentalTreatmentCard } from "../../components/imports";
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';
import useFetch, { FetchResponse } from '../../hooks/useFetch';

// utils
import { 
  validateDateFormat,
  getStartOfDay,
  getEndOfDay,
  getStartOfWeek,
  getEndOfWeek,
  formatTimeTo12Hour
} from '../../utils/DatesUtils';

// types
import { Appointment } from '../../types';

const DashboardPatient = () => {
  const { user } = useAuthStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);
  const dates = {
    start_day_date: getStartOfDay(),
    end_day_date: getEndOfDay(),
    start_week_date: getStartOfWeek(),
    end_week_date: getEndOfWeek()
  }

  const [dayAppointments, setDayAppointments] = useState<Appointment[]>([]);
  const [weekAppointments, setWeekAppointments] = useState<Appointment[]>([]);

  const { fetchData, clearData } = useFetch<FetchResponse>();
  const { token } = useAuthStore();
  const { openAlert } = useUIStore();

  useEffect( () => {
    clearData();
    console.log(user)

    if(activeTab === 0) { // Pestaña citas de hoy
      getAppointments(dates.start_day_date, dates.end_day_date, setDayAppointments)
    }
    else if (activeTab === 1){ // Pestaña citas de esta semana
      getAppointments(dates.start_week_date, dates.end_week_date, setWeekAppointments)
    }

  }, [activeTab])

  const getAppointments = async( 
    start_date: string,
    end_date: string,
    setState: any
   ) => {

    try {
      // Validar fechas
      const valid_fecha_inicio = validateDateFormat(start_date);
      const valid_fecha_fin = validateDateFormat(end_date);

      if ( !valid_fecha_inicio || ! valid_fecha_fin) {
        throw new Error("Formato de fechas de consulta inválido");
      }

      // Organizar parámetros de la petición
      const fetch_params = {
        fecha_inicio: start_date,
        fecha_fin: end_date,
        pagina: 1,
        cantidad_por_pagina: 20
      }

      // Se envía la petición
      const response = await fetchData({
        url: `${import.meta.env.VITE_BACKEND_URL}/citas/paciente`,
        method: 'GET',
        params: fetch_params,
        token: token
      });

      if(response.success && response.data?.citas){
        const appointments = response.data.citas;
        setState(appointments)
      }
      else {
        throw new Error("Ha ocurrido un error");
      }
    } catch (error) {
      console.error(error)
      openAlert(`${error}`, "error"); // NOTA: para no incluir "Error:" usar -> ${error?.message}
    } finally {
      // setIsLoading(false);
    }
  }

  const treatments = [
    {
      image: "https://images.unsplash.com/photo-1684607632041-32d729cdee35?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Limpieza Dental",
      description: "Remoción de placa y sarro para prevenir caries",
      buttonText: "Ver detalles"
    },
    {
      image: "https://images.unsplash.com/photo-1684607632829-1e5bf4f21dab?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Ortodoncia",
      description: "Tratamiento para alinear los dientes",
      buttonText: "Ver progreso"
    }
  ];

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box component="main" sx={{ p: isMobile ? 2 : 3 }}>
      <Box sx={{ 
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 4,
        mb: 4,
        alignItems: 'flex-start'
      }}>
        <Box sx={{ flex: 1, px: isMobile ? 0 : 5 }}>
          <RoleBasedGreeting 
            name={user?.nombres || "Paciente"}
            role="paciente" 
            photoSrc={`${import.meta.env.VITE_FILES_URL}${user?.foto_de_perfil}`}  
          />
          
          <Box sx={{ mt: 4, width: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Mis Citas
            </Typography>

            <Tabs 
              value={activeTab} 
              onChange={handleChangeTab}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons="auto"
              sx={{ mb: 3 }}
            >
              <Tab label="Hoy" />
              <Tab label="Esta semana" />
            </Tabs>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {activeTab === 0 && dayAppointments.length > 0 && 
              dayAppointments.map((appointment, index) => (
                <PatientAppointment
                  key={index}
                  doctorPhotoSrc={`${import.meta.env.VITE_FILES_URL}${appointment.avatar_doctor}`}
                  doctorName={appointment.nombre_doctor}
                  treatment={appointment.motivo}
                  time={formatTimeTo12Hour(appointment.hora_inicio) || '--'}
                  location={appointment.fecha}
                  isLast={index === dayAppointments.length - 1}
                />
              ))}

              {activeTab === 1 && weekAppointments.map((appointment, index) => (
                <PatientAppointment
                  key={index}
                  doctorPhotoSrc={`${import.meta.env.VITE_FILES_URL}${appointment.avatar_doctor}`}
                  doctorName={appointment.nombre_doctor}
                  treatment={appointment.motivo}
                  time={formatTimeTo12Hour(appointment.hora_inicio) || '--'}
                  location={appointment.fecha}
                  isLast={index === dayAppointments.length - 1}
                />
              ))}

              {((activeTab === 0 && dayAppointments.length === 0) ||
                (activeTab === 1 && weekAppointments.length === 0)) && (
                <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
                  No tienes citas programadas
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ 
          flex: 1,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          p: 2,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 400, mb: 2 }}>
            Tratamientos
          </Typography>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
            gap: 2,
            placeItems: 'center',
          }}>
            {treatments.map((treatment, index) => (
              <Box key={index}>
                <DentalTreatmentCard
                  image={treatment.image}
                  title={treatment.title}
                  description={treatment.description}
                  buttonText={treatment.buttonText}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPatient;
