import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Roles } from 'src/common/roles/roles.decorator';
import { Role } from 'src/common/roles/roles.enum';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Public } from 'src/common/public/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { FindPacientesDto } from './dto/find-pacientes.dto';

@ApiTags('Pacientes')
@UseGuards(RolesGuard)
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Registrar un paciente' })
  async create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacientesService.create(createPacienteDto);
  }

  @Roles(Role.Admin, Role.Odontologo, Role.Auxiliar)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los pacientes' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Filtro por nombres, apellidos, identificación o correo del paciente' })
  @ApiQuery({ name: 'pagina', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'cantidad_por_pagina', required: false, type: Number, description: 'Cantidad de elementos por página' })
  async findAll(@Query() query: FindPacientesDto) {
    return this.pacientesService.findAll(query);
  }

  @Roles(Role.Paciente)
  @Get('perfil')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil de un paciente con su token' })
  async findOneByPaciente(@Request() req) {
    return this.pacientesService.findOne(req.user.id);
  }

  @Roles(Role.Admin, Role.Odontologo, Role.Auxiliar)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un paciente por su ID' })
  async findOne(@Param('id') id: string) {
    return this.pacientesService.findOne(id);
  }

  @Roles(Role.Paciente)
  @Patch()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar la información del paciente autenticado',
  })
  @UseInterceptors(FileInterceptor('foto'))
  async update(
    @Request() req,
    @Body() updatePacienteDto: UpdatePacienteDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ 
            maxSize: 3 * 1024 * 1024,
            message: 'El archivo excede el tamaño máximo permitido de 3MB',
          }), // 3 MB
          new FileTypeValidator({ 
            fileType: 'image/jpeg|image/png',
          }),
        ],
        fileIsRequired: false, // Para que el archivo sea opcional
        /* exceptionFactory: (error) => {
          // Mensaje personalizado para errores de validación
          throw new BadRequestException(
            `${error}`
          );
        }, */
      }),
    ) foto: Express.Multer.File,
  ) {
    return this.pacientesService.update(req.user.id, updatePacienteDto, foto);
  }

  @Roles(Role.Admin, Role.Auxiliar)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un paciente por su ID' })
  async remove(@Param('id') id: string) {
    return this.pacientesService.remove(id);
  }
}
