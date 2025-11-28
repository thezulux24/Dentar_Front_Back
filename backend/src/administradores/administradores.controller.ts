import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
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
  @Patch()
  @ApiOperation({
    summary: 'Actualizar la información del administrador autenticado',
  })
  async update(@Request() req, @Body() updateAdministradoresDto: UpdateAdministradoresDto) {
    return this.administradoresService.update(req.user.id, updateAdministradoresDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.administradoresService.remove(+id);
  // }
}
