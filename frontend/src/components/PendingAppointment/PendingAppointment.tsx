import { 
  Box, 
  Typography, 
  Avatar, 
  Divider,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Chip
} from '@mui/material';
import { useState } from 'react';

interface PendingAppointmentProps {
  photoSrc: string;
  name: string;
  treatment: string;
  time: string;
  phone: string;
  date: string;
  notes?: string;
  doctor: string;
  isLast?: boolean;
  onConfirm: () => void;
  onCancel: (reason: string) => void;
}

const PendingAppointment = ({ 
  photoSrc, 
  name, 
  treatment, 
  time,
  phone,
  date,
  notes,
  doctor,
  isLast = false,
  onConfirm,
  onCancel
}: PendingAppointmentProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [cancelMode, setCancelMode] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setCancelMode(false);
    setCancelReason('');
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  const handleCancel = () => {
    if (cancelMode) {
      onCancel(cancelReason);
      handleClose();
    } else {
      setCancelMode(true);
    }
  };

  return (
    <>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          py: 2,
          gap: isMobile ? 1.5 : 3,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
        onClick={handleOpen}
      >
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
            sx={{ fontWeight: 600 }}
          >
            {name}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: 'text.secondary' }}
          >
            {treatment}
          </Typography>
          <Chip 
            label="Por confirmar" 
            size="small" 
            color="warning" 
            sx={{ mt: 0.5, fontSize: '0.7rem' }} 
          />
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

      {/* Pop-up de detalles */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        {!cancelMode ? (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={photoSrc} sx={{ width: 48, height: 48 }} />
              <Box>
                <Typography variant="h6">Detalles de la cita</Typography>
                <Typography variant="body2" color="text.secondary">
                  Cita por confirmar
                </Typography>
              </Box>
            </DialogTitle>
            
            <DialogContent dividers>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Nombre</Typography>
                  <Typography variant="body1">{name}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">Teléfono</Typography>
                  <Typography variant="body1">{phone}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">Fecha</Typography>
                  <Typography variant="body1">{date}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">Hora</Typography>
                  <Typography variant="body1">{time}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">Doctor</Typography>
                  <Typography variant="body1">{doctor}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">Tratamiento</Typography>
                  <Typography variant="body1">{treatment}</Typography>
                </Box>
                
                {notes && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Notas</Typography>
                    <Typography variant="body1">{notes}</Typography>
                  </Box>
                )}
              </Stack>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={handleCancel} color="error">
                Cancelar cita
              </Button>
              <Button onClick={handleConfirm} variant="contained" color="primary">
                Confirmar cita
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={photoSrc} sx={{ width: 48, height: 48 }} />
              <Box>
                <Typography variant="h6">Razón de cancelación</Typography>
                <Typography variant="body2" color="text.secondary">
                  {name}
                </Typography>
              </Box>
            </DialogTitle>
            
            <DialogContent dividers>
              <TextField
                autoFocus
                margin="dense"
                label="Motivo de cancelación"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setCancelMode(false)}>
                Volver
              </Button>
              <Button 
                onClick={handleCancel} 
                variant="contained" 
                color="error"
                disabled={!cancelReason.trim()}
              >
                Enviar cancelación
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default PendingAppointment;
