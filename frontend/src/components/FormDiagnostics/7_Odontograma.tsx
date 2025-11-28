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
    { label: 'Supernumerarios', id: 'supernumerarios' },
    { label: 'Abrasión', id: 'abrasion' },
    { label: 'Manchas', id: 'manchas' },
    { label: 'Patología pulpar', id: 'patologia_pulpar' },
    { label: 'Placa blanda', id: 'placa_blanda' },
    { label: 'Placa calcificada', id: 'placa_calcificada' },
   
];

const OdontogramaForm: React.FC<Props> = ({ formData, onChange, onNext, onBack }) => {
    const theme = useTheme();
    return (
        <Box component="form" noValidate autoComplete="off" sx={{ p: 1 }}>


            <Typography variant="subtitle1" mt={2} mb={2} fontWeight="medium" color={theme.palette.primary.dark}>Odontograma</Typography>
            <Grid container spacing={2}>
                {questions.map((question) => (
                    <Grid key={question.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend" style={{ marginBottom: 8, color:theme.palette.primary.dark }}>{question.label}</FormLabel>
                            <RadioGroup
                                row
                                name={question.id}
                                value={formData[question.id] || ''}
                                onChange={onChange}
                            >
                                <FormControlLabel value="Sí" control={<Radio />} label="Sí" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                                <FormControlLabel value="No sabe" control={<Radio />} label="No sabe" />
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

export default OdontogramaForm;
