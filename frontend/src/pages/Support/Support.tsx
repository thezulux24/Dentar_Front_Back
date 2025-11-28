import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { WhatsApp } from '@mui/icons-material';
import useAuthStore from '../../store/authStore';
import { SupportChat } from '../../components/imports';

const Support = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Box component="main" sx={{ py: isMobile ? 3 : 6 }}>
      <Container maxWidth="md">
        {(!isAuthenticated || ((user?.rol).toLowerCase() !== "doctor" && (user?.rol).toLowerCase() !== "auxiliar")) &&
          <>

            <Stack spacing={3} mb={6}>
              <Typography variant="h4" component="h2" sx={{
                fontWeight: 500,
                color: 'primary.dark'
              }}>
                Contáctanos
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: "1rem", md: "1.2rem", lg: "1.4rem" },
                  lineHeight: 1.6
                }}
              >
                ¿Tienes alguna duda? ¿Necesitas ayuda?{" "}
                <Box component="span" sx={{ color: "secondary.main", fontWeight: "bold" }}>
                  ¡No dudes en contactarnos!
                </Box>{" "}
                Chatee con nosotros, pregúntenos todo acerca de nuestros servicios.
                Estamos aquí para responder a todas tus preguntas y ayudarte a encontrar la solución perfecta para ti.
              </Typography>

              <Button
                component="a"
                href="https://wa.me/573168360517" //
                target="_blank" //
                rel="noopener noreferrer"
                variant="contained"
                color="success"
                size={isMobile ? "medium" : "large"}
                startIcon={<WhatsApp />}
                sx={{
                  alignSelf: 'flex-start',
                  px: 4,
                  borderRadius: 2,
                  textTransform: 'none',
                  bgcolor: '#25D366',
                  '&:hover': { bgcolor: '#128C7E' }
                }}
              >
                WhatsApp
              </Button>
            </Stack>
            <Divider sx={{ my: 4 }} />
          </>}


        <Stack spacing={3}>
          <Typography variant="h4" component="h2" sx={{
            fontWeight: 500,
            color: 'primary.dark'
          }}>
            Soporte Técnico
          </Typography>

          <Typography variant="body1" sx={{
            color: 'text.secondary',
            fontSize: { xs: "1rem", md: "1.2rem", lg: "1.4rem" },
            lineHeight: 1.6
          }}>
            Nuestro asistente virtual está disponible{' '}
            <Box component="span" sx={{ color: "secondary.main", fontWeight: "bold" }}>
              24/7
            </Box>{' '}
            para ayudarte con problemas técnicos, dudas sobre la plataforma y consultas generales.
          </Typography>

          {/* Chat de Soporte Técnico */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 2
          }}>
            <SupportChat />
          </Box>

          {/* Información de contacto */}
          <Box sx={{
            mt: 4,
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
              ¿Necesitas ayuda adicional?
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 80 }}>
                  Email:
                </Typography>
                <Typography 
                  component="a" 
                  href="mailto:soporte@dentar.com"
                  variant="body2" 
                  sx={{ 
                    color: 'secondary.main',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  soporte@dentar.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 80 }}>
                  Teléfono:
                </Typography>
                <Typography 
                  component="a" 
                  href="tel:+573168360517"
                  variant="body2" 
                  sx={{ 
                    color: 'secondary.main',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  +57 316 836 0517
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 80 }}>
                  Horario:
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Lunes a Viernes: 8:00 AM - 6:00 PM
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Support;