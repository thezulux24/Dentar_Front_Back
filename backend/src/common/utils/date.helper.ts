import { DateTime } from 'luxon';
import { TIMEZONE } from '../config/constants';

export class DateHelper {
  private static readonly BUSINESS_TIMEZONE = TIMEZONE;

  /**
   * Devuelve la fecha y hora actual en UTC como Date.
   */
  static nowUTC(): Date {
    return DateTime.utc().toJSDate();
  }

  /**
   * Devuelve la fecha y hora actual en la zona de negocio,
   * convertida a UTC para guardar en la base.
   */
  static nowBusinessUTC(): Date {
    return DateTime.now().setZone(this.BUSINESS_TIMEZONE);
  }

  /**
   * Convierte una fecha (YYYY-MM-DD) y una hora (HH:mm)
   * a UTC como objeto Date.
   */
  static toUTCFromDateAndTime(fecha: string, hora: string): Date {
    return DateTime.fromISO(
      `${fecha}T${hora}`,
      { zone: this.BUSINESS_TIMEZONE }
    ).toUTC().toJSDate();
  }

  /**
   * Convierte una fecha (YYYY-MM-DD) y una hora (HH:mm)
   * a DateTime en la zona de negocio (sin UTC).
   */
  static toBusinessDateTime(fecha: string, hora: string): DateTime {
    return DateTime.fromISO(
      `${fecha}T${hora}`,
      { zone: this.BUSINESS_TIMEZONE }
    ).toJSDate();
  }

  /**
   * Convierte un string ISO a UTC como objeto Date.
   */
  static toUTCFromISO(isoString: string): Date {
    return DateTime.fromISO(isoString, { zone: this.BUSINESS_TIMEZONE }).toUTC().toJSDate();
  }

  /**
   * Normaliza cualquier objeto Date a UTC.
   */
  static toUTC(date: Date): Date {
    return DateTime.fromJSDate(date).toUTC().toJSDate();
  }

  /**
   * Convierte una fecha UTC a la zona horaria del negocio.
   */
  static toTimezone(date: Date): DateTime {
    return DateTime.fromJSDate(date).setZone(this.BUSINESS_TIMEZONE);
  }
}
