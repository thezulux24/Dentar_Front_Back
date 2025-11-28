import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum TiposParametrosPermitidos {
  ESTADOS_CITA = 'estado_de_cita',
  ROL_USUARIO = 'rol_de_usuario',
  METODOS_PAGO = 'metodo_de_pago',
  ESTADOS_PAGO = 'estado_de_pago',
  ESTADOS_TRATAMIENTO = 'estado_de_tratamiento',
  ESTADOS_MENSAJE = 'estado_de_mensaje'
}

export class FindParametroDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(TiposParametrosPermitidos)
  tipo_parametro: string;
}
