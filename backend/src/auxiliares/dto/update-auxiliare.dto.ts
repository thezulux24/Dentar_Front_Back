import { PartialType } from '@nestjs/swagger';
import { CreateAuxiliareDto } from './create-auxiliare.dto';

export class UpdateAuxiliareDto extends PartialType(CreateAuxiliareDto) {}
