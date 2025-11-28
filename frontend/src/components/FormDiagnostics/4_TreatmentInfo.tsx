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
        motivo_consulta: string | null;
        procedimiento_principal: string | null;
        notas_relevantes: string | null;
        eps: string | null;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNext: () => void;
    onBack: () => void;
}

const TreatmentInfoForm: React.FC<Props> = ({ formData, onChange, onNext, onBack }) => {
    const theme = useTheme();
    return (
        <Box component="form" noValidate autoComplete="off" sx={{ p: 1 }}>


            <Typography variant="subtitle1" mt={2} mb={2} fontWeight="medium" color={theme.palette.primary.dark}>Historial médico</Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Motivo de consulta" name="motivo_consulta" fullWidth value={formData.motivo_consulta || ''} onChange={onChange} placeholder="Ej: Dolor en molar derecho" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Procedimiento principal" name="procedimiento_principal" fullWidth value={formData.procedimiento_principal || ''} onChange={onChange} placeholder="Seleccione tratamiento" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Notas relevantes" name="notas_relevantes" fullWidth value={formData.notas_relevantes || ''} onChange={onChange} placeholder="Ej: Paciente nervioso" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="EPS/IPS" name="eps" fullWidth value={formData.eps || ''} onChange={onChange} placeholder="Ej: Su afiliación" />
                </Grid>
            </Grid>

            <Box mt={4} display="flex" justifyContent="space-around">
                <Button variant="outlined" onClick={onBack} sx={{ width: '200px', maxWidth: '45%' }}>Atrás</Button>
                <Button variant="contained" onClick={onNext} sx={{ width: '200px', maxWidth: '45%' }}>Siguiente</Button>
            </Box>
        </Box>
    );
};

export default TreatmentInfoForm;
