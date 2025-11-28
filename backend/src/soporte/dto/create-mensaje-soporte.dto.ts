import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMensajeSoporteDto {
  @ApiProperty({
    description: 'Contenido del mensaje de soporte',
    example: '¿Puedo cambiar la fecha de mi cita?',
  })
  @IsNotEmpty()
  @IsString()
  contenido: string;
}
