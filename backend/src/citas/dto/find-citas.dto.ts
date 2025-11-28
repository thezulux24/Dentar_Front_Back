import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsDateString, IsIn } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FindCitasDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Fecha de inicio del rango de búsqueda (ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de inicio debe tener un formato válido (YYYY-MM-DD).' })
  fecha_inicio?: string;

  @ApiPropertyOptional({ description: 'Fecha de fin del rango de búsqueda (ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fin debe tener un formato válido (YYYY-MM-DD).' })
  fecha_fin?: string;

  @ApiPropertyOptional({ description: 'ID del odontólogo para filtrar las citas' })
  @IsOptional()
  @IsUUID(undefined, { message: 'El formato del ID del odontólogo no es correcto' })
  id_odontologo?: string;

  @ApiPropertyOptional({ description: 'ID del paciente para filtrar las citas' })
  @IsOptional()
  @IsUUID(undefined, { message: 'El formato del ID del paciente no es correcto' })
  id_paciente?: string;

  @ApiPropertyOptional({ description: 'ID del auxiliar para filtrar las citas' })
  @IsOptional()
  @IsUUID(undefined, { message: 'El formato del ID del auxiliar no es correcto' })
  id_auxiliar?: string;

  @ApiPropertyOptional({ description: 'ID del tratamiento para filtrar las citas' })
  @IsOptional()
  @IsUUID(undefined, { message: 'El formato del ID del tratamiento no es correcto' })
  id_tratamiento?: string;

  @ApiPropertyOptional({ description: 'ID del parámetro de estado para filtrar las citas' })
  @IsOptional()
  @IsUUID(undefined, { message: 'El formato del ID del estado de la cita no es correcto' })
  id_parametro_estado_cita?: string;
}
