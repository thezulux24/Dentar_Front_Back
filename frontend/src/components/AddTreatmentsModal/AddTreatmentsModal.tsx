import { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  IconButton,
  Typography,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Checkbox,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';

interface Treatment {
  id_tratamiento: string;
  nombre_tratamiento: string;
  descripcion: string;
  precio_estimado?: number;
  duracion?: number;
  imagen_url?: string;
}

interface AddTreatmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  onTreatmentsAdded: () => void;
}

export const AddTreatmentsModal = ({
  isOpen,
  onClose,
  patientId,
  onTreatmentsAdded,
}: AddTreatmentsModalProps) => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { token } = useAuthStore();
  const { openAlert } = useUIStore();

  useEffect(() => {
    if (isOpen) {
      fetchTreatments();
      setSelectedTreatments([]);
      setSearchTerm('');
    }
  }, [isOpen]);

  const fetchTreatments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/tratamientos?cantidad_por_pagina=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Error al cargar tratamientos');

      const result = await response.json();
      setTreatments(result.data?.tratamientos || []);
    } catch (error) {
      console.error('Error fetching treatments:', error);
      openAlert('Error al cargar los tratamientos disponibles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelection = (treatmentId: string) => {
    setSelectedTreatments((prev) => {
      if (prev.includes(treatmentId)) {
        return prev.filter((id) => id !== treatmentId);
      } else {
        if (prev.length >= 5) {
          openAlert('Puedes seleccionar máximo 5 tratamientos a la vez', 'warning');
          return prev;
        }
        return [...prev, treatmentId];
      }
    });
  };

  const handleAddTreatments = async () => {
    if (selectedTreatments.length === 0) {
      openAlert('Selecciona al menos un tratamiento', 'warning');
      return;
    }

    try {
      setSubmitting(true);

      const promises = selectedTreatments.map((treatmentId) =>
        fetch(`${import.meta.env.VITE_BACKEND_URL}/tratamientos-usuarios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_usuario: patientId,
            id_tratamiento: treatmentId,
          }),
        })
      );

      const results = await Promise.allSettled(promises);

      const succeeded = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      if (succeeded > 0) {
        openAlert(
          `${succeeded} tratamiento${succeeded > 1 ? 's' : ''} agregado${succeeded > 1 ? 's' : ''} exitosamente`,
          'success'
        );
        onTreatmentsAdded();
        onClose();
      }

      if (failed > 0) {
        openAlert(
          `${failed} tratamiento${failed > 1 ? 's' : ''} no pudo${failed > 1 ? 'ieron' : ''} ser agregado${failed > 1 ? 's' : ''} (posiblemente ya asignado${failed > 1 ? 's' : ''})`,
          'warning'
        );
      }
    } catch (error) {
      console.error('Error adding treatments:', error);
      openAlert('Error al agregar tratamientos', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTreatments = treatments.filter((treatment) =>
    treatment.nombre_tratamiento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 900,
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          outline: 'none',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Agregar Tratamientos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Selecciona hasta 5 tratamientos para asignar al paciente
            </Typography>
          </Box>
          <IconButton onClick={onClose} disabled={submitting}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Search */}
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField
            fullWidth
            placeholder="Buscar tratamiento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 3,
          }}
        >
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          ) : filteredTreatments.length === 0 ? (
            <Alert severity="info">
              {searchTerm
                ? 'No se encontraron tratamientos con ese criterio de búsqueda'
                : 'No hay tratamientos disponibles'}
            </Alert>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 2,
              }}
            >
              {filteredTreatments.map((treatment) => {
                const isSelected = selectedTreatments.includes(treatment.id_tratamiento);
                return (
                  <Card
                    key={treatment.id_tratamiento}
                    sx={{
                      position: 'relative',
                      border: isSelected ? 2 : 1,
                      borderColor: isSelected ? 'primary.main' : 'divider',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: 3,
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleToggleSelection(treatment.id_tratamiento)}
                      disabled={submitting}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={
                            treatment.imagen_url ||
                            'https://doctororal.com/assets/img/about.jpg'
                          }
                          alt={treatment.nombre_tratamiento}
                        />
                        <Checkbox
                          checked={isSelected}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'background.paper',
                            '&:hover': {
                              bgcolor: 'background.paper',
                            },
                          }}
                        />
                      </Box>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          {treatment.nombre_tratamiento}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {treatment.descripcion}
                        </Typography>
                        {treatment.precio_estimado && (
                          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                            ${treatment.precio_estimado.toLocaleString('es-CO')}
                          </Typography>
                        )}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                );
              })}
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {selectedTreatments.length} tratamiento{selectedTreatments.length !== 1 ? 's' : ''}{' '}
            seleccionado{selectedTreatments.length !== 1 ? 's' : ''}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={onClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              startIcon={submitting ? <CircularProgress size={20} /> : <AddIcon />}
              onClick={handleAddTreatments}
              disabled={selectedTreatments.length === 0 || submitting}
            >
              {submitting
                ? 'Agregando...'
                : `Agregar (${selectedTreatments.length})`}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddTreatmentsModal;
