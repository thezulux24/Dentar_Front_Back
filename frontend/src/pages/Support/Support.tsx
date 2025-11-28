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
            Si algo falla, intenta recargar la página o vuelve a intentarlo más tarde.
            Si el problema persiste, por favor contáctanos.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size={isMobile ? "medium" : "large"}
            sx={{
              alignSelf: 'flex-start',
              px: 4,
              borderRadius: 2,
              textTransform: 'none',
              minWidth: '175px',
            }}
          >
            Ayuda
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default Support;