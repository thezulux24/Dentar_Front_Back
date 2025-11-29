import { IsUUID, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePagoDto {
  @IsUUID()
  @IsNotEmpty()
  id_cita: string;

  @IsUUID()
  @IsNotEmpty()
  id_paciente: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  monto: number;

  @IsUUID()
  @IsNotEmpty()
  id_parametro_metodo_pago: string;

  @IsUUID()
  @IsNotEmpty()
  id_parametro_estado_pago: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
