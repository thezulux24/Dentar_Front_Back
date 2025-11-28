import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  IconButton,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from '@mui/icons-material/CenterFocusStrong';
import { Settings } from "@mui/icons-material";

interface PreviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  title: string;
  text: string;
  isEnabled: boolean; // Para controlar si el botón está activo
  onPreviewClick?: () => void; // Función opcional al hacer clic en "Previsualizar"
  isAdmin?: boolean;
}

export const PreviewPopup = ({
  isOpen,
  onClose,
  imageSrc,
  title,
  text,
  isEnabled,
  onPreviewClick,
  isAdmin = false,
}: PreviewPopupProps) => {

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedText, setEditedText] = useState(text);

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  const handleEditSave = () => {
    setIsEditing(false);

    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          outline: "none",
          pt: 6
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>

        {
          isEditing ? (
            <>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Imagen"
                sx={{
                  mb: 2,
                  '& input::placeholder': {
                    color: '#b5b5b5',
                    opacity: 1,
                  }
                }}
              />
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Título"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                sx={{
                  mb: 2,
                  '& input::placeholder': {
                    color: '#b5b5b5',
                    opacity: 1,
                  }
                }}
              />
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Descripción"
                multiline
                minRows={3}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                sx={{
                  mb: 2,
                  '& input::placeholder': {
                    color: '#b5b5b5',
                    opacity: 1,
                  }
                }}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleEditSave}
              >
                Guardar
              </Button>
            </>
          )
            :
            (
              <>
                {/* Imagen */}
                <Box
                  component="img"
                  src={imageSrc}
                  alt={title}
                  sx={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 1,
                    mb: 2,
                  }}
                />

                {/* Título y texto */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {text}
                </Typography>

                {/* Botón "Previsualizar" (igual al de la card) */}
                <Box sx={{ display: 'flex', flex: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={!isEnabled}
                    startIcon={<VisibilityIcon />}
                    sx={{ mt: 2, mx: 1 }}
                    onClick={onPreviewClick || onClose} // Si no hay función, cierra el popup
                  >
                    Previsualizar
                  </Button>


                  {
                    isAdmin &&
                    <Button
                      onClick={() => setIsEditing(true)}
                      fullWidth
                      variant="contained"
                      startIcon={<Settings />}
                      sx={{ mt: 2, mx: 1 }}
                    >
                      Editar
                    </Button>
                  }

                </Box>

              </>
            )
        }


      </Box>
    </Modal>
  );
};

export default PreviewPopup;