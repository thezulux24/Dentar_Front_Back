import { PartialType } from '@nestjs/swagger';
import { CreateTratamientoDto } from './create-tratamiento.dto';

export class UpdateTratamientoDto extends PartialType(CreateTratamientoDto) {}
