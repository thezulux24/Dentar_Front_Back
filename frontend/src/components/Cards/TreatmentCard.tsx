import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/CenterFocusStrong';
import { useNavigate } from 'react-router-dom';

interface DentalTreatmentCardProps {
  imageSrc: string;
  title: string;
  text: string;
  isEnabled: boolean;
  visualization: string;
  onNext: () => void;
  
}

const DentalTreatmentCard: React.FC<DentalTreatmentCardProps> = ({
  imageSrc,
  title,
  text,
  isEnabled,
  visualization,
  onNext
}) => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        width: 300,
        height: 460,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: 2,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6,
        },
      }}
    >
      {/* Imagen */}
      <Box
        component="img"
        src={imageSrc}
        alt={title}
        sx={{
          width: '100%',
          display: 'block',
          objectFit: 'cover',
        }}
      />

      {/* Contenido de la tarjeta */}
      <CardContent sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        textAlign: 'center',
        px: 3,
        pb: 3,
      }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {text}
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          disabled={!isEnabled}
          startIcon={<VisibilityIcon />}
          sx={{ mb: 1, mt: 1.5 }}
          onClick={()=>navigate(visualization)}
        >
          Previsualizar
        </Button>
        <Button
          fullWidth
          variant="contained"
          disabled={!isEnabled}
          onClick={onNext}
        >
          Empezar
        </Button>
      </CardContent>
    </Card>
  );
};

export default DentalTreatmentCard;