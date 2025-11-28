import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsUrl, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTratamientoDto {
  @ApiProperty({
    description: 'Nombre del tratamiento odontológico',
    example: 'Limpieza dental',
    maxLength: 100,
  })
  @IsString({ message: 'El nombre del tratamiento debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El nombre del tratamiento no puede exceder 100 caracteres' })
  nombre_tratamiento: string;

  @ApiProperty({
    description: 'Descripción detallada del tratamiento',
    example: 'Procedimiento de limpieza profunda que incluye remoción de placa y sarro',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @ApiProperty({
    description: 'Precio estimado del tratamiento en pesos colombianos',
    example: 150000,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número válido con máximo 2 decimales' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  precio_estimado?: number;

  @ApiProperty({
    description: 'Duración estimada del tratamiento en minutos',
    example: 60,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La duración debe ser un número entero' })
  @Min(1, { message: 'La duración debe ser mayor a 0 minutos' })
  duracion?: number;

  @ApiProperty({
    description: 'URL del modelo 3D en realidad aumentada del tratamiento',
    example: 'https://example.com/models/limpieza-dental.glb',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La URL del modelo AR debe ser una cadena de texto' })
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  @MaxLength(255, { message: 'La URL del modelo AR no puede exceder 255 caracteres' })
  ar_model_url?: string;

  @ApiProperty({
    description: 'URL de la imagen representativa del tratamiento',
    example: 'https://example.com/images/limpieza-dental.jpg',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La URL de la imagen debe ser una cadena de texto' })
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  @MaxLength(255, { message: 'La URL de la imagen no puede exceder 255 caracteres' })
  imagen_url?: string;
}
