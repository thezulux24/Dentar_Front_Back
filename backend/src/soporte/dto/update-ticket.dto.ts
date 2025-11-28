import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTicketDto {
  @ApiProperty({
    description: 'Estado del ticket',
    example: 'cerrado',
    enum: ['abierto', 'en_proceso', 'cerrado'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['abierto', 'en_proceso', 'cerrado'])
  estado?: string;

  @ApiProperty({
    description: 'Prioridad del ticket',
    example: 'alta',
    enum: ['baja', 'media', 'alta'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['baja', 'media', 'alta'])
  prioridad?: string;
}
