import React from 'react';
import { Typography, useTheme, Box } from '@mui/material';
import { motion } from 'framer-motion';

interface DoctorCardProps {
  name: string;
  specialty: string;
  imageUrl?: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ 
  name, 
  specialty,
  imageUrl = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
}) => {
  const theme = useTheme();
  
  return (
    <motion.div
      whileHover={{
        rotateY: 10,
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 2,
        cursor: 'pointer'
      }}>
        <Box 
          component={motion.div}
          whileHover={{ rotate: 3 }}
          sx={{
            width: 180,
            height: 180,
            borderRadius: '50%',
            overflow: 'hidden',
            mb: 2,
            border: `3px solid ${theme.palette.primary.light}`,
            boxShadow: theme.shadows[4],
            '& img': {
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(30%)',
              transition: 'filter 0.3s ease, transform 0.3s ease',
            },
            '&:hover img': {
              filter: 'grayscale(0%)',
              transform: 'scale(1.1)'
            }
          }}
        >
          <img 
            src={imageUrl} 
            alt={`Foto de ${name}`}
          />
        </Box>
        
        <Typography 
          variant="h6"
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.dark,
            textAlign: 'center',
            mb: 0.5
          }}
        >
          {name}
        </Typography>
        
        <Typography 
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            textAlign: 'center'
          }}
        >
          {specialty}
        </Typography>
      </Box>
    </motion.div>
  );
};

export default DoctorCard;