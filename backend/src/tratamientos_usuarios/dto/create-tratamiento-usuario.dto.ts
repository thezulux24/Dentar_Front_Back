import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateTratamientoUsuarioDto {
  @ApiProperty({
    description: 'ID del usuario (paciente) al que se le asigna el tratamiento',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'El ID de usuario debe ser un UUID válido' })
  id_usuario: string;

  @ApiProperty({
    description: 'ID del tratamiento que se va a asignar',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'El ID de tratamiento debe ser un UUID válido' })
  id_tratamiento: string;
}
