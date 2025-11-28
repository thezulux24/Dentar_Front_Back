export interface Appointment {
    id_cita: number;
    avatar_doctor: string;
    id_paciente: string;
    id_doctor: string;
    nombre_doctor: string;
    avatar_paciente: string;
    nombre_paciente: string;
    telefono_paciente: string;
    nombre_tratamiento: string;
    motivo: string;
    observaciones: string,
    fecha: string;
    hora_inicio: string; 
    hora_fin: string; 
    ubicacion: string; 
    estado: string;
    id_parametro_estado_cita: string;
}