import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FindCitasByPacienteDto extends PaginationDto {
  @ApiProperty({
    description: 'Fecha de inicio del rango de búsqueda en formato ISO (YYYY-MM-DD).',
    example: '2025-01-01 / 2025-01-01T14:30:00',
    required: true,
  })
  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria.' })
  @IsDateString({}, { message: 'La fecha de inicio debe tener un formato válido (YYYY-MM-DD).' })
  fecha_inicio: string;

  @ApiProperty({
    description: 'Fecha de fin del rango de búsqueda en formato ISO (YYYY-MM-DD).',
    example: '2025-01-31 / 2025-01-31T14:30:00',
    required: true,
  })
  @IsNotEmpty({ message: 'La fecha de fin es obligatoria.' })
  @IsDateString({}, { message: 'La fecha de fin debe tener un formato válido (YYYY-MM-DD).' })
  fecha_fin: string;
}