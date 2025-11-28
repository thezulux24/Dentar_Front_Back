import React, { useState, useEffect } from 'react';
import { Autocomplete, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    Box,
    Typography,
    TextField,
    CircularProgress
} from '@mui/material';
import useFetch, { FetchResponse } from '../../hooks/useFetch';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';

import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');


// types
import { Appointment } from '../../types';

const EventDialog = (
    { 
        open = false, 
        setOpen, 
        updateData = () => {}, 
        isPatient = false, 
        isModification = false,
        appointmentData = null // Nuevo prop para los datos de la cita existente
    }
    : 
    { 
        open: boolean; 
        setOpen: any, 
        updateData: any, 
        isPatient: boolean, 
        isModification: boolean,
        appointmentData?: Appointment | null // Datos de la cita para modificación
    }
) => {

    const [title, setTitle] = useState("Cita de control");
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [startTime, setStartTime] = useState<Dayjs | null>(dayjs().hour(9).minute(0));
    const [endTime, setEndTime] = useState<Dayjs | null>(dayjs().hour(10).minute(0));
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    // Estados de control de listas de doctores y pacientes
    const [patientName, setPatientName] = React.useState("");
    const [doctorName, setDoctorName] = React.useState("");
    const [patientOptions, setPatientOptions] = React.useState<any[]>([]);
    const [doctorOptions, setDoctorOptions] = React.useState<any[]>([]);
    const [patientLoading, setPatientLoading] = React.useState(false);
    const [doctorLoading, setDoctorLoading] = React.useState(false);
    const [selectedPatient, setSelectedPatient] = React.useState<any>(null);
    const [selectedDoctor, setSelectedDoctor] = React.useState<any>(null);

    const [searchPatientTerm, setSearchPatientTerm] = useState("");
    const [searchDoctorTerm, setSearchDoctorTerm] = useState("");

    const [appointmentsStates, setAppointmentsStates] = useState<any[]>([]);
    const [selectedState, setSelectedState] = useState<string>("");

    const { fetchData} = useFetch<FetchResponse>();
    const { fetchData: fetchUpdate } = useFetch<FetchResponse>();
    const { fetchData: fetchCancel } = useFetch<FetchResponse>();
    const { fetchData: fetchParameters } = useFetch<FetchResponse>();

    const { token, user } = useAuthStore();
    const { openAlert } = useUIStore();

    // Efecto para cargar los datos cuando es una modificación
    useEffect(() => {
        if (isModification && appointmentData) {
            console.log('Datos de la cita para modificar:', appointmentData);
            // Cargar los datos existentes en los campos
            setTitle(appointmentData.motivo || "Cita de control");
            setDate(appointmentData.fecha ? dayjs(appointmentData.fecha) : dayjs());
            
            if (appointmentData.hora_inicio) {
                const [hours, minutes] = appointmentData.hora_inicio.split(':').map(Number);
                setStartTime(dayjs().hour(hours).minute(minutes));
            }
            
            if (appointmentData.hora_fin) {
                const [hours, minutes] = appointmentData.hora_fin.split(':').map(Number);
                setEndTime(dayjs().hour(hours).minute(minutes));
            }
            
            setNotes(appointmentData.observaciones || "");

            // Cargar paciente si existe
            if (appointmentData.id_paciente && appointmentData.nombre_paciente) {
                const pacienteObj = {
                    id: appointmentData.id_paciente,
                    nombres: appointmentData.nombre_paciente.split(" ")[0] || appointmentData.nombre_paciente,
                    apellidos: appointmentData.nombre_paciente.split(" ").slice(1).join(" ") || ""
                };
                setSelectedPatient(pacienteObj);
                setPatientName(`${appointmentData.nombre_paciente}`);
            } else {
                setSelectedPatient(null);
                setPatientName("");
            }

            // Cargar doctor si existe
            if (appointmentData.id_doctor && appointmentData.nombre_doctor) {
                const doctorObj = {
                    id: appointmentData.id_doctor,
                    nombres: appointmentData.nombre_doctor.split(" ")[0] || appointmentData.nombre_doctor,
                    apellidos: appointmentData.nombre_doctor.split(" ").slice(1).join(" ") || ""
                };
                setSelectedDoctor(doctorObj);
                setDoctorName(`${appointmentData.nombre_doctor}`);
            }
            else {
                setSelectedDoctor(null);
                setDoctorName("");
            }
        } else {
            // Resetear a valores por defecto cuando no es modificación
            setTitle("Cita de control");
            setDate(dayjs());
            setStartTime(dayjs().hour(9).minute(0));
            setEndTime(dayjs().hour(10).minute(0));
            setNotes("");
        
            setSelectedPatient(null);
            setSelectedDoctor(null);
            setPatientName("");
            setDoctorName("");
        }
    }, [isModification, appointmentData, open]); // Se ejecuta cuando cambian estos valores

    const handleClose = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setOpen(false);
    };

    // recalcular hora fin automáticamente
    useEffect(() => {
        if (startTime && !isModification) { // Solo recalcular si no es modificación
            setEndTime(startTime.add(1, "hour"));
        }
    }, [startTime, isModification]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!title || !date || !startTime || !endTime || !notes) {
            alert("Por favor completa todos los campos obligatorios");
            return;
        }

        // En la función handleSubmit, modifica el objeto cita:
        const cita: any = {
            motivo: title,
            fecha_cita: date.format("YYYY-MM-DD"),
            hora_inicio_cita: startTime.format("HH:mm"),
            hora_fin_cita: endTime.format("HH:mm"),
            observaciones: notes
        };

        // Agrega el paciente seleccionado si es doctor
        if (user?.rol === 'doctor' && selectedPatient) {
            cita.id_odontologo = user?.id;
            cita.id_paciente = selectedPatient.id;
        }

        // Agrega el doctor seleccionado si es auxiliar
        if (user?.rol === 'auxiliar') {
            cita.id_auxiliar = user?.id;
            cita.id_odontologo =  selectedDoctor ? selectedDoctor.id : null;
            cita.id_paciente = selectedPatient ? selectedPatient.id : null;
        }

        // Agrega el id de paciente si el rol es paciente
        if(user?.rol == 'paciente'){
            cita.id_paciente = user?.id;
        }

        try {
            setLoading(true);

            // Se envía la petición
            const response = await fetchData({
                url: `${import.meta.env.VITE_BACKEND_URL}/citas`,
                method: 'POST',
                body: JSON.stringify(cita),
                token: token
            });

            if (!response.success) throw new Error("Error al crear la cita");

            updateData();
            handleClose();
            openAlert("Cita creada exitosamente", "success");
        } catch (err) {
            console.error(err);
            openAlert(`${err}`, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!title || !date || !startTime || !endTime || !notes) {
            alert("Por favor completa todos los campos obligatorios");
            return;
        }

        const cita: any = {
            fecha_cita: date.format("YYYY-MM-DD"),
            hora_inicio_cita: startTime.format("HH:mm"),
            hora_fin_cita: endTime.format("HH:mm"),
            motivo: title,
            observaciones: notes,
        };

        // Construyo la url según el rol y los parámetros
        let fetch_url = '';
        const base = import.meta.env.VITE_BACKEND_URL;
        if (user?.rol === "paciente") {
            fetch_url = `${base}/citas/paciente/actualizar/${appointmentData?.id_cita}`;
        }else {
            fetch_url = `${base}/citas/${appointmentData?.id_cita}`;

            // Agrego el estado si es diferente de vacío
            if (selectedState) {
                cita.id_parametro_estado_cita = selectedState;
            }

            // Agrega el doctor seleccionado si es auxiliar
            if (user?.rol === 'auxiliar') {
                cita.id_auxiliar = user?.id;
                cita.id_odontologo =  selectedDoctor ? selectedDoctor.id : null;
            }

        }

        try {
            setLoading(true);

            // Se envía la petición de actualización
            const response = await fetchUpdate({
                url: fetch_url,
                method: 'PATCH',
                body: JSON.stringify(cita),
                token: token
            });

            if (!response.success) throw new Error("Error al actualizar los datos de la cita");

            updateData();
            handleClose();
            openAlert("Cita actualizada exitosamente", "success");
        } catch (err) {
            console.error(err);
            openAlert(`${err}`, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!appointmentData?.id_cita) {
            openAlert("No se puede cancelar la cita: ID no disponible", "error");
            return;
        }

        // Construyo la url según el rol y los parámetros
        let fetch_url = '';
        const base = import.meta.env.VITE_BACKEND_URL;
        if (user?.rol === "paciente") {
            fetch_url = `${base}/citas/paciente/cancelar/${appointmentData.id_cita}`;
        }else {
            fetch_url = `${base}/citas/cancelar/${appointmentData.id_cita}`;
        }

        try {
            setLoading(true);
            
            const response = await fetchCancel({
                url: fetch_url,
                method: 'PATCH',
                token: token
            });

            if (!response.success) throw new Error("Error al cancelar la cita");

            updateData();
            handleClose();
            openAlert("Cita cancelada exitosamente", "success");
        } catch (err) {
            console.error(err);
            openAlert(`${err}`, "error");
        } finally {
            setLoading(false);
        }
    };

    // Función para buscar pacientes
    const searchPatients = async (searchTerm: string) => {
        if (searchTerm.length < 3) {
            setPatientOptions([]);
            return;
        }

        try {
            setPatientLoading(true);
            const response = await fetchData({
                url: `${import.meta.env.VITE_BACKEND_URL}/pacientes?buscar=${encodeURIComponent(searchTerm)}`,
                method: 'GET',
                token: token
            });

            if (response.success && response.data?.pacientes) {
                setPatientOptions(response.data?.pacientes);
            }
        } catch (err) {
            console.error('Error buscando pacientes:', err);
            openAlert("Error al buscar pacientes", "error");
        } finally {
            setPatientLoading(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            searchPatients(searchPatientTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchPatientTerm]);

    // Función para buscar doctores
    const searchDoctors = async (searchTerm: string) => {
        // if (searchTerm.length < 3) {
        //     setDoctorOptions([]);
        //     return;
        // }

        try {
            setDoctorLoading(true);
            // CAMBIA ESTA URL POR LA CORRECTA DE TU BACKEND
            const response = await fetchData({
                url: `${import.meta.env.VITE_BACKEND_URL}/odontologos?buscar=${encodeURIComponent(searchTerm)}`,
                method: 'GET',
                token: token
            });

            if (response.success && response.data?.odontologos) {
                console.log('Doctores encontrados:', response.data.odontologos);
                setDoctorOptions(response.data.odontologos);
            }
        } catch (err) {
            console.error('Error buscando doctores:', err);
            openAlert("Error al buscar doctores", "error");
        } finally {
            setDoctorLoading(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            searchDoctors(searchPatientTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchDoctorTerm]);
    

    // Función para consultar estados de las citas
    const getAppointmentsStates = async () => {
        try {
            setDoctorLoading(true);
                const response = await fetchParameters({
                url: `${import.meta.env.VITE_BACKEND_URL}/parametros?tipo_parametro=estado_de_cita`,
                method: 'GET'
            });

            if (response.success && response.data?.parametros) {
                // console.log('Estados de citas obtenidos:', response.data.parametros);
                setAppointmentsStates(response.data.parametros);
            }
        } catch (err) {
            console.error('Error buscando doctores:', err);
            openAlert("Error al buscar doctores", "error");
        } finally {
            setDoctorLoading(false);
        }
    };

    // Efecto para cargar los estados de las citas al montar el componente
    useEffect(() => {
        getAppointmentsStates();
    }, []);

    useEffect(() => {
        if (isModification && appointmentData) {
            setSelectedState(appointmentData.id_parametro_estado_cita || "");
        } else {
            setSelectedState("");
        }
    }, [isModification, appointmentData, open]);

    return (
        <React.Fragment>
            <Dialog
                fullWidth
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        component: "form",
                        onSubmit: isModification ? handleUpdate : handleSubmit
                    }
                }}
            >
                <DialogTitle>
                    {isModification ? "Modificar cita" : isPatient ? "Pedir cita" : "Nuevo evento"}
                </DialogTitle>
                <Box sx={{ px: 4, pt: 0 }}>
                    {isModification && (
                        <Button 
                            variant="outlined" 
                            onClick={handleCancel} 
                            sx={{ mb: 4, mt: 0 }}
                            color="error"
                            disabled={loading}
                        >
                            Cancelar cita
                        </Button>
                    )}

                    <TextField
                        fullWidth
                        label="Título"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ mb: 2 }}
                        required
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]} sx={{ mb: 3, width: "100%" }}>
                            <DatePicker
                                label="Fecha"
                                format="DD-MM-YYYY"
                                value={date}
                                onChange={(newDate) => setDate(newDate)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true
                                    }
                                }}
                            />
                        </DemoContainer>
                    </LocalizationProvider>

                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileTimePicker
                                label="Hora inicio"
                                value={startTime}
                                onChange={(newTime) => setStartTime(newTime)}
                                slotProps={{
                                    textField: {
                                        sx: {
                                            flex: 1
                                        }
                                    }
                                }}
                            />
                        </LocalizationProvider>
                        <Typography variant="body1" fontWeight="bold">
                            →
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileTimePicker
                                label="Hora Fin"
                                value={endTime}
                                onChange={isModification ? (newTime) => setEndTime(newTime) : undefined}
                                readOnly={!isModification} // Solo editable en modificación
                                slotProps={{
                                    textField: {
                                        sx: {
                                            flex: 1
                                        }
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Box>

                    <TextField
                        fullWidth
                        label="Notas"
                        placeholder="Añadir descripción"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        sx={{ mb: 2 }}
                        required
                        multiline
                        rows={3}
                    />

                    {/* SELECCIÓN DE ESTADO (SOLO PARA MODIFICACIÓN Y NO PACIENTE) */}         
                    { isModification && user?.rol !== 'paciente' && (
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="estado-label">Estado de la cita</InputLabel>
                            <Select
                                labelId="estado-label"
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                label="Estado de la cita"
                            >
                                {appointmentsStates.map((estado: any) => (
                                    <MenuItem key={estado.id_parametro} value={estado.id_parametro}>
                                        {estado.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    {/* SELECCIÓN DE DOCTOR O PACIENTE */}
                    {(user?.rol === 'doctor' || user?.rol === 'auxiliar') && (
                    <Autocomplete
                        fullWidth
                        disabled = {isModification}
                        options={patientOptions}
                        value={selectedPatient}
                        getOptionLabel={(option) => `${option.nombres} ${option.apellidos}`}
                        loading={patientLoading}
                        onInputChange={(_, newInputValue) => {
                            setPatientName(newInputValue);
                            setSearchPatientTerm(newInputValue);
                            // searchPatients(newInputValue);
                        }}
                        onChange={(_, newValue) => {
                            setSelectedPatient(newValue);
                        }}
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            label={ patientName && patientName !== "" ? "Paciente" : "Seleccionar paciente *" }
                            sx={{ mb: 2 }}
                            InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                {patientLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                            }}
                        />
                        )}
                        noOptionsText={patientName.length < 3 ? "Escribe al menos 3 caracteres" : "No se encontraron pacientes"}
                    />
                    )}

                    {user?.rol === 'auxiliar' && (
                    <Autocomplete
                        fullWidth
                        options={doctorOptions}
                        value={selectedDoctor}
                        getOptionLabel={(option) => `Dr. ${option.nombres} ${option.apellidos}`}
                        loading={doctorLoading}
                        onInputChange={(_, newInputValue) => {
                            setDoctorName(newInputValue);
                            setSearchDoctorTerm(newInputValue);
                            // searchDoctors(newInputValue);
                        }}
                        onChange={(_, newValue) => {
                            setSelectedDoctor(newValue);
                        }}
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            label={ doctorName && doctorName !== "" ? "Odontólogo" : "Seleccionar odontólogo" }
                            sx={{ mb: 2 }}
                            InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                {doctorLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                            }}
                        />
                        )}
                        noOptionsText={"No se encontraron doctores"}
                    />
                    )}

                </Box>
                <DialogActions sx={{ px: 4, pb: 4 }}>
                    <Button variant="outlined" onClick={handleClose} disabled={loading}>
                        {isModification ? "Atrás" : "Cancelar"}
                    </Button>
                    <Button variant="contained" type="submit"
                        disabled={loading || !selectedPatient}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}>
                        {isModification ? "Actualizar" : "Guardar"}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default EventDialog;