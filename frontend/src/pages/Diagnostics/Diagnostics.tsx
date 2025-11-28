import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, InputAdornment,
  Grid, Card, CardContent, Avatar, Button, Pagination, CircularProgress, Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useFetch, { FetchResponse } from '../../hooks/useFetch';
import useAuthStore from '../../store/authStore';

interface Paciente {
  id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  fecha_nacimiento: string | null;
  alergias: string | null;
  fecha_ultima_cita: string | null;
  foto_de_perfil: string | null;
}

interface PacientesResponse {
  pacientes: Paciente[];
  total_items: number;
  total_paginas: number;
  cantidad_por_pagina: number;
  pagina_actual: number;
}

const Diagnostics: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState<Paciente[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(18); // Default items per page
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fetchData } = useFetch<FetchResponse<PacientesResponse>>();
  const { token } = useAuthStore();

  const fetchPatients = async (searchTerm: string, page: number, limit: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchData({
        url: `${import.meta.env.VITE_BACKEND_URL}/pacientes?buscar=${encodeURIComponent(searchTerm)}&pagina=${page}&cantidad_por_pagina=${limit}`,
        method: 'GET',
        token: token
      });

      if (response.success && response.data) {
        setPatients(response.data.pacientes);
        setTotalItems(response.data.total_items);
        setTotalPages(response.data.total_paginas);
        setCurrentPage(response.data.pagina_actual);
        setItemsPerPage(response.data.cantidad_por_pagina);
      } else {
        setError(response.message || "Error al cargar pacientes");
        setPatients([]);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError("Error al conectar con el servidor.");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(search, currentPage, itemsPerPage);
  }, [search, currentPage, itemsPerPage, token]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{
      p: {
        xs: 4,
        sm: 6,
        md: 8
      }
    }}>
      <Typography variant="h5">
        Diagnósticos
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        Paciente existente
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <TextField
          placeholder="Buscar"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }

          }}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={()=>navigate('/doctor/diagnosticos/nuevo')}
        >
          Nuevo diagnóstico
        </Button>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box my={4}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {!loading && !error && patients.length === 0 && search.length > 0 && (
        <Box my={4}>
          <Alert severity="info">No se encontraron pacientes con el término "{search}".</Alert>
        </Box>
      )}

      {!loading && !error && patients.length === 0 && search.length === 0 && (
        <Box my={4}>
          <Alert severity="info">No hay pacientes registrados.</Alert>
        </Box>
      )}

      {!loading && !error && totalItems > 0 && (
        <Box mb={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Total de pacientes: {totalItems}
          </Typography>
        </Box>
      )}

      {!loading && !error && patients.length > 0 && (
        <Grid container spacing={3}>
          <AnimatePresence mode="wait">
            {patients.map((paciente) => (
              <Grid key={paciente.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.1 }}
                  style={{ flex: 1, height:'100%' }}
                >
                  <Card variant="outlined" sx={{ borderRadius: 3, cursor: 'pointer', height: '100%', display: 'flex', flexGrow: 1 }} onClick={() => navigate(`/doctor/diagnosticos/${paciente.id}`)}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, width:'100%' }}>
                      <Avatar 
                        src={`${import.meta.env.VITE_FILES_URL}${paciente.foto_de_perfil}`}
                        alt={`${paciente.nombres} ${paciente.apellidos}`} 
                        sx={{ width: 64, height: 64 }}>
                        {paciente.nombres ? paciente.nombres[0] : ''}
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight="bold" 
                          sx={{
                            display: 'block',       // asegura que se comporte como bloque
                            width: '100%',          // ocupa todo el ancho del contenedor padre
                            overflow: 'hidden',     
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',   // garantiza una sola línea
                          }}
                        >
                          Nombre: 
                          { paciente.nombres || paciente.apellidos 
                            ? ` ${paciente.nombres} ${paciente.apellidos}`
                            : ' __________'
                          }
                        </Typography>

                        <Typography variant="body2">
                          Edad: { paciente.fecha_nacimiento 
                            ? new Date(paciente.fecha_nacimiento).toLocaleDateString()
                            : ' __'
                          }
                        </Typography>

                        <Typography variant="body2">
                          Última Consulta: {
                            paciente.fecha_ultima_cita
                            ? new Date(paciente.fecha_ultima_cita).toLocaleDateString()
                            : ' __'
                          }
                        </Typography>
                        
                        <Typography variant="body2">
                          Alergias: {
                            paciente.alergias
                            ? paciente.alergias
                            : ' __'
                          }
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}

      {totalPages > 1 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default Diagnostics;
