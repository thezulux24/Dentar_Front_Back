import { 
  Box, 
  Typography, 
  Avatar, 
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';

interface DailyAppointmentProps {
  photoSrc: string;
  name: string;
  treatment: string;
  time: string;
  isLast?: boolean;
}

const DailyAppointment = ({ 
  photoSrc, 
  name, 
  treatment, 
  time,
  isLast = false 
}: DailyAppointmentProps) => {
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
          src={photoSrc} 
          alt={name}
          sx={{ 
            width: isMobile ? 48 : 56, 
            height: isMobile ? 48 : 56 
          }}
        />
        
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="subtitle1" 
            sx={{ fontWeight: 500 }}
            color='primary.dark'
          >
            {name}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: 'text.secondary' }}
          >
            {treatment}
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

export default DailyAppointment;