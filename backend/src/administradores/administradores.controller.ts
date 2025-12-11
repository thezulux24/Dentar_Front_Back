import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdministradoresService } from './administradores.service';
import { CreateAdministradoresDto } from './dto/create-administradores.dto';
import { UpdateAdministradoresDto } from './dto/update-administradores.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Public } from 'src/common/public/public.decorator';
import { Roles } from 'src/common/roles/roles.decorator';
import { Role } from 'src/common/roles/roles.enum';

@ApiTags('Administradores')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('administradores')
export class AdministradoresController {
  constructor(private readonly administradoresService: AdministradoresService) {}

  // @Public()
  @Roles(Role.Admin)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo administrador' })
  create(@Body() createAdministradoresDto: CreateAdministradoresDto) {
    return this.administradoresService.create(createAdministradoresDto);
  }

  @Roles(Role.Admin)
  @Get('perfil')
  @ApiOperation({ summary: 'Obtener el perfil del administrador autenticado' })
  async getPerfil(@Request() req) {
    return this.administradoresService.findOne(req.user.id);
  }

  @Roles(Role.Admin)
  @Patch()
  @ApiOperation({
    summary: 'Actualizar la información del administrador autenticado',
  })
  @UseInterceptors(FileInterceptor('foto'))
  async update(
    @Request() req,
    @Body() updateAdministradoresDto: UpdateAdministradoresDto,
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
    return this.administradoresService.update(req.user.id, updateAdministradoresDto, foto);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar la información de un administrador por ID' })
  async updateById(@Param('id') id: string, @Body() updateAdministradoresDto: UpdateAdministradoresDto) {
    return this.administradoresService.update(id, updateAdministradoresDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.administradoresService.remove(+id);
  // }
}
