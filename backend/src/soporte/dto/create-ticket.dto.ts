import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({
    description: 'Asunto del ticket de soporte',
    example: 'No puedo agendar una cita',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  asunto?: string;

  @ApiProperty({
    description: 'Primer mensaje del ticket',
    example: '¿Cómo puedo agendar una cita con el odontólogo?',
  })
  @IsNotEmpty()
  @IsString()
  contenido_inicial: string;
}
