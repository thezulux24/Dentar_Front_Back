import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CancelCitaPacienteDto {
  @ApiProperty({ description: 'ID del paciente' })
  @IsNotEmpty({ message: 'El ID de la cita no puede estar vacío' })
  @IsUUID(undefined, { message: 'El formato del ID de la cita no es correcto' })
  id_cita: string;
}