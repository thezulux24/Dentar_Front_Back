import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  Req,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TratamientosUsuariosService } from './tratamientos_usuarios.service';
import { CreateTratamientoUsuarioDto } from './dto/create-tratamiento-usuario.dto';
import { FindTratamientosUsuariosDto } from './dto/find-tratamientos-usuarios.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Roles } from 'src/common/roles/roles.decorator';
import { Role } from 'src/common/roles/roles.enum';

@ApiTags('Tratamientos de Usuarios')
@UseGuards(RolesGuard)
@Controller('tratamientos-usuarios')
export class TratamientosUsuariosController {
  constructor(
    private readonly tratamientosUsuariosService: TratamientosUsuariosService,
  ) {}

  @Post()
  @Roles(Role.Admin, Role.Auxiliar, Role.Odontologo)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Asignar un tratamiento a un paciente',
    description: 'Crea una nueva relación entre un paciente y un tratamiento. Solo para administradores, auxiliares y odontólogos.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tratamiento asignado exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o relación ya existente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({ status: 404, description: 'Paciente o tratamiento no encontrado' })
  create(@Body() createTratamientoUsuarioDto: CreateTratamientoUsuarioDto) {
    return this.tratamientosUsuariosService.create(createTratamientoUsuarioDto);
  }

  @Get('paciente/:id_paciente')
  @Roles(Role.Admin, Role.Auxiliar, Role.Odontologo)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener tratamientos de un paciente específico',
    description: 'Obtiene una lista paginada de los tratamientos asignados a un paciente. Solo para administradores, auxiliares y odontólogos.',
  })
  @ApiParam({
    name: 'id_paciente',
    type: 'string',
    format: 'uuid',
    description: 'ID del paciente',
  })
  @ApiQuery({ name: 'pagina', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'cantidad_por_pagina', required: false, type: Number, description: 'Resultados por página' })
  @ApiResponse({ status: 200, description: 'Lista de tratamientos del paciente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  findAllByPaciente(
    @Param('id_paciente', ParseUUIDPipe) id_paciente: string,
    @Query() query: FindTratamientosUsuariosDto,
  ) {
    return this.tratamientosUsuariosService.findAllByPaciente(id_paciente, query);
  }

  @Get('mis-tratamientos')
  @Roles(Role.Paciente)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener mis tratamientos (paciente)',
    description: 'Obtiene la lista de tratamientos asignados al paciente autenticado.',
  })
  @ApiQuery({ name: 'pagina', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'cantidad_por_pagina', required: false, type: Number, description: 'Resultados por página' })
  @ApiResponse({ status: 200, description: 'Lista de mis tratamientos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado (solo pacientes)' })
  findMyTratamientos(@Req() req, @Query() query: FindTratamientosUsuariosDto) {
    const id_usuario = req.user.id;
    return this.tratamientosUsuariosService.findMyTratamientos(id_usuario, query);
  }

  @Patch(':id/estado/:nombre_estado')
  @Roles(Role.Admin, Role.Auxiliar, Role.Odontologo)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar estado de un tratamiento asignado',
    description: 'Cambia el estado de un tratamiento asignado a un paciente. Estados válidos: "En progreso", "Finalizado", "Cancelado".',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'ID del tratamiento asignado (id_tratamiento_usuario)',
  })
  @ApiParam({
    name: 'nombre_estado',
    type: 'string',
    description: 'Nombre del nuevo estado',
  })
  @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({ status: 404, description: 'Tratamiento o estado no encontrado' })
  updateEstado(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('nombre_estado') nombre_estado: string,
  ) {
    return this.tratamientosUsuariosService.updateEstado(id, nombre_estado);
  }
}
