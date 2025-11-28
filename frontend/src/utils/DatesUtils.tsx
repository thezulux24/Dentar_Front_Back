// dateUtils.ts

// Zona horaria de Colombia (UTC-5)
const TIMEZONE_OFFSET = -5;
const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

/**
 * Convierte una fecha a zona horaria de Colombia
 */
const convertToColombiaTimezone = (date: Date): Date => {
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * TIMEZONE_OFFSET));
};

/**
 * Formatea una fecha al formato YYYY-MM-DDTHH:mm:ss
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

/**
 * Obtiene la fecha actual en zona horaria de Colombia
 */
export const getCurrentDate = (): string => {
  const now = new Date();
  const colombiaDate = convertToColombiaTimezone(now);
  return formatDate(colombiaDate);
};

/**
 * Obtiene el año actual en zona horaria de Colombia
 */
export const getCurrentYear = (): number => {
  const now = new Date();
  const colombiaDate = convertToColombiaTimezone(now);
  return colombiaDate.getFullYear();
};

/**
 * Obtiene la fecha de inicio del día (00:00:00) en Colombia
 */
export const getStartOfDay = (date?: Date | string): string => {
  const baseDate = date ? new Date(date) : new Date();
  const colombiaDate = convertToColombiaTimezone(baseDate);
  
  colombiaDate.setHours(0, 0, 0, 0);
  return formatDate(colombiaDate);
};

/**
 * Obtiene la fecha de fin del día (23:59:59) en Colombia
 */
export const getEndOfDay = (date?: Date | string): string => {
  const baseDate = date ? new Date(date) : new Date();
  const colombiaDate = convertToColombiaTimezone(baseDate);
  
  colombiaDate.setHours(23, 59, 59, 999);
  return formatDate(colombiaDate);
};

/**
 * Obtiene la fecha de inicio de la semana (lunes 00:00:00) en Colombia
 */
export const getStartOfWeek = (date?: Date | string): string => {
  const baseDate = date ? new Date(date) : new Date();
  const colombiaDate = convertToColombiaTimezone(baseDate);
  
  // Lunes como inicio de semana (0 = domingo, 1 = lunes, etc.)
  const day = colombiaDate.getDay();
  const diff = colombiaDate.getDate() - day + (day === 0 ? -6 : 1);
  
  const startOfWeek = new Date(colombiaDate);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  
  return formatDate(startOfWeek);
};

/**
 * Obtiene la fecha de fin de la semana (domingo 23:59:59) en Colombia
 */
export const getEndOfWeek = (date?: Date | string): string => {
  const baseDate = date ? new Date(date) : new Date();
  const colombiaDate = convertToColombiaTimezone(baseDate);
  
  const day = colombiaDate.getDay();
  const diff = colombiaDate.getDate() + (7 - day) - (day === 0 ? 7 : 0);
  
  const endOfWeek = new Date(colombiaDate);
  endOfWeek.setDate(diff);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return formatDate(endOfWeek);
};

/**
 * Valida si una cadena tiene el formato correcto YYYY-MM-DDTHH:mm:ss
 * Retorna true si es válido, false si no lo es
 */
export const validateDateFormat = (dateString: string): boolean => {
  if (!DATE_FORMAT_REGEX.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Convierte una fecha UTC a zona horaria de Colombia
 */
export const convertUTCToColombia = (utcDate: Date | string): string => {
  const date = new Date(utcDate);
  const colombiaDate = convertToColombiaTimezone(date);
  return formatDate(colombiaDate);
};

/**
 * Obtiene la diferencia horaria de Colombia en horas
 */
export const getTimezoneOffset = (): number => {
  return TIMEZONE_OFFSET;
};

/**
 * Verifica si dos fechas son iguales (solo fecha, ignorando hora)
 */
export const isSameDay = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

/**
 * Agrega días a una fecha
 */
export const addDays = (date: string, days: number): string => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  const colombiaDate = convertToColombiaTimezone(d);
  return formatDate(colombiaDate);
};

/**
 * Obtiene el nombre del día de la semana en español
 */
export const getDayName = (date: string): string => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const d = new Date(date);
  const colombiaDate = convertToColombiaTimezone(d);
  return days[colombiaDate.getDay()];
};

/**
 * Obtiene el nombre del mes en español
 */
export const getMonthName = (date: string): string => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const d = new Date(date);
  const colombiaDate = convertToColombiaTimezone(d);
  return months[colombiaDate.getMonth()];
};

/**
 * Formatea una fecha a formato legible: "04-09-2025"
 */
export const formatToReadableDate = (date: string): string => {
  const d = new Date(date);
  const colombiaDate = convertToColombiaTimezone(d);
  // return `${colombiaDate.getDate()}-${colombiaDate.getMonth()}-${colombiaDate.getFullYear()}`

  const day = colombiaDate.getDate().toString().padStart(2, "0");
  const month = (colombiaDate.getMonth() + 1).toString().padStart(2, "0"); // +1 porque getMonth empieza en 0
  const year = colombiaDate.getFullYear();

  return `${day}-${month}-${year}`;
};


/**
 * Convierte hora en formato 24h (HH:MM:SS) a formato 12h con AM/PM
 * @param timeString - Hora en formato "14:00:00" o "14:00"
 * @returns Hora en formato "02:00 PM"
 */
export const formatTimeTo12Hour = (timeString: string): string => {
  // Validar formato básico
  if (!timeString || !/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeString)) {
    return '--';
    throw new Error('Formato de hora inválido. Use HH:MM:SS o HH:MM')
  }

  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Validar rangos
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return '--';
    throw new Error('Hora fuera de rango válido');
  }

  // Convertir a formato 12h
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12; // 0 se convierte en 12
  
  // Formatear con ceros a la izquierda si es necesario
  const formattedHours = String(hours12).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  
  // Si hay segundos, incluirlos, sino solo horas y minutos
  // if (seconds !== undefined && !isNaN(seconds)) {
  //   const formattedSeconds = String(seconds).padStart(2, '0');
  //   return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${period}`;
  // }
  
  return `${formattedHours}:${formattedMinutes} ${period}`;
};


/**
 * Convierte hora en formato 12h (HH:MM AM/PM) a formato 24h
 * @param timeString - Hora en formato "02:30 PM" o "02:30:45 PM"
 * @returns Hora en formato "14:30:00"
 */
export const formatTimeTo24Hour = (timeString: string): string => {
  // Validar formato básico
  const regex = /^(\d{1,2}):(\d{2})(:(\d{2}))?\s*(AM|PM)$/i;
  const match = timeString.match(regex);
  
  if (!match) {
    return '--'
    throw new Error('Formato de hora inválido. Use HH:MM AM/PM o HH:MM:SS AM/PM');
  }

  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const seconds = match[4] ? parseInt(match[4]) : 0;
  const period = match[5].toUpperCase();

  // Validar rangos
  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
    return '--'
    throw new Error('Hora fuera de rango válido');
  }

  // Convertir a formato 24h
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  // Formatear con ceros a la izquierda
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};
