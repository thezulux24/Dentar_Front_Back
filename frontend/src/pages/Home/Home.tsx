import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { FlexiCard, DoctorCard } from "../../components/imports";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [randomDoctors, setRandomDoctors] = useState<any[]>([]);

  const allDoctors = [
    { id: 1, name: "Dra. María Gómez", specialty: "Ortodoncista", 
      imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 2, name: "Dr. Carlos Sánchez", specialty: "Cirujano Oral", 
      imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 3, name: "Dra. Laura Fernández", specialty: "Endodoncista", 
      imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 4, name: "Dr. Javier Ramírez", specialty: "Periodoncista", 
      imageUrl: "https://images.unsplash.com/photo-1551601651-bc60f254d532?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 5, name: "Dra. Sofía Herrera", specialty: "Odontopediatra", 
      imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 6, name: "Dr. Andrés Castro", specialty: "Implantólogo", 
      imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
  ];

  useEffect(() => {
    const shuffled = [...allDoctors].sort(() => 0.5 - Math.random());
    setRandomDoctors(shuffled.slice(0, 4));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 0.77, 0.47, 0.97] 
      }
    }
  };

  return (
    <Box component="main" sx={{ py: isMobile ? 3 : 4 }}>
      <Container maxWidth="lg">
        <Stack 
          alignItems="left" 
          textAlign="left" 
          spacing={isMobile ? 1 : 2} 
          mb={isMobile ? 4 : 6}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              fontSize: isMobile ? '2rem' : '3rem', 
            }}
          >
            DentAR
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: '600px',
              fontSize: isMobile ? '1.1rem' : '2rem', 
              mt: "0px !important"
            }}
          >
            Servicios profesionales odontológicos
          </Typography>
          <Button 
            variant="contained" 
            size={isMobile ? "medium" : "large"}
            sx={{ 
              mt: 2,
              px: isMobile ? 3 : 4,
              borderRadius: 2,
              textTransform: 'none',
              alignSelf: 'flex-start',
            }}
            onClick={()=>navigate('/autenticacion')}
          >
            Únete a nosotros
          </Button>
        </Stack>

        <Box sx={{ my: 8 }}>
          <FlexiCard
            imageSrc="https://doctororal.com/assets/img/about.jpg"
            title="Nosotros"
            text="Dentar es una aplicación de diagnóstico odontológico digital que revoluciona la forma en que las personas acceden a una evaluación profesional. Nuestra tecnología permite que los pacientes reciban un análisis preliminar de su sonrisa sin necesidad de asistir a una consulta presencial, simplemente cargando una fotografía desde su dispositivo móvil. Dentar une la tecnología con la salud bucal, haciendo accesible, visual y rápida la primera etapa del tratamiento odontológico."
            imagePosition="left"
          />
        </Box>

        <Box sx={{ my: 8 }}>
          <Typography 
            variant="h5"
            sx={{ 
              mb: 4,
              fontSize: isMobile ? '2rem' : '3rem',
              textAlign: 'center'
            }}
          >
            Nuestros Especialistas
          </Typography>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            animate="visible"
            viewport={{ once: true, margin: "-100px" }}
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '2rem',
              alignItems: 'center'
            }}
          >
            {randomDoctors.map((doctor) => (
              <motion.div key={doctor.id} variants={itemVariants}>
                <DoctorCard 
                  name={doctor.name} 
                  specialty={doctor.specialty}
                  imageUrl={doctor.imageUrl}
                />
              </motion.div>
            ))}
          </motion.div>
        </Box>

        <Box sx={{ my: 8 }}>
          <FlexiCard
            imageSrc="https://doctororal.com/assets/img/about.jpg"
            title="Misión"
            text="Transformar la manera en que los pacientes acceden a diagnósticos odontológicos, utilizando la inteligencia de imágenes para ofrecer un análisis preliminar rápido y visual de su sonrisa. Buscamos simplificar el primer paso del tratamiento, empoderar al paciente con información clara y facilitar el trabajo del profesional, promoviendo una odontología más accesible, tecnológica y centrada en el bienestar del usuario."
            imagePosition="right"
          />
        </Box>

        <Box sx={{ my: 8 }}>
          <FlexiCard
            imageSrc="https://doctororal.com/assets/img/about.jpg"
            title="Visión"
            text="Ser la aplicación líder en diagnóstico odontológico digital, reconocida por ofrecer soluciones confiables, visuales y remotas que mejoran la experiencia del paciente y agilizan el proceso clínico, conectando tecnología y salud oral en un solo clic."
            imagePosition="left"
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Home;