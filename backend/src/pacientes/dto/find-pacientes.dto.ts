import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FindPacientesDto extends PaginationDto {
  @IsOptional()
  @IsString()
  buscar?: string;
}
