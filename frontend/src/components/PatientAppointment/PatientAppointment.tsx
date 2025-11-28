import { 
  Box, 
  Typography, 
  Avatar, 
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';

interface PatientAppointmentProps {
  doctorPhotoSrc: string;
  doctorName: string;
  treatment: string;
  time: string;
  location: string;
  isLast?: boolean;
}

const PatientAppointment = ({ 
  doctorPhotoSrc, 
  doctorName, 
  treatment, 
  time,
  location,
  isLast = false 
}: PatientAppointmentProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        py: 2,
        gap: isMobile ? 1.5 : 3
      }}>
        <Avatar 
          src={doctorPhotoSrc} 
          alt={doctorName}
          sx={{ 
            width: isMobile ? 48 : 56, 
            height: isMobile ? 48 : 56 
          }}
        />
        
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="subtitle1" 
            sx={{ fontWeight: 400 }}
            color='primary.dark'
          >
            Dr. {doctorName}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: 'text.secondary' }}
          >
            {treatment}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.75rem',
              mt: 0.5
            }}
          >
            {location}
          </Typography>
        </Box>
        
        <Typography 
          variant="body1"
          sx={{ 
            fontWeight: 500,
            color: 'primary.dark',
            minWidth: isMobile ? '60px' : '80px',
            textAlign: 'right'
          }}
        >
          {time}
        </Typography>
      </Box>
      
      {!isLast && <Divider sx={{ my: 0 }} />}
    </>
  );
};

export default PatientAppointment;