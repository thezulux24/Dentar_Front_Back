import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsDateString, Matches, MinLength, MaxLength } from 'class-validator';

export class UpdateCitaDto {
  @ApiPropertyOptional({ description: 'ID del paciente' })
  @IsOptional()
  @IsUUID(undefined, { message: 'El formato del ID del paciente no es correcto' })
  @IsString({ message: 'El ID del paciente debe ser una cadena de texto' })
  @MinLength(2, { message: 'El ID del paciente debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El ID del paciente no debe superar los 50 caracteres' })
  id_paciente?: string;

  @ApiPropertyOptional({ description: 'ID del odontólogo' })
  @IsOptional()
  @IsUUID(undefined, { message: 'El formato del ID del odontólogo no es correcto' })
  @IsString({ message: 'El ID del odontólogo debe ser una cadena de texto' })
  @MinLength(2, { message: 'El ID del odontólogo debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El ID del odontólogo no debe superar los 50 caracteres' })
  id_odontologo?: string;

  @ApiPropertyOptional({ description: 'ID del auxiliar' })
  @IsOptional()
  @IsUUID(undefined, { message: 'El formato del ID del auxiliar no es correcto' })
  @IsString({ message: 'El ID del auxiliar debe ser una cadena de texto' })
  @MinLength(2, { message: 'El ID del auxiliar debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El ID del auxiliar no debe superar los 50 caracteres' })
  id_auxiliar?: string;

  @ApiPropertyOptional({ description: 'Fecha de la cita (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de la cita debe tener un formato válido (YYYY-MM-DD)' })
  fecha_cita?: string;

  @ApiPropertyOptional({ description: 'Hora de inicio de la cita (HH:mm o HH:mm:ss)' })
  @IsOptional()
  @IsString({ message: 'La hora de inicio debe ser una cadena de texto' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: 'La hora de inicio debe estar en formato HH:mm o HH:mm:ss',
  })
  hora_inicio_cita?: string;

  @ApiPropertyOptional({ description: 'Hora de fin de la cita (HH:mm o HH:mm:ss)' })
  @IsOptional()
  @IsString({ message: 'La hora de fin debe ser una cadena de texto' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: 'La hora de fin debe estar en formato HH:mm o HH:mm:ss',
  })
  hora_fin_cita?: string;

  @ApiPropertyOptional({ description: 'Motivo de la cita' })
  @IsOptional()
  @IsString({ message: 'El motivo debe ser una cadena de texto' })
  @MinLength(2, { message: 'El motivo debe tener al menos 2 caracteres' })
  @MaxLength(500, { message: 'El motivo no debe superar los 500 caracteres' })
  motivo?: string;

  @ApiPropertyOptional({ description: 'Observaciones de la cita' })
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
  @MinLength(2, { message: 'Las observaciones deben tener al menos 2 caracteres' })
  @MaxLength(500, { message: 'Las observaciones no deben superar los 500 caracteres' })
  observaciones?: string;

  @ApiPropertyOptional({ description: 'ID del parámetro de estado de la cita' })
  @IsOptional()
  @IsUUID()
  id_parametro_estado_cita?: string;
}
