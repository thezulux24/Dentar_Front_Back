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
  Chip
} from '@mui/material';
import { useState } from 'react';

interface ReminderAppointmentProps {
  photoSrc: string;
  name: string;
  treatment: string;
  time: string;
  isLast?: boolean;
  onAddReminder: (reminderText: string) => void;
}

const ReminderAppointment = ({ 
  photoSrc, 
  name, 
  treatment, 
  time,
  isLast = false,
  onAddReminder
}: ReminderAppointmentProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [reminderText, setReminderText] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setReminderText('');
  };

  const handleSubmit = () => {
    if (reminderText.trim()) {
      onAddReminder(reminderText);
      handleClose();
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
            label="Agregar recordatorio" 
            size="small" 
            color="info" 
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

      {/* Pop-up de recordatorio */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={photoSrc} sx={{ width: 48, height: 48 }} />
          <Box>
            <Typography variant="h6">Recordatorio</Typography>
            <Typography variant="body2" color="text.secondary">
              {name} - {treatment}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              Motivo del recordatorio para esta cita:
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Escriba el recordatorio aquí"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={reminderText}
              onChange={(e) => setReminderText(e.target.value)}
              placeholder="Ej: Recordar que el paciente es alérgico a..."
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!reminderText.trim()}
          >
            Guardar Recordatorio
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReminderAppointment;