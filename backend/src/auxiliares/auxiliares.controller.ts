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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuxiliaresService } from './auxiliares.service';
import { CreateAuxiliareDto } from './dto/create-auxiliare.dto';
import { UpdateAuxiliareDto } from './dto/update-auxiliare.dto';
import { Roles } from 'src/common/roles/roles.decorator';
import { Role } from 'src/common/roles/roles.enum';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auxiliares')
@UseGuards(RolesGuard)
@Controller('auxiliares')
export class AuxiliaresController {
  constructor(private readonly auxiliaresService: AuxiliaresService) {}

  @Roles(Role.Admin)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo auxiliar' })
  async create(@Body() createAuxiliareDto: CreateAuxiliareDto) {
    return this.auxiliaresService.create(createAuxiliareDto);
  }

  @Roles(Role.Admin, Role.Odontologo, Role.Auxiliar)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los auxiliares' })
  async findAll() {
    return this.auxiliaresService.findAll();
  }

  @Roles(Role.Auxiliar)
  @Get('perfil')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del auxiliar autenticado' })
  async getPerfil(@Request() req) {
    return this.auxiliaresService.findOne(req.user.id);
  }

  @Roles(Role.Admin, Role.Odontologo, Role.Auxiliar)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un auxiliar por su ID' })
  async findOne(@Param('id') id: string) {
    return this.auxiliaresService.findOne(id);
  }

  @Roles(Role.Admin, Role.Auxiliar)
  @Patch()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar la información del auxiliar autenticado',
  })
  @UseInterceptors(FileInterceptor('foto'))
  async update(
    @Request() req,
    @Body() updateAuxiliareDto: UpdateAuxiliareDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ 
            maxSize: 3 * 1024 * 1024,
            message: 'El archivo excede el tamaño máximo permitido de 3MB',
          }),
          new FileTypeValidator({ 
            fileType: 'image/jpeg|image/png',
          }),
        ],
        fileIsRequired: false,
      }),
    ) foto: Express.Multer.File,
  ) {
    return this.auxiliaresService.update(req.user.id, updateAuxiliareDto, foto);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar la información de un auxiliar' })
    updateById(@Param('id') id: string, @Body() updateAuxiliareDto: UpdateAuxiliareDto) {
      return this.auxiliaresService.update(id, updateAuxiliareDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un auxiliar por su ID' })
  async remove(@Param('id') id: string) {
    return this.auxiliaresService.remove(id);
  }
}
