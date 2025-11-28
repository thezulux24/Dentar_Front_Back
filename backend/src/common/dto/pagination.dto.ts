import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { PAGINATION_MAX_PAGE_SIZE } from '../config/constants';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La página debe ser un número entero.' })
  @Min(1, { message: 'La página mínima permitida es 1.' })
  pagina?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La cantidad por página debe ser un número entero.' })
  @Min(1, { message: 'La cantidad mínima permitida es 1.' })
  @Max(PAGINATION_MAX_PAGE_SIZE, {
    message: `La cantidad máxima de elementos permitida es ${PAGINATION_MAX_PAGE_SIZE}.`,
  })
  cantidad_por_pagina?: number = 20;
}
