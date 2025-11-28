import { Injectable } from '@nestjs/common';
import { CreateParametroDto } from './dto/create-parametro.dto';
import { UpdateParametroDto } from './dto/update-parametro.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindParametroDto } from './dto/find-parametro.dto';
import { buildResponse } from 'src/common/utils/response.util';

@Injectable()
export class ParametrosService {
  constructor(private prisma: PrismaService) {}
  // create(createParametroDto: CreateParametroDto) {
  //   return 'This action adds a new parametro';
  // }

  findAll() {
    return `This action returns all parametros`;
  }

  async findByTipoParametro(payload: FindParametroDto) {
    const { tipo_parametro } = payload;

    const tipoParametro = await this.prisma.tipos_parametros.findFirst({
      where: {
        nombre: tipo_parametro,
        eliminado: -1,
      },
      select: {
        nombre: true,
        descripcion: true,
        parametros: {
          select: {
            id_parametro: true,
            nombre: true,
            descripcion: true,
          },
        },
      },
    });

    return buildResponse(
      true, 
      'Parámetros obtenidos con éxito',
      {
        tipo_parametro: {
          nombre: tipoParametro?.nombre,
          descripcion: tipoParametro?.descripcion,
        },
        parametros: tipoParametro?.parametros ?? [],
      }
    )

    return {
      tipo_parametro: {
        nombre: tipoParametro?.nombre,
        descripcion: tipoParametro?.descripcion,
      },
      parametros: tipoParametro?.parametros ?? [],
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} parametro`;
  }

  // update(id: number, updateParametroDto: UpdateParametroDto) {
  //   return `This action updates a #${id} parametro`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} parametro`;
  // }
}
