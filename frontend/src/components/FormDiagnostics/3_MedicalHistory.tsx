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
    condiciones_previas: string | null;
    alergias: string | null;
    medicamentos_actuales: string | null;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  onBack: () => void;
}

const MedicalHistoryForm: React.FC<Props> = ({ formData, onChange, onNext, onBack }) => {
    const theme = useTheme();
  return (
    <Box component="form" noValidate autoComplete="off" sx={{p:1}}>
      

      <Typography variant="subtitle1" mt={2} mb={2} fontWeight="medium" color={theme.palette.primary.dark}>Historial médico</Typography>
      <Grid container spacing={2}>
        <Grid size={{xs:12, sm:6}}>
          <TextField label="Condiciones médicas previas" name="condiciones_previas" fullWidth value={formData.condiciones_previas || ''} onChange={onChange} placeholder="Ej: Diabetes, hipertensión" />
        </Grid>
        <Grid size={{xs:12, sm:6}}>
          <TextField label="Alergias" name="alergias" fullWidth value={formData.alergias || ''} onChange={onChange} placeholder="Ej: Penicilina, látex" />
        </Grid>
        <Grid size={{xs:12, sm:6}}>
          <TextField label="Medicamentos actuales" name="medicamentos_actuales" fullWidth value={formData.medicamentos_actuales || ''} onChange={onChange} placeholder="Ej: Ibuprofeno, Metformina" />
        </Grid>
      </Grid>

      <Box mt={4} display="flex" justifyContent="space-around">
        <Button variant="outlined" onClick={onBack} sx={{width:'200px', maxWidth:'45%'}}>Atrás</Button>
        <Button variant="contained" onClick={onNext} sx={{width:'200px', maxWidth:'45%'}}>Siguiente</Button>
      </Box>
    </Box>
  );
};

export default MedicalHistoryForm;
