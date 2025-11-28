import React from 'react';
import {
    Box,
    Button,
    Grid,
    Typography,
    TextField,
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


const teethNumbers = [
    '18', '38', '17', '37', '16', '36', '55 - 15', '75 - 35',
    '54 - 14', '74 - 34', '53 - 13', '73 - 33',
    '52 - 12', '72 - 32', '51 - 11', '71 - 31', '61 - 21', '81 - 41',
    '62 - 22', '82 - 42', '63 - 23', '83 - 43',
    '64 - 24', '84 - 44', '65 - 25', '85 - 45',
    '26', '46', '27', '47', '28', '48'


];

const Odontograma2Form: React.FC<Props> = ({ formData, onChange, onNext, onBack }) => {
    const theme = useTheme();

    return (
        <Box component="form" noValidate autoComplete="off" sx={{ p: 2 }}>
            <Typography variant="subtitle1" mt={2} mb={2} fontWeight="medium" color={theme.palette.primary.dark}>
                Información del tratamiento
            </Typography>

            <Grid container spacing={2}>
                {teethNumbers.map((tooth) => (
                    <Grid key={tooth} size={{ xs: 6, sm: 6 }}>
                        <Typography variant="body2" gutterBottom color={theme.palette.primary.dark}>
                            {tooth}
                        </Typography>
                        <TextField
                            fullWidth
                            name={tooth}
                            value={formData[tooth] || ''}
                            onChange={onChange}
                            placeholder="Ej: Muela"
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                ))}
            </Grid>

            <Box mt={4} display="flex" justifyContent="space-between">
                <Button variant="outlined" onClick={onBack} sx={{ width: '45%' }}>
                    Atrás
                </Button>
                <Button variant="contained" onClick={onNext} sx={{ width: '45%' }}>
                    Siguiente
                </Button>
            </Box>
        </Box>
    );
};

export default Odontograma2Form;
