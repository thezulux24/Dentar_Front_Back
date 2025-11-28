import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { DiagnosticosService } from './diagnosticos.service';
import { CreateDiagnosticoDto } from './dto/create-diagnostico.dto';
import { Roles } from 'src/common/roles/roles.decorator';
import { Role } from 'src/common/roles/roles.enum';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/roles/roles.guard';
// import { DiagnosticoResponseDto } from './dto/diagnostico-response.dto';

@ApiTags('Diagnósticos')
@UseGuards(RolesGuard)
@Controller('diagnosticos')
export class DiagnosticosController {
  constructor(private readonly diagnosticosService: DiagnosticosService) {}

  @Roles(Role.Admin, Role.Odontologo, Role.Auxiliar)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Crear o actualizar el diagnóstico de un paciente' })
  create(@Body() createDiagnosticoDto: CreateDiagnosticoDto) {
    return this.diagnosticosService.create(createDiagnosticoDto);
  }

  @Roles(Role.Admin, Role.Auxiliar, Role.Odontologo)
  @Get(':id_usuario')
  // @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Obtener el último diagnóstico de un paciente' })
  async findOneByUserId(
    @Param('id_usuario') id_usuario: string,
  ){
    return this.diagnosticosService.findOneByUserId(id_usuario);
  }
}
