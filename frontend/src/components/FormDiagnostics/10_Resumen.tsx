import React from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  useTheme
} from '@mui/material';

interface Props {
  formData: {
    notas_medico: string | null;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ResumenForm: React.FC<Props> = ({
  formData,
  onChange,
  onNext,
  onBack
}) => {

  const theme = useTheme()
  return (

    <Box component="form" noValidate autoComplete="off" sx={{ p: 1 }}>


      <Typography variant="subtitle1" color={theme.palette.primary.dark} mb={1}>
        Resumen de tratamiento
      </Typography>
      <Typography variant="body1" mb={0.5}>
        <strong>Tratamiento:</strong> Blanqueamiento dental
      </Typography>
      <Typography variant="body1" mb={2}>
        <strong>Opciones:</strong> Blanco brillante
      </Typography>

      {/* Vista previa antes y después */}
      <Typography variant="subtitle1" color={theme.palette.primary.dark} mb={2}>
        Vista previa antes y después
      </Typography>

      <Grid container spacing={2} justifyContent="center" alignItems="center" mb={3}>
        <Grid size={{xs:6}} textAlign="center">
          <img
            src={`${import.meta.env.BASE_URL}images/image1.png`} // reemplaza
            alt="Antes"
            style={{ width: '100%', borderRadius: '8px' }}
          />
          <Typography mt={1}>Antes</Typography>
        </Grid>
        <Grid size={{xs:6}} textAlign="center">
          <img
            src={`${import.meta.env.BASE_URL}images/image2.png`} // reemplazar
            alt="Después"
            style={{ width: '100%', borderRadius: '8px' }}
          />
          <Typography mt={1}>Después</Typography>
        </Grid>
      </Grid>

      {/* Notas del médico */}
      <Typography variant="subtitle1" color={theme.palette.primary.dark} fontWeight="medium" mb={1}>
        Notas del médico
      </Typography>
      <TextField
        name="notas_medico"
        fullWidth
        multiline
        minRows={4}
        placeholder="Escriba aquí cualquier observación adicional sobre el diagnóstico."
        value={formData.notas_medico || ''}
        onChange={onChange}
      />


      <Box mt={4} display="flex" justifyContent="space-around">
        <Button variant="outlined" onClick={onBack} sx={{ width: '200px', maxWidth: '45%' }}>Atrás</Button>
        <Button variant="contained" onClick={onNext} sx={{ width: '200px', maxWidth: '45%' }}>Completar</Button>
      </Box>
    </Box>
  );
};

export default ResumenForm;
