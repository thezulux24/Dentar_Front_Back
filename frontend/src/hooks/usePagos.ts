import { useState, useEffect } from 'react';
import useFetch, { FetchResponse } from './useFetch';
import useAuthStore from '../store/authStore';

interface CitaPendiente {
  id_cita: string;
  fecha_cita: string;
  motivo: string;
  nombre_tratamiento: string;
  odontologo: string;
  monto: number;
  pagado: number;
  saldo_pendiente: number;
}

interface CitasPendientesResponse {
  citas: CitaPendiente[];
  total_pendiente: number;
}

interface MetodoPago {
  id_parametro: string;
  nombre: string;
}

interface PagoHistorial {
  id_pago: string;
  monto: number;
  fecha_pago: string;
  metodo_pago: string;
  estado: string;
  observaciones: string | null;
  cita: {
    fecha: string;
    motivo: string;
    tratamiento: string;
  };
}

interface HistorialPagosResponse {
  pagos: PagoHistorial[];
  total_pagado: number;
  cantidad_pagos: number;
}

export const usePagos = () => {
  const [citasPendientes, setCitasPendientes] = useState<CitaPendiente[]>([]);
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [historialPagos, setHistorialPagos] = useState<PagoHistorial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPendiente, setTotalPendiente] = useState(0);

  const { fetchData } = useFetch<FetchResponse>();
  const { token } = useAuthStore();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  // Obtener citas pendientes de pago
  const obtenerCitasPendientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchData({
        url: `${baseUrl}/pagos/mis-citas-pendientes`,
        method: 'GET',
        token,
      });

      // El backend retorna { success, message, data }
      if (response && response.success) {
        const data = response.data as CitasPendientesResponse;
        if (data && data.citas) {
          setCitasPendientes(data.citas);
          setTotalPendiente(data.total_pendiente);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar citas pendientes');
    } finally {
      setLoading(false);
    }
  };

  // Obtener métodos de pago disponibles
  const obtenerMetodosPago = async () => {
    try {
      const response = await fetchData({
        url: `${baseUrl}/pagos/metodos-pago`,
        method: 'GET',
        token,
      });

      if (response?.success && response.data) {
        setMetodosPago(response.data as MetodoPago[]);
      }
    } catch (err) {
      console.error('Error al obtener métodos de pago:', err);
    }
  };

  // Registrar pago
  const registrarPago = async (citas: string[], id_metodo_pago: string, observaciones?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchData({
        url: `${baseUrl}/pagos/registrar`,
        method: 'POST',
        body: {
          citas,
          id_parametro_metodo_pago: id_metodo_pago,
          observaciones,
        },
        token,
      });

      if (response?.success) {
        // Recargar citas pendientes después del pago
        await obtenerCitasPendientes();
        return { success: true, data: response.data };
      } else {
        throw new Error(response?.message || 'Error al registrar el pago');
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrar el pago');
      console.error('Error al registrar pago:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Obtener historial de pagos
  const obtenerHistorial = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchData({
        url: `${baseUrl}/pagos/mis-pagos`,
        method: 'GET',
        token,
      });

      if (response?.success && response.data) {
        const data = response.data as HistorialPagosResponse;
        setHistorialPagos(data.pagos);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar historial');
      console.error('Error al obtener historial:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      await obtenerCitasPendientes();
      await obtenerMetodosPago();
    };
    cargarDatos();
  }, []); // Array vacío para que solo se ejecute una vez

  return {
    citasPendientes,
    metodosPago,
    historialPagos,
    loading,
    error,
    totalPendiente,
    registrarPago,
    obtenerHistorial,
    recargar: obtenerCitasPendientes,
  };
};
