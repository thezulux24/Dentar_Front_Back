import { PartialType } from '@nestjs/swagger';
import { CreateAuxiliareDto } from './create-auxiliare.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAuxiliareDto extends PartialType(CreateAuxiliareDto) {
  @ApiPropertyOptional({ description: 'URL del avatar del auxiliar' })
  @IsOptional()
  @IsString()
  avatar_url?: string;

  @ApiPropertyOptional({ description: 'Nueva contraseña del auxiliar' })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  clave?: string;
}
