import {
  IsString,
  IsOptional,
  IsDate,
  IsEmail,
  ValidateNested,
  IsUUID,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

// Nested DTOs for each section of the form

export class InformacionPersonalDto {
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fecha_nacimiento: Date | null;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  documento: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  direccion: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  barrio: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  ocupacion: string;
}

export class InformacionAcudienteDto {
  @IsString()
  @IsOptional()
  nombre_acudiente: string;

  @IsString()
  @IsOptional()
  apellido_acudiente: string;

  @IsString()
  @IsOptional()
  tel_acudiente: string;

  @IsString()
  @IsOptional()
  ocupacion: string | null;
}

export class HistorialMedicoDto {
  @IsString()
  @IsOptional()
  condiciones_previas: string;

  @IsString()
  @IsOptional()
  alergias: string;

  @IsString()
  @IsOptional()
  medicamentos_actuales: string;
}

export class InformacionTratamientoDto {
  @IsString()
  @IsOptional()
  motivo_consulta: string;

  @IsString()
  @IsOptional()
  procedimiento_principal: string;

  @IsString()
  @IsOptional()
  notas_relevantes: string | null;

  @IsString()
  @IsOptional()
  eps: string;
}

export class AnamnesisDto {
  @IsString()
  @IsOptional()
  tratamiento_medico: string;

  @IsString()
  @IsOptional()
  ingestion_medicamentos: string;

  @IsString()
  @IsOptional()
  reacciones_alergicas: string;

  @IsString()
  @IsOptional()
  hemorragias: string;

  @IsString()
  @IsOptional()
  irradiaciones: string;

  @IsString()
  @IsOptional()
  sinusitis: string;

  @IsString()
  @IsOptional()
  enfermedades_respiratorias: string;

  @IsString()
  @IsOptional()
  cardiopatias: string;

  @IsString()
  @IsOptional()
  diabetes: string;

  @IsString()
  @IsOptional()
  fiebre_reumatica: string | null;

  @IsString()
  @IsOptional()
  hepatitis: string;

  @IsString()
  @IsOptional()
  hipertension_arterial: string;

  @IsString()
  @IsOptional()
  vih_sida: string;

  @IsString()
  @IsOptional()
  habito_higiene_oral: string;
}

export class ExamenFisicoDto {
  @IsString()
  @IsOptional()
  artic_tempora_mandibular: string;

  @IsString()
  @IsOptional()
  labios: string;

  @IsString()
  @IsOptional()
  lengua: string;

  @IsString()
  @IsOptional()
  paladar: string;

  @IsString()
  @IsOptional()
  piso_de_boca: string;

  @IsString()
  @IsOptional()
  carrillos: string;

  @IsString()
  @IsOptional()
  glandulas_salivales: string;

  @IsString()
  @IsOptional()
  maxilares: string;

  @IsString()
  @IsOptional()
  senos_maxilares: string;

  @IsString()
  @IsOptional()
  musculos_masticadores: string;

  @IsString()
  @IsOptional()
  nervios: string;

  @IsString()
  @IsOptional()
  vascular: string;

  @IsString()
  @IsOptional()
  linfatico_regional: string;

  @IsString()
  @IsOptional()
  funciones_de_oclusion: string;
}

export class OdontogramaDto {
  @IsString()
  @IsOptional()
  supernumerarios: string;

  @IsString()
  @IsOptional()
  abrasion: string;

  @IsString()
  @IsOptional()
  manchas: string;

  @IsString()
  @IsOptional()
  patologia_pulpar: string;

  @IsString()
  @IsOptional()
  placa_blanda: string;

  @IsString()
  @IsOptional()
  placa_calcificada: string;
}

export class OdontogramaDenticionDto {
  @IsString()
  @IsOptional()
  '18': string;
  @IsString()
  @IsOptional()
  '38': string;
  @IsString()
  @IsOptional()
  '17': string;
  @IsString()
  @IsOptional()
  '37': string;
  @IsString()
  @IsOptional()
  '16': string;
  @IsString()
  @IsOptional()
  '36': string;
  @IsString()
  @IsOptional()
  '55 - 15': string;
  @IsString()
  @IsOptional()
  '75 - 35': string;
  @IsString()
  @IsOptional()
  '54 - 14': string;
  @IsString()
  @IsOptional()
  '74 - 34': string;
  @IsString()
  @IsOptional()
  '53 - 13': string;
  @IsString()
  @IsOptional()
  '73 - 33': string;
  @IsString()
  @IsOptional()
  '52 - 12': string;
  @IsString()
  @IsOptional()
  '72 - 32': string;
  @IsString()
  @IsOptional()
  '51 - 11': string;
  @IsString()
  @IsOptional()
  '71 - 31': string;
  @IsString()
  @IsOptional()
  '61 - 21': string;
  @IsString()
  @IsOptional()
  '81 - 41': string;
  @IsString()
  @IsOptional()
  '62 - 22': string;
  @IsString()
  @IsOptional()
  '82 - 42': string;
  @IsString()
  @IsOptional()
  '63 - 23': string;
  @IsString()
  @IsOptional()
  '83 - 43': string;
  @IsString()
  @IsOptional()
  '64 - 24': string;
  @IsString()
  @IsOptional()
  '84 - 44': string;
  @IsString()
  @IsOptional()
  '65 - 25': string;
  @IsString()
  @IsOptional()
  '85 - 45': string;
  @IsString()
  @IsOptional()
  '26': string;
  @IsString()
  @IsOptional()
  '46': string;
  @IsString()
  @IsOptional()
  '27': string;
  @IsString()
  @IsOptional()
  '47': string;
  @IsString()
  @IsOptional()
  '28': string;
  @IsString()
  @IsOptional()
  '48': string;
}

export enum LadoLimpieza {
  Izquierdo = 'Izquierdo',
  Derecho = 'Derecho',
  Ambos = 'Ambos',
  Ninguno = 'Ninguno',
}

export class PlanTratamientoDto {
  @IsString()
  @IsOptional()
  remision: string;

  @IsString()
  @IsOptional()
  limpieza_profunda: string;

  @IsString()
  @IsOptional()
  clasificacion_angle: string;

  @IsString()
  @IsOptional()
  atm: string;

  @IsEnum(LadoLimpieza)
  @IsOptional()
  lado_limpieza: LadoLimpieza;
}

export class ResumenDto {
  @IsString()
  @IsOptional()
  notas_medico: string;
}

export class CreateDiagnosticoDto {
  @ValidateNested()
  @Type(() => InformacionPersonalDto)
  informacion_personal: InformacionPersonalDto;

  @ValidateNested()
  @Type(() => InformacionAcudienteDto)
  @IsOptional()
  informacion_acudiente: InformacionAcudienteDto;

  @ValidateNested()
  @Type(() => HistorialMedicoDto)
  @IsOptional()
  historial_medico: HistorialMedicoDto;

  @ValidateNested()
  @Type(() => InformacionTratamientoDto)
  @IsOptional()
  informacion_tratamiento: InformacionTratamientoDto;

  @ValidateNested()
  @Type(() => AnamnesisDto)
  @IsOptional()
  anamnesis: AnamnesisDto;

  @ValidateNested()
  @Type(() => ExamenFisicoDto)
  @IsOptional()
  examen_fisico: ExamenFisicoDto;

  @ValidateNested()
  @Type(() => OdontogramaDto)
  @IsOptional()
  odontograma: OdontogramaDto;

  @ValidateNested()
  @Type(() => OdontogramaDenticionDto)
  @IsOptional()
  odontograma_denticion: OdontogramaDenticionDto;

  @ValidateNested()
  @Type(() => PlanTratamientoDto)
  @IsOptional()
  plan_tratamiento: PlanTratamientoDto;

  @ValidateNested()
  @Type(() => ResumenDto)
  @IsOptional()
  resumen: ResumenDto;

  @IsString()
  @IsUUID()
  @IsOptional()
  id_odontologo?: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  id_cita?: string;
}
