import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Typography, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonalInfoForm from '../../components/FormDiagnostics/1_PersonalInfo';
import AcudienteInfoForm from '../../components/FormDiagnostics/2_AcudienteInfo';
import MedicalHistoryForm from '../../components/FormDiagnostics/3_MedicalHistory';
import TreatmentInfoForm from '../../components/FormDiagnostics/4_TreatmentInfo';
import AnamnesisForm from '../../components/FormDiagnostics/5_Anamnesis';
import ExamenFisicoForm from '../../components/FormDiagnostics/6_ExamenFisico';
import OdontogramaForm from '../../components/FormDiagnostics/7_Odontograma';
import Odontograma2Form from '../../components/FormDiagnostics/8_Odontograma2';
import TratamientoForm from '../../components/FormDiagnostics/9_Tratamiento';
import ResumenForm from '../../components/FormDiagnostics/10_Resumen';

import dataFormTemplate from '../../utils/DataFormPatient';
import useFetch, { FetchResponse } from '../../hooks/useFetch';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';

const steps = ['Información personal', 'Acudiente',
    'Historial médico', 'Información del tratamiento',
    'Anamnesis', 'Examen físico estomatológico', 'Odontograma',
    'Información odontograma', 'Tratamiento', "Resumen"];

const NewPatient: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isLg = useMediaQuery(theme.breakpoints.down('lg'));
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState(dataFormTemplate);

    const { fetchData} = useFetch<FetchResponse>();

    const { token, user } = useAuthStore();
    const { openAlert } = useUIStore();

    const handleNext = () => {

        if (activeStep >= steps.length - 1) {
            // enviar al backend
            handleSendInformation(formData);
            return
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        if (activeStep === 0) {
            navigate(-1)
        }
        setActiveStep((prev) => prev - 1);
    };

    const handleSendInformation = async (data: any) => {

        try {
            setIsLoading(true);

            // agregar id del odontologo si el rol corresponde
            if (user?.rol === 'doctor') {
                data.id_odontologo = user.id;
            }

            // Se envía la petición
            const response = await fetchData({
                url: `${import.meta.env.VITE_BACKEND_URL}/diagnosticos`,
                method: 'POST',
                body: JSON.stringify(data),
                token: token
            });

            if (!response.success) throw new Error("Ha ocurrido un error al guardar el diagnóstico");

            if(response.success && response.data.id_paciente) {
                openAlert("Diagnóstico guardado correctamente", "success");

                // redirigir al diagnostico del paciente
                // navigate(`/doctor/diagnosticos/paciente`);
                // redirigir a la página de diagnósticos
                if(user?.rol === "doctor") navigate(`/doctor/diagnosticos/${response.data.id_paciente}`);
                else if(user?.rol === "auxiliar") navigate(`/auxiliar/diagnosticos/${response.data.id_paciente}`);

                
            }

        } catch (err) {
            console.error(err);
            openAlert(`${err}`, "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;


        let key: "informacion_personal" | "informacion_acudiente" | "historial_medico" |
            "informacion_tratamiento" | "anamnesis" | "examen_fisico" |
            "odontograma" | "odontograma_denticion" | "plan_tratamiento" | "resumen" = "informacion_personal"

        switch (activeStep) {
            case 0:
                key = "informacion_personal"
                break;
            case 1:
                key = "informacion_acudiente"
                break;
            case 2:
                key = "historial_medico"
                break;
            case 3:
                key = "informacion_tratamiento"
                break;
            case 4:
                key = "anamnesis"
                break;
            case 5:
                key = "examen_fisico"
                break;
            case 6:
                key = "odontograma"
                break;
            case 7:
                key = "odontograma_denticion"
                break;
            case 8:
                key = "plan_tratamiento"
                break;
            case 9:
                key = "resumen"
                break;

            default:
                break;
        }


        setFormData((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                [name]: value,
            },
        }));
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <PersonalInfoForm
                        formData={formData.informacion_personal}
                        onChange={handleInfoChange}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );

            case 1:
                return (
                    <AcudienteInfoForm
                        formData={formData.informacion_acudiente}
                        onChange={handleInfoChange}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            case 2:
                return (
                    <MedicalHistoryForm
                        formData={formData.historial_medico}
                        onChange={handleInfoChange}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            case 3:
                return (
                    <TreatmentInfoForm
                        formData={formData.informacion_tratamiento}
                        onChange={handleInfoChange}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            case 4:
                return (
                    <AnamnesisForm
                        formData={formData.anamnesis}
                        onChange={handleInfoChange}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            case 5:
                return (
                    <ExamenFisicoForm
                        formData={formData.examen_fisico}
                        onChange={handleInfoChange}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            case 6:
                return (
                    <OdontogramaForm
                        formData={formData.odontograma}
                        onChange={handleInfoChange}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            case 7:
                return (
                    <Odontograma2Form
                        formData={formData.odontograma_denticion}
                        onChange={handleInfoChange}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            case 8:
                return (
                    <TratamientoForm
                        formData={formData.plan_tratamiento}
                        onChange={handleInfoChange}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            case 9:
                return (
                    <ResumenForm
                        formData={formData.resumen}
                        onChange={handleInfoChange}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            default:
                return <div>Sin datos</div>;
        }
    };

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
            {!isMobile &&
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}><StepLabel>{!isLg && label}</StepLabel></Step>
                    ))}
                </Stepper>}

            <Box sx={{ p: 1, mt: 4 }}>
                <Typography variant="h5">Diagnóstico</Typography>
                <Typography variant="h6" color="textSecondary">{activeStep < 8 ? "Agregar nuevo paciente" : "Tratamiento"}</Typography>
            </Box>

            <Box mt={4}>{getStepContent(activeStep)}</Box>



            {/* LOADING PANTALLA ************** */}
            {
                isLoading &&
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100dvw',
                        height: '100dvh',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        zIndex: 1300,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <img
                        src={`${import.meta.env.BASE_URL}images/tooth.svg`}
                        alt="Cargando..."
                        style={{
                            width: 200,
                            height: 200,
                            maxWidth: '90vw'
                        }}
                    />
                </Box>
            }

        </Box>
    );
};

export default NewPatient;
