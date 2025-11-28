import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ParametrosService } from './parametros.service';
import { CreateParametroDto } from './dto/create-parametro.dto';
import { UpdateParametroDto } from './dto/update-parametro.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindParametroDto } from './dto/find-parametro.dto';
import { Public } from 'src/common/public/public.decorator';

@ApiTags('Parámetros')
@Controller('parametros')
export class ParametrosController {
  constructor(private readonly parametrosService: ParametrosService) {}

  // @Post()
  // create(@Body() createParametroDto: CreateParametroDto) {
  //   return this.parametrosService.create(createParametroDto);
  // }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Obtener parámetros filtrados por tipo' })
  findByTipoParametro(@Query() query: FindParametroDto) {
    return this.parametrosService.findByTipoParametro(query);
  }

  // @Get()
  // findAll() {
  //   return this.parametrosService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.parametrosService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateParametroDto: UpdateParametroDto) {
  //   return this.parametrosService.update(+id, updateParametroDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.parametrosService.remove(+id);
  // }
}
