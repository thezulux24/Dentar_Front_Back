import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FindTratamientosDto extends PaginationDto {
  @ApiProperty({
    description: 'Filtrar por nombre del tratamiento (búsqueda parcial)',
    example: 'limpieza',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre?: string;

  @ApiProperty({
    description: 'Precio mínimo para filtrar tratamientos',
    example: 50000,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio mínimo debe ser un número válido' })
  @Min(0, { message: 'El precio mínimo no puede ser negativo' })
  precio_minimo?: number;

  @ApiProperty({
    description: 'Precio máximo para filtrar tratamientos',
    example: 500000,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio máximo debe ser un número válido' })
  @Min(0, { message: 'El precio máximo no puede ser negativo' })
  precio_maximo?: number;

  @ApiProperty({
    description: 'Duración mínima en minutos para filtrar tratamientos',
    example: 30,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La duración mínima debe ser un número' })
  @Min(1, { message: 'La duración mínima debe ser mayor a 0' })
  duracion_minima?: number;

  @ApiProperty({
    description: 'Duración máxima en minutos para filtrar tratamientos',
    example: 120,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La duración máxima debe ser un número' })
  @Min(1, { message: 'La duración máxima debe ser mayor a 0' })
  duracion_maxima?: number;
}
