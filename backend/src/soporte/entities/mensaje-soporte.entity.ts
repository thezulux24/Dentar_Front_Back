export class MensajeSoporte {
  id_mensaje_soporte: string;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
  eliminado?: number;
  fecha_eliminacion?: Date;
  id_ticket?: string;
  id_usuario?: string;
  contenido?: string;
  es_bot?: boolean;
  leido?: boolean;
}
