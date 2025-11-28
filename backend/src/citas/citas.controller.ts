import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { FindCitasByPacienteDto } from './dto/find-citas-paciente.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { FindCitasDto } from './dto/find-citas.dto';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Roles } from 'src/common/roles/roles.decorator';
import { Role } from 'src/common/roles/roles.enum';
import { CancelCitaPacienteDto } from './dto/cancel-cita-paciente-dto';
import { UpdateCitaPacienteDto } from './dto/update-cita-paciente.dto';


@Controller('citas')
@ApiTags('Citas')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  
  @Roles(Role.Admin, Role.Odontologo, Role.Auxiliar, Role.Paciente)
  @Post()
  @ApiOperation({ summary: 'Crear una cita médica' })
  create(@Body() createCitaDto: CreateCitaDto) {
    return this.citasService.create(createCitaDto);
  }

  @Roles(Role.Admin, Role.Odontologo, Role.Auxiliar)
  @Get()
  @ApiOperation({ summary: 'Obtener todas las citas con filtros opcionales' })
  findAll(@Query() query: FindCitasDto) {
    return this.citasService.findAll(query);
  }

  @Roles(Role.Paciente)
  @Get('paciente')
  @ApiOperation({ summary: 'Obtener las citas de un paciente por un rango de fechas' })
  findAllByPaciente(
    @Request() req,
    @Query() query: FindCitasByPacienteDto,
  ) {
    return this.citasService.findAllByPaciente(req.user.id, query);
  }

  @Roles(Role.Paciente)
  @Patch('paciente/cancelar/:id_cita')
  @ApiOperation({ summary: 'Cancelar una cita médica por un paciente' })
  cancelByPaciente(@Request() req, @Param() param: CancelCitaPacienteDto) {
    return this.citasService.cancelByPaciente(param.id_cita, req.user.id);
  }

  @Roles(Role.Admin, Role.Odontologo, Role.Auxiliar)
  @Patch('cancelar/:id_cita')
  @ApiOperation({ summary: 'Cancelar una cita médica' })
  cancel(@Request() req, @Param() param: CancelCitaPacienteDto) {
    return this.citasService.cancel(param.id_cita);
  }
  
  @Roles(Role.Paciente)
  @Patch('/paciente/actualizar/:id')
  @ApiOperation({ summary: 'Actualizar una cita médica por paciente' })
  updateByPaciente(@Request() req, @Param('id') id: string, @Body() updateCitaDto: UpdateCitaPacienteDto) {
    return this.citasService.updateByPaciente(id, req.user.id, updateCitaDto);
  }

  @Roles(Role.Admin, Role.Odontologo, Role.Auxiliar, Role.Paciente)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una cita médica por un id' })
  findOne(@Param('id') id: string) {
    return this.citasService.findOne(id);
  }

  @Roles(Role.Admin, Role.Odontologo, Role.Auxiliar)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una cita médica' })
  update(@Param('id') id: string, @Body() updateCitaDto: UpdateCitaDto) {
    return this.citasService.update(id, updateCitaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.citasService.remove(+id);
  }
}
