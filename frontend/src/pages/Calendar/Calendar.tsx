import { } from "../../components/imports";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  Divider,
  Button,
} from '@mui/material';
import Weekly from "./Weekly";
import Daily from "./Daily";

import EventDialog from "../../components/Modals/ConfigEventModal";

import useFetch, { FetchResponse } from '../../hooks/useFetch';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';

// utils
import {
  validateDateFormat,
  getCurrentYear,
  // formatTimeTo12Hour 
} from "../../utils/DatesUtils";

// types
import { Appointment } from "../../types";

const months = [
  'Enero', 'Febrero', 'Marzo',
  'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre',
  'Octubre', 'Noviembre', 'Diciembre',
];

const Calendar = () => {
  const [monthSelected, setMonthSelected] = useState("");
  const [tabIndex, setTabIndex] = useState(1); // semanal seleccionado por defecto
  const [open, setOpen] = useState(false);
  const [isModification, setIsModification] = useState(false);
  const [needUpdate, setNeedUpdate] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "", // hoy por defecto
    end: "", // mañana
  });

  const [dayAppointments, setDayAppointments] = useState<Appointment[]>([]);
  const [weekAppointments, setWeekAppointments] = useState<Appointment[]>([]);

  const { fetchData, loading: fectchAppointmentsLoading } = useFetch<FetchResponse>();
  const { token, user } = useAuthStore();
  const { openAlert } = useUIStore();

  const fetchUrl = useMemo(() => {
    const base = import.meta.env.VITE_BACKEND_URL;
    if (user?.rol === "paciente") {
      return `${base}/citas/paciente`;
    }
    return `${base}/citas`;
  }, [user?.rol]);

  useEffect(() => {
    const fecha = new Date();
    const mesActual = months[fecha.getMonth()]; // getMonth devuelve 0–11
    setMonthSelected(mesActual);
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleOpen = (isMod: boolean = false, data:Appointment | null = null) => {
    setOpen(true);
    setIsModification(isMod)
    if(data) setSelectedAppointment(data)
  }

  const fetchEvents = useCallback(async (fecha_inicio: string, fecha_fin: string, setState: any) => {
    try {
      setLoading(true);

      // Validar fechas
      const valid_fecha_inicio = validateDateFormat(fecha_inicio);
      const valid_fecha_fin = validateDateFormat(fecha_fin);

      if (!valid_fecha_inicio || !valid_fecha_fin) {
        throw new Error("Formato de fechas de consulta inválido");
      }

      // Preparo parámetros de consulta
      const fetch_params: any = {
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin,
        pagina: 1,
        cantidad_por_pagina: 50
      }

      //Agrego parámetros según el rol
      if (user?.rol == 'doctor'){
        fetch_params.id_odontologo = user.id;
      }

      const response = await fetchData({
        url: fetchUrl,
        method: 'GET',
        params: fetch_params,
        token: token
      });

      if (!response?.success) throw new Error("Error al obtener las citas");

      if(response.success && response.data?.citas){
        const appointments = response.data.citas;
        // console.log('Citas obtenidas:', appointments);
        setState(appointments || []);
      }

    } catch (err) {
      console.error(err);
      openAlert(`${err}`, "error");
    } finally {
      setNeedUpdate(false);
      setLoading(false);
    }
  }, [token, fetchData, openAlert]);

  // Consulta de citas
  useEffect(() => {    
    // console.log('tabIndex', tabIndex, 'dateRange', dateRange)
    let setState = null
    if(tabIndex === 0) setState = setDayAppointments;
    if(tabIndex === 1) setState = setWeekAppointments;
    if(!setState) return;

    if ((tabIndex === 0 || tabIndex === 1)&& validateDateFormat(dateRange.start) && validateDateFormat(dateRange.end)) {
      fetchEvents(dateRange.start, dateRange.end, setState);
    }
  }, [dateRange, needUpdate, fetchEvents]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box maxWidth="sm" sx={{ p: 2, minWidth: '45%' }}>
        <Typography variant="h5">
          Calendario
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" sx={{ fontSize: '1rem' }} gutterBottom>
          Aquí tienes todas tus citas {tabIndex === 0 ? "del día" : tabIndex === 1 ? "de la semana" : "del mes"}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' } }}>
          <Tabs value={tabIndex} onChange={handleTabChange} /* indicatorColor="secondary" */>
            <Tab label="Diario" disabled={fectchAppointmentsLoading}/>
            <Tab label="Semanal" disabled={fectchAppointmentsLoading}/>
            <Tab label="Mensual" disabled={fectchAppointmentsLoading}/>
          </Tabs>

          {
            tabIndex !== 2 &&
            <Button onClick={() => handleOpen(false)} variant="contained" size="small" sx={{ mb: 1.5, mt: { xs: 1.5, sm: 0 } }} aria-label="nuevo">Agendar cita</Button>
          }

        </Box>


        <Divider /* variant="middle" */ sx={{ borderBottomWidth: 2 }} />

        {tabIndex === 2 && (
          <>
            <Box mt={3} mb={2}>
              <Typography align="center" variant="h6" color="textSecondary">
                2025
              </Typography>
              <Divider />
            </Box>
            <Grid container spacing={2}>
              {months.map((month) => (

                <Grid key={month} size={{ xs: 12, sm: 4 }}>
                  <Box
                    onClick={() => { setMonthSelected(month); setTabIndex(1) }}
                    sx={{
                      backgroundColor: '#ffffff',
                      color: '#E32780',

                      //textAlign: 'center',
                      height: 100,
                      padding: 2,
                      borderRadius: 2,
                      border: '1px solid #777777',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#ebebeb',
                      },
                    }}
                  >
                    <Typography>{month}</Typography>
                  </Box>
                </Grid>

              ))}
            </Grid>
          </>
        )}
        {tabIndex === 1 && (
          <Weekly
            month={monthSelected}
            year={getCurrentYear()}
            handleOpen={handleOpen}
            loading={loading}
            events={weekAppointments}
            setDateRange={setDateRange}
          />
        )}
        {tabIndex === 0 && (
          <Daily
            handleOpen={handleOpen}
            loading={loading}
            events={dayAppointments}
            setDateRange={setDateRange} 
          />
        )}


        <EventDialog 
          open={open} 
          setOpen={setOpen} 
          updateData={() => setNeedUpdate(true)}
          isPatient={false} 
          isModification={isModification} 
          appointmentData={selectedAppointment}
        />
      </Box>
    </Box>

  );
}

export default Calendar