import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Avatar,
    Grid,
    Button,
    Paper,
    Divider,
    // CircularProgress // Import CircularProgress for the spinner
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import dataFormTemplate from '../../utils/DataFormPatient';
import sectionTitles from '../../utils/DataFormTitles';
import useFetch, { FetchResponse } from '../../hooks/useFetch';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';
import Loader from '../../components/Loader/Loader'; // Assuming a Loader component exists

const excludedKeys = ['nombres', 'apellidos', 'notas']; // These are nested keys, will be handled by the filter.

const formatLabel = (key: string) =>
    key
        .replace(/_/g, ' ')              // Reemplaza guiones bajos con espacios
        .replace(/\b\w/g, c => c.toUpperCase()); // Capitaliza la primera letra de cada palabra


const orderedOdontograma2Keys = [
    '18', '38', '17', '37', '16', '36', '55 - 15', '75 - 35',
    '54 - 14', '74 - 34', '53 - 13', '73 - 33',
    '52 - 12', '72 - 32', '51 - 11', '71 - 31', '61 - 21', '81 - 41',
    '62 - 22', '82 - 42', '63 - 23', '83 - 43',
    '64 - 24', '84 - 44', '65 - 25', '85 - 45',
    '26', '46', '27', '47', '28', '48'
];

function calcularEdadYYYMMDD(fechaStr: string): string {
    try {
        const [anio, mes, dia ] = fechaStr.split('T')[0] .split('-').map(Number);

        if (isNaN(dia) || isNaN(mes) || isNaN(anio)) throw new Error('Fecha inválida');

        const fechaNacimiento = new Date(anio, mes - 1, dia);
        const hoy = new Date();

        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mesActual = hoy.getMonth();
        const diaActual = hoy.getDate();

        if (
            mesActual < fechaNacimiento.getMonth() ||
            (mesActual === fechaNacimiento.getMonth() && diaActual < fechaNacimiento.getDate())
        ) {
            edad--;
        }

        return edad.toString();
    } catch (error) {
        console.warn("Error al calcular edad:", error);
        return "";
    }
}

