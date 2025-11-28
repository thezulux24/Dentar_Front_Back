import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  useTheme,
  Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DentalTreatmentCard from '../Cards/TreatmentCard';


interface Props {
  formData: {
    remision: string | null;
    limpieza_profunda: string | null;
    clasificacion_angle: string | null;
    atm: string | null;
    lado_limpieza: string | null;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  onBack: () => void;
}

const TratamientoForm: React.FC<Props> = ({
  formData,
  onChange,
  onNext,
  onBack
}) => {

  const theme = useTheme();
  const [isOpenT, setIsOpenT] = useState(false);

  return (
    <>
      {
        !isOpenT &&
        <Box component="form" noValidate autoComplete="off" sx={{ p: 1 }}>


          <Typography variant="subtitle1" color={theme.palette.primary.dark} mt={2} mb={1} fontWeight="medium">
            Remisión
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Escriba aquí cualquier observación adicional sobre la remisión."
            name="remision"
            value={formData.remision || ''}
            onChange={onChange}
          />

          {/* Limpieza Profunda */}
          <Typography variant="subtitle1" color={theme.palette.primary.dark} mt={3} mb={1} fontWeight="medium">
            Limpieza Profunda
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              row
              name="lado_limpieza"
              value={formData.lado_limpieza || ''}
              onChange={onChange}
            >
              <FormControlLabel value="Izquierdo" control={<Radio />} label="Izquierdo" />
              <FormControlLabel value="Derecho" control={<Radio />} label="Derecho" />
              <FormControlLabel value="Ambos" control={<Radio />} label="Ambos" />
            </RadioGroup>
          </FormControl>
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Escriba aquí cualquier observación adicional sobre la limpieza profunda."
            name="limpieza_profunda"
            value={formData.limpieza_profunda || ''}
            onChange={onChange}
          />

          {/* Clasificación de Angle */}
          <Typography variant="subtitle1" color={theme.palette.primary.dark} mt={3} mb={1} fontWeight="medium">
            Clasificación de Angle
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Escriba aquí cualquier observación adicional sobre la Clasificación de Angle."
            name="clasificacion_angle"
            value={formData.clasificacion_angle || ''}
            onChange={onChange}
          />

          {/* Articulación Temporomandibular */}
          <Typography variant="subtitle1" color={theme.palette.primary.dark} mt={3} mb={1} fontWeight="medium">
            Articulación Temporomandibular
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Escriba aquí cualquier observación adicional sobre la Articulación Temporomandibular"
            name="atm"
            value={formData.atm || ''}
            onChange={onChange}
          />

          {/* Botón de Añadir Tratamiento */}
          <Box mt={4} display="flex" justifyContent="flex-start">
            <Button
              variant="contained"
              
              startIcon={<AddIcon />}
              onClick={() => setIsOpenT(true)}

            >
              Añadir tratamiento
            </Button>
          </Box>

          <Box mt={4} display="flex" justifyContent="space-around">
            <Button variant="outlined" onClick={onBack} sx={{ width: '200px', maxWidth: '45%' }}>Atrás</Button>
            <Button variant="contained" onClick={onNext} sx={{ width: '200px', maxWidth: '45%' }}>Siguiente</Button>
          </Box>
        </Box>
      }

      {
        isOpenT &&
        <>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <DentalTreatmentCard imageSrc={`${import.meta.env.BASE_URL}images/image.png`} isEnabled onNext={onNext} visualization='/filters/whitening' title='Blanqueamiento dental' text='Procedimiento estético que utiliza agentes blanqueadores para reducir manchas y aclarar el tono de los dientes.' />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <DentalTreatmentCard imageSrc={`${import.meta.env.BASE_URL}images/image.png`} isEnabled onNext={onNext} visualization='/filters/ortodoncy' title='Ortodoncia' text='Tratamiento especializado en corregir maloclusiones y alinear los dientes mediante aparatos ortodónticos.' />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <DentalTreatmentCard imageSrc={`${import.meta.env.BASE_URL}images/image.png`} isEnabled={false} onNext={onNext} visualization='/filters/ortodoncy' title='Implantes dentales' text='Inserción de un implante de titanio en el hueso maxilar para reemplazar un diente perdido.' />
            </Grid>
          </Grid>
          <Button
            onClick={() => setIsOpenT(false)}
            variant='outlined' sx={{ mt: 7, ml: { xs: 0, sm: '1rem', minWidth: '200px' } }}>Atrás</Button>
        </>

      }

    </>

  );
};

export default TratamientoForm;
