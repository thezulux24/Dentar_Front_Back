import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TratamientosService } from './tratamientos.service';
import { CreateTratamientoDto } from './dto/create-tratamiento.dto';
import { UpdateTratamientoDto } from './dto/update-tratamiento.dto';
import { FindTratamientosDto } from './dto/find-tratamientos.dto';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Roles } from 'src/common/roles/roles.decorator';
import { Role } from 'src/common/roles/roles.enum';
import { Public } from 'src/common/public/public.decorator';

@ApiTags('Tratamientos')
@Controller('tratamientos')
export class TratamientosController {
  constructor(private readonly tratamientosService: TratamientosService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Auxiliar, Role.Odontologo)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear un nuevo tratamiento',
    description: 'Permite crear un nuevo tratamiento odontológico. Solo disponible para administradores, auxiliares y odontólogos.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tratamiento creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Tratamiento creado exitosamente' },
        data: {
          type: 'object',
          properties: {
            id_tratamiento: { type: 'string', format: 'uuid' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o tratamiento ya existe',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - rol insuficiente',
  })
  create(@Body() createTratamientoDto: CreateTratamientoDto) {
    return this.tratamientosService.create(createTratamientoDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener lista de tratamientos',
    description: 'Obtiene una lista paginada de tratamientos con filtros opcionales. Requiere autenticación.',
  })
  @ApiQuery({
    name: 'pagina',
    required: false,
    type: Number,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'cantidad_por_pagina',
    required: false,
    type: Number,
    description: 'Cantidad de elementos por página',
    example: 10,
  })
  @ApiQuery({
    name: 'nombre',
    required: false,
    type: String,
    description: 'Filtrar por nombre del tratamiento',
    example: 'limpieza',
  })
  @ApiQuery({
    name: 'precio_minimo',
    required: false,
    type: Number,
    description: 'Precio mínimo para filtrar',
    example: 50000,
  })
  @ApiQuery({
    name: 'precio_maximo',
    required: false,
    type: Number,
    description: 'Precio máximo para filtrar',
    example: 500000,
  })
  @ApiQuery({
    name: 'duracion_minima',
    required: false,
    type: Number,
    description: 'Duración mínima en minutos',
    example: 30,
  })
  @ApiQuery({
    name: 'duracion_maxima',
    required: false,
    type: Number,
    description: 'Duración máxima en minutos',
    example: 120,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tratamientos obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        tratamientos: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id_tratamiento: { type: 'string', format: 'uuid' },
              nombre_tratamiento: { type: 'string' },
              descripcion: { type: 'string' },
              precio_estimado: { type: 'number' },
              duracion: { type: 'number' },
              ar_model_url: { type: 'string' },
              imagen_url: { type: 'string' },
              fecha_creacion: { type: 'string', format: 'date' },
            },
          },
        },
        total: { type: 'number' },
        total_paginas: { type: 'number' },
        pagina_actual: { type: 'number' },
        elementos_por_pagina: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  findAll(@Query() query: FindTratamientosDto) {
    return this.tratamientosService.findAll(query);
  }

  @Get('publico')
  @Public()
  @ApiOperation({
    summary: 'Obtener lista pública de tratamientos',
    description: 'Obtiene una lista paginada de tratamientos disponibles públicamente. No requiere autenticación.',
  })
  @ApiQuery({
    name: 'pagina',
    required: false,
    type: Number,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'cantidad_por_pagina',
    required: false,
    type: Number,
    description: 'Cantidad de elementos por página',
    example: 10,
  })
  @ApiQuery({
    name: 'nombre',
    required: false,
    type: String,
    description: 'Filtrar por nombre del tratamiento',
    example: 'limpieza',
  })
  @ApiQuery({
    name: 'precio_minimo',
    required: false,
    type: Number,
    description: 'Precio mínimo para filtrar',
    example: 50000,
  })
  @ApiQuery({
    name: 'precio_maximo',
    required: false,
    type: Number,
    description: 'Precio máximo para filtrar',
    example: 500000,
  })
  @ApiQuery({
    name: 'duracion_minima',
    required: false,
    type: Number,
    description: 'Duración mínima en minutos',
    example: 30,
  })
  @ApiQuery({
    name: 'duracion_maxima',
    required: false,
    type: Number,
    description: 'Duración máxima en minutos',
    example: 120,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista pública de tratamientos obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        tratamientos: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id_tratamiento: { type: 'string', format: 'uuid' },
              nombre_tratamiento: { type: 'string' },
              descripcion: { type: 'string' },
              precio_estimado: { type: 'number' },
              duracion: { type: 'number' },
              ar_model_url: { type: 'string' },
              imagen_url: { type: 'string' },
              fecha_creacion: { type: 'string', format: 'date' },
            },
          },
        },
        total: { type: 'number' },
        total_paginas: { type: 'number' },
        pagina_actual: { type: 'number' },
        elementos_por_pagina: { type: 'number' },
      },
    },
  })
  findAllPublic(@Query() query: FindTratamientosDto) {
    return this.tratamientosService.findAllPublic(query);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener un tratamiento por ID',
    description: 'Obtiene los detalles de un tratamiento específico por su ID. Requiere autenticación.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'ID único del tratamiento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Tratamiento encontrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Tratamiento encontrado exitosamente' },
        data: {
          type: 'object',
          properties: {
            id_tratamiento: { type: 'string', format: 'uuid' },
            nombre_tratamiento: { type: 'string' },
            descripcion: { type: 'string' },
            precio_estimado: { type: 'number' },
            duracion: { type: 'number' },
            ar_model_url: { type: 'string' },
            imagen_url: { type: 'string' },
            fecha_creacion: { type: 'string', format: 'date' },
            fecha_actualizacion: { type: 'string', format: 'date' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Tratamiento no encontrado',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tratamientosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Auxiliar, Role.Odontologo)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar un tratamiento',
    description: 'Actualiza los datos de un tratamiento existente. Solo disponible para administradores, auxiliares y odontólogos.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'ID único del tratamiento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Tratamiento actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Tratamiento actualizado exitosamente' },
        data: {
          type: 'object',
          properties: {
            id_tratamiento: { type: 'string', format: 'uuid' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o tratamiento con mismo nombre ya existe',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - rol insuficiente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tratamiento no encontrado',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTratamientoDto: UpdateTratamientoDto,
  ) {
    return this.tratamientosService.update(id, updateTratamientoDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Auxiliar, Role.Odontologo)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Eliminar un tratamiento (borrado lógico)',
    description: 'Realiza un borrado lógico del tratamiento, marcándolo como eliminado sin borrarlo físicamente de la base de datos. Solo disponible para administradores, auxiliares y odontólogos.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'ID único del tratamiento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Tratamiento eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Tratamiento eliminado exitosamente' },
        data: {
          type: 'object',
          properties: {
            id_tratamiento: { type: 'string', format: 'uuid' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'No se puede eliminar - tratamiento en uso',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - rol insuficiente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tratamiento no encontrado',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tratamientosService.remove(id);
  }
}
