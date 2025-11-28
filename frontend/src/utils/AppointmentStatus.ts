export type AppointmentStatusKey = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';

export const appointmentStatusMap: Record<AppointmentStatusKey, { label: string; color: string }> = {
    'pendiente': { label: 'Pendiente', color: '#F6D58C' }, // Previously 'sinConfirmacion'
    'confirmada': { label: 'Confirmada', color: '#C1F2FC' }, // Previously 'abono'
    'cancelada': { label: 'Cancelada', color: '#FCC1C2' }, // Previously 'cancelacion'
    'completada': { label: 'Completada', color: '#D3C1FC' }, // Previously 'prioritaria'
};

export const mapEstadoToAppointmentStatusKey = (estado: string): AppointmentStatusKey => {
    switch (estado.toLowerCase()) {
        case "pendiente":
            return "pendiente";
        case "confirmada":
            return "confirmada";
        case "cancelada":
        case "cancelación": // Handle both spellings
            return "cancelada";
        case "completada":
            return "completada";
        default:
            // Fallback for any unmapped states, perhaps 'pendiente' or a new 'default'
            return "pendiente"; 
    }
};
