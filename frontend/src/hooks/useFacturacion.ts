import { useState, useEffect } from 'react';
import useFetch, { FetchResponse } from './useFetch';
import useAuthStore from '../store/authStore';

interface ResumenFacturacion {
  totalFacturado: number;
  totalPagado: number;
  totalPendiente: number;
}

interface PacienteFacturacion {
  id_paciente: string;
  nombre: string;
  identificacion: string;
  ultimaConsulta: string | null;
  totalFacturado: number;
  totalPagado: number;
  saldoPendiente: number;
}

interface PacientesResponse {
  data: PacienteFacturacion[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

export const useFacturacion = () => {
  const [resumen, setResumen] = useState<ResumenFacturacion>({
    totalFacturado: 0,
    totalPagado: 0,
    totalPendiente: 0,
  });
  const [pacientes, setPacientes] = useState<PacienteFacturacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busqueda, setBusqueda] = useState('');

  const { fetchData } = useFetch<FetchResponse>();
  const { token } = useAuthStore();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  // Obtener resumen general
  const obtenerResumen = async () => {
    try {
      const response = await fetchData({
        url: `${baseUrl}/facturacion/resumen`,
        method: 'GET',
        token,
      });
      
      if (response?.success && response.data) {
        setResumen(response.data as ResumenFacturacion);
      }
    } catch (err) {
      console.error('Error al obtener resumen:', err);
    }
  };

  // Obtener lista de pacientes con facturación
  const obtenerPacientes = async (pagActual: number = 1, busq: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {
        pagina: pagActual.toString(),
        limite: '10',
      };

      if (busq) {
        params.busqueda = busq;
      }

      const response = await fetchData({
        url: `${baseUrl}/facturacion/pacientes`,
        method: 'GET',
        params,
        token,
      });
      
      if (response?.success && response.data) {
        const data = response.data as PacientesResponse;
        setPacientes(data.data);
        setTotalPaginas(data.totalPaginas);
        setPagina(data.pagina);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar pacientes');
      console.error('Error al obtener pacientes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar resumen al montar
  useEffect(() => {
    obtenerResumen();
  }, []);

  // Efecto para cargar pacientes cuando cambia la búsqueda o página
  useEffect(() => {
    const timer = setTimeout(() => {
      obtenerPacientes(pagina, busqueda);
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timer);
  }, [pagina, busqueda]);

  const cambiarPagina = (nuevaPagina: number) => {
    setPagina(nuevaPagina);
  };

  const buscar = (texto: string) => {
    setBusqueda(texto);
    setPagina(1); // Resetear a primera página al buscar
  };

  return {
    resumen,
    pacientes,
    loading,
    error,
    pagina,
    totalPaginas,
    busqueda,
    cambiarPagina,
    buscar,
    recargar: () => {
      obtenerResumen();
      obtenerPacientes(pagina, busqueda);
    },
  };
};
