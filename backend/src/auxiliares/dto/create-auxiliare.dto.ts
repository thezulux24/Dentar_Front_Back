import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsDateString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateAuxiliareDto {
  @ApiProperty({ description: 'Correo electrónico del auxiliar' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @MinLength(2, { message: 'El correo electrónico debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El correo electrónico no debe superar los 50 caracteres' })
  email: string;

  @ApiProperty({ description: 'Contraseña del auxiliar' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(50, { message: 'La contraseña no debe superar los 50 caracteres' })
  clave: string;

  @ApiPropertyOptional({ description: 'Nombres del auxiliar' })
  @IsOptional()
  @IsString({ message: 'Los nombres deben ser una cadena de texto' })
  @MinLength(2, { message: 'Los nombres deben tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'Los nombres no deben superar los 50 caracteres' })
  nombres?: string;

  @ApiPropertyOptional({ description: 'Apellidos del auxiliar' })
  @IsOptional()
  @IsString({ message: 'Los apellidos deben ser una cadena de texto' })
  @MinLength(2, { message: 'Los apellidos deben tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'Los apellidos no deben superar los 50 caracteres' })
  apellidos?: string;

  @ApiPropertyOptional({ description: 'Fecha de nacimiento (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de nacimiento debe tener un formato válido (YYYY-MM-DD)' })
  fecha_de_nacimiento?: string;

  @ApiPropertyOptional({ description: 'Dirección del auxiliar' })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @MinLength(2, { message: 'La dirección debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'La dirección no debe superar los 50 caracteres' })
  direccion?: string;

  @ApiPropertyOptional({ description: 'Teléfono de contacto' })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @MinLength(7, { message: 'El teléfono debe tener al menos 7 caracteres' })
  @MaxLength(15, { message: 'El teléfono no debe superar los 15 caracteres' })
  telefono?: string;

  @ApiPropertyOptional({ description: 'Información personal adicional' })
  @IsOptional()
  @IsString({ message: 'La información personal debe ser una cadena de texto' })
  @MinLength(2, { message: 'La información personal debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'La información personal no debe superar los 50 caracteres' })
  informacion_personal?: string;

  @ApiPropertyOptional({ description: 'Número de identificación' })
  @IsOptional()
  @IsString({ message: 'La identificación debe ser una cadena de texto' })
  @MinLength(2, { message: 'La identificación debe tener al menos 2 caracteres' })
  @MaxLength(20, { message: 'La identificación no debe superar los 20 caracteres' })
  identificacion?: string;
}
