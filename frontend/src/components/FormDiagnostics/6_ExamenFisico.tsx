import React from 'react';
import {
    Box,
    Button,
    Grid,
    Typography,
    FormControl,
    FormLabel,
    FormControlLabel,
    RadioGroup,
    Radio,
    useTheme
} from '@mui/material';

interface Props {
    formData: {
        [key: string]: string | null;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNext: () => void;
    onBack: () => void;
}


const questions = [
    { label: 'Artic Tempora - Mandibular', id: 'artic_tempora_mandibular' },
    { label: 'Labios', id: 'labios' },
    { label: 'Lengua', id: 'lengua' },
    { label: 'Paladar', id: 'paladar' },
    { label: 'Piso de boca', id: 'piso_de_boca' },
    { label: 'Carrillos', id: 'carrillos' },
    { label: 'Glándulas salivales', id: 'glandulas_salivales' },
    { label: 'Maxilares', id: 'maxilares' },
    { label: 'Senos maxilares', id: 'senos_maxilares' },
    { label: 'Músculos masticadores', id: 'musculos_masticadores' },
    { label: 'Nervios', id: 'nervios' },
    { label: 'Vascular', id: 'vascular' },
    { label: 'Linfático regional', id: 'linfatico_regional' },
    { label: 'Funciones de oclusión', id: 'funciones_de_oclusion' }
];

const ExamenFisicoForm: React.FC<Props> = ({ formData, onChange, onNext, onBack }) => {
    const theme = useTheme();
    return (
        <Box component="form" noValidate autoComplete="off" sx={{ p: 1 }}>


            <Typography variant="subtitle1" mt={2} mb={2} fontWeight="medium" color={theme.palette.primary.dark}>Examen físico estomatológico</Typography>
            <Grid container spacing={2}>
                {questions.map((question) => (
                    <Grid key={question.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend" style={{ marginBottom: 8, color:theme.palette.primary.dark}}>{question.label}</FormLabel>
                            <RadioGroup
                                row
                                name={question.id}
                                value={formData[question.id] || ''}
                                onChange={onChange}
                            >
                                <FormControlLabel value="Normal" control={<Radio />} label="Normal" />
                                <FormControlLabel value="Anormal" control={<Radio />} label="Anormal" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                ))}
            </Grid>

            <Box mt={4} display="flex" justifyContent="space-around">
                <Button variant="outlined" onClick={onBack} sx={{ width: '200px', maxWidth: '45%' }}>Atrás</Button>
                <Button variant="contained" onClick={onNext} sx={{ width: '200px', maxWidth: '45%' }}>Siguiente</Button>
            </Box>
        </Box>
    );
};

export default ExamenFisicoForm;