const PatientPage = () => {
    const { patientId } = useParams<{ patientId: string }>();
    const [formData, setFormData] = useState<any>(dataFormTemplate);
    const [loading, setLoading] = useState(true);

    const { fetchData } = useFetch<FetchResponse>();
    const { token, user } = useAuthStore();
    const { openAlert } = useUIStore();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatientData = async () => {
            if (!patientId) {
                openAlert("ID de paciente no proporcionado", "error");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await fetchData({
                    url: `${import.meta.env.VITE_BACKEND_URL}/diagnosticos/${patientId}`,
                    method: 'GET',
                    token: token
                });

                if (response?.success && response.data) {
                    // console.log("Datos del paciente obtenidos:", response.data);
                    setFormData(response.data);
                } else {
                    throw new Error("Error al cargar los datos del paciente");
                }
            } catch (error) {
                console.error("Error fetching patient data:", error);
                openAlert("El paciente aún no tiene un diagnóstico", "error");

                // redirigir a la página de diagnósticos
                if(user?.rol === "doctor") navigate('/doctor/diagnosticos');
                else if(user?.rol === "auxiliar") navigate('/auxiliar/diagnosticos');
            
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();
    }, [patientId, token, fetchData, openAlert]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Loader />
            </Box>
        );
    }

    return (
        <Box sx={{
            p: {
                xs: 4,
                sm: 6,
                md: 8
            },
            maxWidth: '1024px',
            mx: 'auto'
        }}>
            {/* Título principal */}
            <Box sx={{ p: 1, mt: 4 }}>
                <Typography variant="h5">Diagnóstico</Typography>
                <Typography variant="h6" color="textSecondary">{formData.informacion_personal?.nombres || '--'} {formData.informacion_personal?.apellidos || '--'}</Typography>
            </Box>

            {/* Panel de información */}
            <Paper elevation={1} sx={{ borderRadius: 3, p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    {/* Foto del paciente */}
                    <Grid size={{ xs: 12, sm: 2 }}>
                        <Avatar
                            src={`${import.meta.env.VITE_FILES_URL}${formData.foto_de_perfil}`}
                            alt="Paciente"
                            sx={{ width: 100, height: 100 }}
                        />
                    </Grid>

                    {/* Info del paciente */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body1"><strong>Nombre:</strong> {formData.informacion_personal?.nombres || '--'} {formData.informacion_personal?.apellidos || '--'}</Typography>
                        <Typography variant="body1"><strong>Edad:</strong> {calcularEdadYYYMMDD(formData.informacion_personal?.fecha_nacimiento || '') || "-"} años</Typography>
                        <Typography variant="body1"><strong>Dirección:</strong> {formData.informacion_personal?.direccion || '--'}</Typography>
                        {/* <Typography variant="body1"><strong>Etiqueta:</strong> Alergias conocidas</Typography> */}
                    </Grid>

                    {/* Botón agregar tratamiento */}
                    <Grid size={{ xs: 12, sm: 4 }} textAlign="right">
                        <Button
                            variant="contained"
                            
                            startIcon={<AddIcon />}
                        >
                            Agregar Tratamientos
                        </Button>
                    </Grid>
                </Grid>

                {/* Notas */}
                <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="medium">Notas:</Typography>
                    <Typography variant="body2" mt={0.5}>
                        {formData.resumen?.notas || 'Sin notas'}
                    </Typography>
                </Box>


                <Divider sx={{ my: 2 }} />

                {/* Información adicional */}
                <Box mt={3}>
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                        Información adicional
                    </Typography>
                    <Grid container spacing={1}>
                        {Object.entries(formData).map(([sectionKey, sectionValue]) => {
                            if (!sectionValue || typeof sectionValue !== 'object') return null;

                            // Manejar el caso especial de odontograma2
                            if (sectionKey === 'odontograma2') {
                                return (
                                    <Box key={sectionKey} sx={{ mt: 3, width:"100%" }}>
                                        <Typography variant="body1" fontWeight="bold" gutterBottom sx={{color:'#0B006A'}}>
                                            {sectionTitles[sectionKey] || formatLabel(sectionKey)}
                                        </Typography>
                                        <Grid container spacing={1}>
                                            {orderedOdontograma2Keys.map((key) => (
                                                <Grid size={{xs:6}} key={`${sectionKey}-${key}`}>
                                                    <Typography variant="body2">
                                                        <strong>{key}:</strong> {(sectionValue as Record<string, any>)[key] || '—'}
                                                    </Typography>
                                                </Grid>
                                            ))}
                                        </Grid>
                                        <Divider sx={{mt:1}}></Divider>
                                    </Box>
                                );
                            }

                            // Mostrar otros grupos normalmente
                            const filteredEntries = Object.entries(sectionValue).filter(
                                ([fieldKey]) => !excludedKeys.includes(fieldKey)
                            );

                            if (filteredEntries.length === 0) return null;

                            return (
                                <Box key={sectionKey} sx={{ mt: 3, width:"100%" }}>
                                    <Typography variant="body1" fontWeight="bold" gutterBottom sx={{color:'#0B006A'}}>
                                        {sectionTitles[sectionKey] || formatLabel(sectionKey)}
                                    </Typography>
                                    <Grid container spacing={1}>
                                        {filteredEntries.map(([fieldKey, fieldValue]) => (
                                            <Grid size={{xs:12, sm:6}} key={`${sectionKey}-${fieldKey}`}>
                                                <Typography variant="body2">
                                                    <strong>{formatLabel(fieldKey)}:</strong> {fieldValue || '—'}
                                                </Typography>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <Divider sx={{mt:1}}></Divider>
                                </Box>
                            );
                        })}
                    </Grid>
                </Box>

            </Paper>


        </Box>
    );
};

export default PatientPage;
