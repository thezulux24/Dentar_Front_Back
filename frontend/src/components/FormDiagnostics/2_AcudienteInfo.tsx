import React from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  useTheme
} from '@mui/material';

interface Props {
  formData: {
    ocupacion: string | null;
    nombre_acudiente: string | null;
    apellido_acudiente: string | null;
    tel_acudiente: string | null;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  onBack: () => void;
}

const AcudienteInfoForm: React.FC<Props> = ({ formData, onChange, onNext, onBack }) => {
    const theme = useTheme();
  return (
    <Box component="form" noValidate autoComplete="off" sx={{p:1}}>
      

      <Typography variant="subtitle1" mt={2} mb={2} fontWeight="medium" color={theme.palette.primary.dark}>Información personal</Typography>
      <Grid container spacing={2}>     
        <Grid size={{xs:12, sm:6}}>
          <TextField label="Nombre de acudiente" name="nombre_acudiente" fullWidth value={formData.nombre_acudiente || ''} onChange={onChange} placeholder="Ej: Primer Nombre" />
        </Grid>
        <Grid size={{xs:12, sm:6}}>
          <TextField label="Apellido acudiente" name="apellido_acudiente" fullWidth value={formData.apellido_acudiente || ''} onChange={onChange} placeholder="Ej: Apellido" />
        </Grid>
        <Grid size={{xs:12, sm:6}}>
          <TextField label="Tel/Cel de acudiente" name="tel_acudiente" fullWidth value={formData.tel_acudiente || ''} onChange={onChange} placeholder="Ej: +57" />
        </Grid>
        <Grid size={{xs:12, sm:6}}>
          <TextField label="Ocupación" name="ocupacion" fullWidth value={formData.ocupacion || ''} onChange={onChange} placeholder="Ej: Estudio, trabajo, hogar" />
        </Grid>
      </Grid>

      <Box mt={4} display="flex" justifyContent="space-around">
        <Button variant="outlined" onClick={onBack} sx={{width:'200px', maxWidth:'45%'}}>Atrás</Button>
        <Button variant="contained" onClick={onNext} sx={{width:'200px', maxWidth:'45%'}}>Siguiente</Button>
      </Box>
    </Box>
  );
};

export default AcudienteInfoForm;
