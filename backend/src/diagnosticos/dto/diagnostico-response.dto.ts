import {
  IsString,
  IsOptional,
  IsDate,
  IsEmail,
  ValidateNested,
  IsUUID,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  InformacionPersonalDto,
  InformacionAcudienteDto,
  HistorialMedicoDto,
  InformacionTratamientoDto,
  AnamnesisDto,
  ExamenFisicoDto,
  OdontogramaDto,
  OdontogramaDenticionDto,
  PlanTratamientoDto,
  ResumenDto,
} from './create-diagnostico.dto';

export class DiagnosticoResponseDto {
  @IsString()
  @IsUUID()
  id_diagnostico: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fecha_diagnostico: Date | null;

  @ValidateNested()
  @Type(() => InformacionPersonalDto)
  informacion_personal: InformacionPersonalDto;

  @ValidateNested()
  @Type(() => InformacionAcudienteDto)
  @IsOptional()
  informacion_acudiente?: InformacionAcudienteDto;

  @ValidateNested()
  @Type(() => HistorialMedicoDto)
  @IsOptional()
  historial_medico?: HistorialMedicoDto;

  @ValidateNested()
  @Type(() => InformacionTratamientoDto)
  @IsOptional()
  informacion_tratamiento?: InformacionTratamientoDto;

  @ValidateNested()
  @Type(() => AnamnesisDto)
  @IsOptional()
  anamnesis?: AnamnesisDto;

  @ValidateNested()
  @Type(() => ExamenFisicoDto)
  @IsOptional()
  examen_fisico?: ExamenFisicoDto;

  @ValidateNested()
  @Type(() => OdontogramaDto)
  @IsOptional()
  odontograma?: OdontogramaDto;

  @ValidateNested()
  @Type(() => OdontogramaDenticionDto)
  @IsOptional()
  odontograma_denticion?: OdontogramaDenticionDto;

  @ValidateNested()
  @Type(() => PlanTratamientoDto)
  @IsOptional()
  plan_tratamiento?: PlanTratamientoDto;

  @ValidateNested()
  @Type(() => ResumenDto)
  @IsOptional()
  resumen?: ResumenDto;
}
