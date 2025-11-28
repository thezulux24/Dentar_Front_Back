import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { DentalTreatmentCard, AddTreatmentModal } from "../../components/imports";
import { Add } from '@mui/icons-material';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';

interface Treatment {
  image: string;
  title: string;
  description: string;
  buttonText?: string;
  visualization?: string;
}

const Resources = () => {
  const { user } = useAuthStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [treatments, setTreatments] = useState<Treatment[]>([
    {
      image: 'https://doctororal.com/assets/img/about.jpg',
      title: 'Blanqueamiento Dental',
      description: 'Procedimiento estético que utiliza agentes blanqueadores para reducir manchas y aclarar el tono de los dientes.',
      buttonText: 'Información',
      visualization: '/filters/whitening'
    },
    {
      image: 'https://doctororal.com/assets/img/about.jpg',
      title: 'Ortodoncia',
      description: 'Tratamiento para corregir la posición de los dientes y mejorar la mordida mediante brackets o alineadores transparentes.',
      visualization: '/filters/ortodoncy'
    },
    {
      image: 'https://doctororal.com/assets/img/about.jpg',
      title: 'Implantes Dentales',
      description: 'Solución permanente para reemplazar dientes perdidos, proporcionando una apariencia y función similar a los dientes naturales.',
      visualization: '/filters/protesis'
    },
    {
      image: 'https://doctororal.com/assets/img/about.jpg',
      title: 'Limpieza dental',
      description: 'Consiste en la eliminación de placa y sarro acumulados en los dientes y debajo de las encías.',
      visualization: ''
    },
    {
      image: 'https://doctororal.com/assets/img/about.jpg',
      title: 'Endodoncia',
      description: 'Este tratamiento se realiza cuando el tejido pulpar del diente se ve afectado por una infección o lesión.',
      visualization: ''
    },
    {
      image: 'https://doctororal.com/assets/img/about.jpg',
      title: 'Carillas dentales',
      description: 'Finas láminas de porcelana o composite que corrigen manchas, fracturas o desalineaciones dentales.',
      visualization: ''
    },
    {
      image: 'https://doctororal.com/assets/img/about.jpg',
      title: 'Incrustaciones dentales',
      description: 'Restauración dental que repara cavidades amplias o daños en la superficie masticatoria.',
      visualization: ''
    },
    {
      image: 'https://doctororal.com/assets/img/about.jpg',
      title: 'Brackets linguales',
      description: 'Ortodoncia que utiliza brackets en la cara interna de los dientes, lo que hace que sean prácticamente invisibles.',
      visualization: ''
    },
    {
      image: 'https://doctororal.com/assets/img/about.jpg',
      title: 'Brackets linguales',
      description: 'Procedimiento que estimula el crecimiento óseo en áreas con pérdida ósea, preparándolas para implantes dentales.',
      visualization: ''
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTreatment = (newTreatment: Treatment) => {
    setTreatments([...treatments, {
      ...newTreatment,
      buttonText: newTreatment.buttonText || 'Más información'
    }]);
  };

  return (
    <Box component="main" sx={{ py: isMobile ? 3 : 6 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: isMobile ? 3 : 6,
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2
          }}
        >
          <Box>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 500,
                color: 'primary.dark',
                fontSize: isMobile ? '2rem' : '2.5rem'
              }}
            >
              Recursos
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'text.secondary',
                mt: 1
              }}
            >
              Lista de Tratamientos
            </Typography>
          </Box>

          {
            (user?.rol)?.toLowerCase() === "doctor" || (user?.rol)?.toLowerCase() ==="auxiliar" &&
            <Button
              variant="contained"
              onClick={() => setIsModalOpen(true)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
                alignSelf: isMobile ? 'stretch' : 'flex-end',
                minWidth: isMobile ? '100%' : 'auto'
              }}
              startIcon={<Add />}
            >
              Agregar Tratamiento
            </Button>

          }

        </Box>

        <Grid container spacing={isMobile ? 2 : 4}>
          {treatments.map((treatment) => (
            <Grid size={{xs:12, sm:6, md:4}}>
              <DentalTreatmentCard
                image={treatment.image}
                title={treatment.title}
                description={treatment.description}
                buttonText={treatment.buttonText}
                visualization={treatment.visualization}
                isAdmin={(user?.rol)?.toLowerCase() ==="doctor" || (user?.rol)?.toLowerCase() ==="auxiliar"}
              />
            </Grid>
          ))}
        </Grid>

        <AddTreatmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddTreatment={handleAddTreatment}
        />
      </Container>
    </Box>
  );
};

export default Resources;