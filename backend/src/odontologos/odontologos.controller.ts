import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { OdontologosService } from './odontologos.service';
import { CreateOdontologoDto } from './dto/create-odontologo.dto';
import { UpdateOdontologoDto } from './dto/update-odontologo.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Roles } from 'src/common/roles/roles.decorator';
import { Role } from 'src/common/roles/roles.enum';
import { Public } from 'src/common/public/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Query } from '@nestjs/common';
import { FindOdontologosDto } from './dto/find-odontologos.dto';

@ApiTags('Odontólogos')
@UseGuards(RolesGuard)
@Controller('odontologos')
export class OdontologosController {
  constructor(private readonly odontologosService: OdontologosService) {}

  @Roles(Role.Admin)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo odontólogo' })
  create(@Body() createOdontologoDto: CreateOdontologoDto) {
    return this.odontologosService.create(createOdontologoDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Obtener la lista pública de odontólogos' })
  findAll(@Query() query: FindOdontologosDto) {
    return this.odontologosService.findAll(query);
  }

  @Roles(Role.Odontologo)
  @Get('perfil')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil de un odontólogo con su token' })
  async findOneByPaciente(@Request() req) {
    return this.odontologosService.findOne(req.user.id);
  }

  @Roles(Role.Admin)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener la información de un odontólogo' })
  findOne(@Param('id') id: string) {
    return this.odontologosService.findOne(id);
  }

  @Roles(Role.Odontologo)
  @Patch()
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('foto'))
  @ApiOperation({
    summary: 'Actualizar la información del odontólogo autenticado',
  })
  async update(
    @Request() req,
    @Body() updatePacienteDto: UpdateOdontologoDto,
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
      }),
    ) foto: Express.Multer.File,
  ) {
    return this.odontologosService.update(req.user.id, updatePacienteDto, foto);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar la información de un odontólogo' })
  updateById(@Param('id') id: string, @Body() updateOdontologoDto: UpdateOdontologoDto) {
    return this.odontologosService.update(id, updateOdontologoDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un odontólogo' })
  remove(@Param('id') id: string) {
    return this.odontologosService.remove(id);
  }
}
