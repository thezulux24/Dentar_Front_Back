import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import useFetch, { FetchResponse } from '../../hooks/useFetch';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';

interface Mensaje {
  id_mensaje_soporte: string;
  contenido: string;
  es_bot: boolean;
  leido: boolean;
  fecha_creacion: string;
  usuario?: {
    nombres: string;
    apellidos: string;
    avatar_url?: string;
  };
}

interface Ticket {
  id_ticket: string;
  asunto: string;
  estado: string;
  prioridad: string;
  fecha_creacion: string;
  mensajes: Mensaje[];
}

interface SupportChatProps {
  onClose?: () => void;
}

const SupportChat = ({ onClose }: SupportChatProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { token } = useAuthStore();
  const { openAlert } = useUIStore();
  const { fetchData } = useFetch<FetchResponse>();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [cargandoTicket, setCargandoTicket] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll automático al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  // Cargar o crear ticket al montar el componente
  useEffect(() => {
    cargarTicketActivo();
  }, []);

  const cargarTicketActivo = async () => {
    try {
      setCargandoTicket(true);
      
      // Obtener tickets del usuario
      const response = await fetchData({
        url: `${import.meta.env.VITE_BACKEND_URL}/soporte/tickets`,
        method: 'GET',
        token,
      });

      if (response?.success && response.data && response.data.length > 0) {
        // Buscar ticket abierto o en proceso
        const ticketResumen = response.data.find(
          (t: any) => t.estado === 'abierto' || t.estado === 'en_proceso'
        );

        if (ticketResumen) {
          // Cargar el ticket completo con todos los mensajes
          const ticketCompleto = await fetchData({
            url: `${import.meta.env.VITE_BACKEND_URL}/soporte/tickets/${ticketResumen.id_ticket}`,
            method: 'GET',
            token,
          });

          if (ticketCompleto?.success && ticketCompleto.data) {
            // El backend devuelve { success: true, data: { success: true, data: ticket } }
            const ticketData = ticketCompleto.data.data || ticketCompleto.data;
            
            setTicket(ticketData);
            setMensajes(ticketData.mensajes || []);
            
            // Marcar mensajes como leídos
            if (ticketResumen.mensajes_no_leidos > 0) {
              await marcarComoLeido(ticketResumen.id_ticket);
            }
          }
        } else {
          // Si no hay ticket activo, crear uno nuevo
          await crearNuevoTicket();
        }
      } else {
        // No hay tickets, crear uno nuevo
        await crearNuevoTicket();
      }
    } catch (error) {
      openAlert('Error al cargar el chat de soporte', 'error');
    } finally {
      setCargandoTicket(false);
    }
  };

  const crearNuevoTicket = async () => {
    try {
      const response = await fetchData({
        url: `${import.meta.env.VITE_BACKEND_URL}/soporte/tickets`,
        method: 'POST',
        body: {
          contenido_inicial: '¡Hola! Necesito ayuda.',
        },
        token,
      });

      if (response?.success && response.data) {
        // El backend devuelve { success: true, data: { success: true, data: ticket } }
        const ticketData = response.data.data || response.data;
        
        setTicket(ticketData);
        setMensajes(ticketData.mensajes || []);
      }
    } catch (error) {
    }
  };

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !ticket) return;
    const mensajeTexto = nuevoMensaje.trim();
    setNuevoMensaje('');
    setEnviando(true);

    try {
      const response = await fetchData({
        url: `${import.meta.env.VITE_BACKEND_URL}/soporte/tickets/${ticket.id_ticket}/mensajes`,
        method: 'POST',
        body: {
          contenido: mensajeTexto,
        },
        token,
      });

      if (response?.success && response.data) {
        // El backend devuelve { success: true, data: { success: true, data: ticket } }
        const ticketData = response.data.data || response.data;
        
        setMensajes(ticketData.mensajes || []);
        // Actualizar el ticket también por si cambió el estado
        if (ticketData.id_ticket) {
          setTicket(ticketData);
        }
      } else {
        openAlert('Error al enviar el mensaje', 'error');
        setNuevoMensaje(mensajeTexto); // Restaurar mensaje
      }
    } catch (error) {
      openAlert('Error al enviar el mensaje', 'error');
      setNuevoMensaje(mensajeTexto); // Restaurar mensaje
    } finally {
      setEnviando(false);
      inputRef.current?.focus();
    }
  };

  const marcarComoLeido = async (ticketId: string) => {
    try {
      await fetchData({
        url: `${import.meta.env.VITE_BACKEND_URL}/soporte/tickets/${ticketId}/leer`,
        method: 'PATCH',
        token,
      });
    } catch (error) {
      // Silenciar error
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);

    const esMismaFecha = (d1: Date, d2: Date) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    const hora = date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (esMismaFecha(date, hoy)) {
      return hora;
    } else if (esMismaFecha(date, ayer)) {
      return `Ayer ${hora}`;
    } else {
      return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  if (cargandoTicket) {
    return (
      <Paper
        elevation={3}
        sx={{
          height: isMobile ? '100vh' : '600px',
          width: '100%',
          maxWidth: isMobile ? '100%' : '450px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: isMobile ? 0 : 2,
        }}
      >
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        height: isMobile ? '100vh' : '600px',
        width: '100%',
        maxWidth: isMobile ? '100%' : '450px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: isMobile ? 0 : 2,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
            <BotIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
              Soporte Técnico
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.95, color: 'rgba(255,255,255,0.95)' }}>
              {ticket?.estado === 'abierto' && 'En línea'}
              {ticket?.estado === 'en_proceso' && 'Respondiendo...'}
              {ticket?.estado === 'cerrado' && 'Ticket cerrado'}
            </Typography>
          </Box>
        </Box>
        {onClose && (
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* Mensajes */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          bgcolor: '#f8f9fa',
          backgroundImage: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        {mensajes.map((mensaje) => (
          <Box
            key={mensaje.id_mensaje_soporte}
            sx={{
              display: 'flex',
              flexDirection: mensaje.es_bot ? 'row' : 'row-reverse',
              alignItems: 'flex-end',
              gap: 1,
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: mensaje.es_bot ? 'secondary.main' : 'primary.main',
              }}
            >
              {mensaje.es_bot ? <BotIcon sx={{ fontSize: 18 }} /> : <PersonIcon sx={{ fontSize: 18 }} />}
            </Avatar>
            <Box
              sx={{
                maxWidth: '75%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: mensaje.es_bot ? 'flex-start' : 'flex-end',
              }}
            >
              <Paper
                elevation={mensaje.es_bot ? 1 : 3}
                sx={{
                  p: 1.5,
                  bgcolor: mensaje.es_bot ? 'white' : '#1976d2',
                  color: mensaje.es_bot ? 'text.primary' : 'white',
                  borderRadius: 2,
                  borderTopLeftRadius: mensaje.es_bot ? 0 : 2,
                  borderTopRightRadius: mensaje.es_bot ? 2 : 0,
                  border: mensaje.es_bot ? '1px solid #e0e0e0' : 'none',
                  boxShadow: mensaje.es_bot ? '0 1px 3px rgba(0,0,0,0.08)' : '0 2px 8px rgba(25,118,210,0.3)',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {mensaje.contenido}
                </Typography>
              </Paper>
              <Typography
                variant="caption"
                sx={{
                  mt: 0.5,
                  color: 'text.secondary',
                  fontSize: '0.7rem',
                }}
              >
                {formatearFecha(mensaje.fecha_creacion)}
              </Typography>
            </Box>
          </Box>
        ))}
        {enviando && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} />
            <Typography variant="caption" color="text.secondary">
              Enviando...
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      {/* Input */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'white',
          display: 'flex',
          gap: 1,
          alignItems: 'flex-end',
        }}
      >
        <TextField
          inputRef={inputRef}
          fullWidth
          multiline
          maxRows={3}
          placeholder="Escribe tu mensaje..."
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={enviando || ticket?.estado === 'cerrado'}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'background.paper',
              '&:hover fieldset': {
                borderColor: '#1976d2',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
          }}
        />
        <IconButton
          color="primary"
          onClick={enviarMensaje}
          disabled={!nuevoMensaje.trim() || enviando || ticket?.estado === 'cerrado'}
          sx={{
            bgcolor: '#1976d2',
            color: 'white',
            boxShadow: '0 2px 8px rgba(25,118,210,0.3)',
            '&:hover': {
              bgcolor: '#1565c0',
              transform: 'scale(1.05)',
              transition: 'all 0.2s',
            },
            '&.Mui-disabled': {
              bgcolor: 'action.disabledBackground',
              boxShadow: 'none',
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default SupportChat;
