import {
  IsEmail,
  IsString,
  IsDateString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOdontologoDto {
  @ApiPropertyOptional({ description: 'Nombres del paciente' })
  @IsOptional()
  @IsString({ message: 'Los nombres deben ser una cadena de texto' })
  @MinLength(2, { message: 'Los nombres deben tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'Los nombres no deben superar los 50 caracteres' })
  nombres?: string;

  @ApiPropertyOptional({ description: 'Apellidos del paciente' })
  @IsOptional()
  @IsString({ message: 'Los apellidos deben ser una cadena de texto' })
  @MinLength(2, { message: 'Los apellidos deben tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'Los apellidos no deben superar los 50 caracteres' })
  apellidos?: string;

  @ApiPropertyOptional({ description: 'Información personal' })
  @IsOptional()
  @IsString({ message: 'La información personal debe ser una cadena de texto' })
  @MinLength(2, { message: 'La información personal debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'La información personal no debe superar los 50 caracteres' })
  informacion_personal?: string;

  @ApiPropertyOptional({ description: 'Fecha de nacimiento (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de nacimiento debe tener un formato válido (YYYY-MM-DD)' })
  fecha_de_nacimiento?: string;

  @ApiPropertyOptional({ description: 'Correo electrónico del paciente' })
  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @MaxLength(50, { message: 'El correo electrónico no debe superar los 50 caracteres' })
  email?: string;

  @ApiPropertyOptional({ description: 'Teléfono de contacto' })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @MinLength(7, { message: 'El teléfono debe tener al menos 7 caracteres' })
  @MaxLength(15, { message: 'El teléfono no debe superar los 15 caracteres' })
  telefono?: string;

  @ApiPropertyOptional({ description: 'Dirección de residencia' })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @MinLength(2, { message: 'La dirección debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'La dirección no debe superar los 50 caracteres' })
  direccion?: string;

  @ApiPropertyOptional({ description: 'Número de identificación' })
  @IsOptional()
  @IsString({ message: 'La identificación debe ser una cadena de texto' })
  @MinLength(2, { message: 'La identificación debe tener al menos 2 caracteres' })
  @MaxLength(20, { message: 'La identificación no debe superar los 20 caracteres' })
  identificacion?: string;

  @ApiPropertyOptional({ description: 'URL del avatar del odontólogo' })
  @IsOptional()
  @IsString({ message: 'La URL debe ser una cadena de texto' })
  avatar_url?: string;

  @ApiPropertyOptional({ description: 'Especialidad del odontólogo' })
  @IsOptional()
  @IsString({ message: 'La especialidad debe ser una cadena de texto' })
  @MinLength(2, { message: 'La especialidad debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'La especialidad no debe superar los 100 caracteres' })
  especialidad?: string;

  @ApiPropertyOptional({ description: 'Horario de trabajo del odontólogo' })
  @IsOptional()
  @IsString({ message: 'El horario de trabajo debe ser una cadena de texto' })
  @MinLength(2, { message: 'El horario de trabajo debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El horario de trabajo no debe superar los 100 caracteres' })
  horario_trabajo?: string;

  @ApiPropertyOptional({ description: 'Firma digital del odontólogo' })
  @IsOptional()
  @IsString({ message: 'La firma digital debe ser una cadena de texto' })
  @MinLength(2, { message: 'La firma digital debe tener al menos 2 caracteres' })
  @MaxLength(255, { message: 'La firma digital no debe superar los 255 caracteres' })
  firma_digital?: string;

  @ApiPropertyOptional({ description: 'Sede donde trabaja el odontólogo' })
  @IsOptional()
  @IsString({ message: 'La sede debe ser una cadena de texto' })
  @MinLength(2, { message: 'La sede debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'La sede no debe superar los 100 caracteres' })
  sede?: string;
}
