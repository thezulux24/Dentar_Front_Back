import { IsUUID, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePagoPacienteDto {
  @IsUUID('4', { each: true })
  citas: string[]; // Array de IDs de citas a pagar

  @IsUUID()
  id_parametro_metodo_pago: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
