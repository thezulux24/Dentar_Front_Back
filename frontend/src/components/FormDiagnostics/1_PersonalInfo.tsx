import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import useFetch, { FetchResponse } from '../../hooks/useFetch';

// stores
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';

const formatDateForInput = (dateString?: string) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return ''; // si es inválido
  return d.toISOString().split('T')[0]; // "YYYY-MM-DD"
};

interface Props {
  formData: {
    nombres: string | null;
    apellidos: string | null;
    fecha_nacimiento: string | null;
    email: string | null;
    documento: string | null;
    direccion: string | null;
    barrio: string | null;
    ocupacion: string | null;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PersonalInfoForm: React.FC<Props> = ({ formData, onChange, onNext, onBack }) => {
  const theme = useTheme();
  const { token } = useAuthStore();
  const { openAlert } = useUIStore();
  const { fetchData } = useFetch<FetchResponse>();

  const [searchPatientTerm, setSearchPatientTerm] = useState("");
  const [patientOptions, setPatientOptions] = useState<any[]>([]);
  const [patientLoading, setPatientLoading] = useState(false);

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


  const handlePatientSelect = (_: any, newValue: any | null) => {
    if (newValue) {
      // console.log("Paciente seleccionado:", newValue);
      // Rellenar el formulario con los datos del paciente seleccionado
      onChange({ target: { name: 'nombres', value: newValue.nombres || '' } } as React.ChangeEvent<HTMLInputElement>);
      onChange({ target: { name: 'apellidos', value: newValue.apellidos || '' } } as React.ChangeEvent<HTMLInputElement>);
      onChange({ target: { name: 'fecha_nacimiento', value: newValue.fecha_nacimiento || '' } } as React.ChangeEvent<HTMLInputElement>);
      onChange({ target: { name: 'email', value: newValue.correo || '' } } as React.ChangeEvent<HTMLInputElement>);
      onChange({ target: { name: 'documento', value: newValue.identificacion || '' } } as React.ChangeEvent<HTMLInputElement>);
      onChange({ target: { name: 'direccion', value: newValue.direccion || '' } } as React.ChangeEvent<HTMLInputElement>);
      onChange({ target: { name: 'barrio', value: newValue.barrio || '' } } as React.ChangeEvent<HTMLInputElement>);
      onChange({ target: { name: 'ocupacion', value: newValue.ocupacion || '' } } as React.ChangeEvent<HTMLInputElement>);
    } else {
      onChange({ target: { name: 'nombres', value: '' } } as React.ChangeEvent<HTMLInputElement>);
      onChange({ target: { name: 'apellidos', value: '' } } as React.ChangeEvent<HTMLInputElement>);
      onChange({ target: { name: 'fecha_nacimiento', value: '' } } as React.ChangeEvent<HTMLInputElement>);
      onChange({ target: { name: 'email', value: '' } } as React.ChangeEvent<HTMLInputElement>);
      onChange({ target: { name: 'documento', value: '' } } as React.ChangeEvent<HTMLInputElement>);
      onChange({ target: { name: 'direccion', value: '' } } as React.ChangeEvent<HTMLInputElement>);
      onChange({ target: { name: 'barrio', value: '' } } as React.ChangeEvent<HTMLInputElement>);
      onChange({ target: { name: 'ocupacion', value: '' } } as React.ChangeEvent<HTMLInputElement>);
    }
  };
  return (
    <Box component="form" noValidate autoComplete="off" sx={{p:1}}>
      

      <Typography variant="subtitle1" mt={2} mb={2} fontWeight="medium" color={theme.palette.primary.dark}>Información personal</Typography>
      <Grid container spacing={2}>
        <Grid size={{xs:12, sm:12}}>
          <Autocomplete
            fullWidth
            options={patientOptions}
            getOptionLabel={(option) => `${option.correo ? option.correo + " - " : ""}${option.nombres || ""} ${option.apellidos || ""} ${option.documento ? "- " + option.identificacion : ""}`.trim()}
            loading={patientLoading}
            onInputChange={(_, newInputValue) => {
                setSearchPatientTerm(newInputValue);
                // searchPatients(newInputValue);
            }}
            onChange={ handlePatientSelect }
            renderInput={(params) => (
            <TextField
                {...params}
                label={ "Buscar paciente por nombre, correo o identificación" }
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
            noOptionsText={searchPatientTerm.length < 3 ? "Escribe al menos 3 caracteres" : "No se encontraron pacientes"}
          />
        </Grid>
        <Grid size={{xs:12, sm:6}}>
          <TextField label="Nombres" name="nombres" fullWidth value={formData.nombres || ''} onChange={onChange} placeholder="Ej: Juan" />
        </Grid>
        <Grid size={{xs:12, sm:6}}>
          <TextField label="Apellidos" name="apellidos" fullWidth value={formData.apellidos || ''} onChange={onChange} placeholder="Ej: Perez" />
        </Grid>
        <Grid size={{xs:12, sm:6}}>
          <TextField type='date' label="Fecha de nacimiento" name="fecha_nacimiento" fullWidth value={formatDateForInput(formData.fecha_nacimiento || undefined)} onChange={onChange} />
        </Grid>
        <Grid size={{xs:12, sm:6}}>
          <TextField label="Email" name="email" fullWidth value={formData.email || ''} onChange={onChange} placeholder="Ej: @gmail.com"  disabled/>
        </Grid>
        <Grid size={{xs:12, sm:6}}>
          <TextField label="Documento de Identidad No." name="documento" fullWidth value={formData.documento || ''} onChange={onChange} placeholder="Ej: (RC)(TI)(CC)(CE)" />
        </Grid>
        <Grid size={{xs:12, sm:6}}>
          <TextField label="Dirección" name="direccion" fullWidth value={formData.direccion || ''} onChange={onChange} placeholder="Ej: Carrera, Calle" />
        </Grid>
        <Grid size={{xs:12, sm:6}}>
          <TextField label="Barrio" name="barrio" fullWidth value={formData.barrio || ''} onChange={onChange} placeholder="Ej: Barrio" />
        </Grid>
        <Grid size={{xs:12, sm:6}}>
          <TextField label="Ocupación" name="ocupacion" fullWidth value={formData.ocupacion || ''} onChange={onChange} placeholder="Ej: Barrio" />
        </Grid>
      </Grid>

      <Box mt={4} display="flex" justifyContent="space-around">
        <Button variant="outlined" onClick={onBack} sx={{width:'200px', maxWidth:'45%'}}>Atrás</Button>
        <Button 
          variant="contained" 
          onClick={onNext} 
          sx={{width:'200px', maxWidth:'45%'}} 
          disabled = {!(formData.email && formData.nombres && formData.apellidos && formData.documento)}
        >
          Siguiente
        </Button>
      </Box>
    </Box>
  );
};

export default PersonalInfoForm;
