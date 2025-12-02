import { IsUUID, IsNumber, IsOptional, IsString, Min, IsArray } from 'class-validator';

export class CreatePagoPacienteDto {
  @IsArray()
  @IsUUID('4', { each: true })
  citas: string[]; // Array de IDs de citas a pagar

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tratamientos?: string[]; // Array de IDs de tratamientos a pagar

  @IsUUID()
  id_parametro_metodo_pago: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
