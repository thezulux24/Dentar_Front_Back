import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTratamientoUsuarioDto } from './dto/create-tratamiento-usuario.dto';
import { FindTratamientosUsuariosDto } from './dto/find-tratamientos-usuarios.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PAGINATION_MAX_PAGE_SIZE } from 'src/common/config/constants';
import { buildResponse } from 'src/common/utils/response.util';
import { renamePagination } from 'src/common/utils/rename-pagination.util';

@Injectable()
export class TratamientosUsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(createTratamientoUsuarioDto: CreateTratamientoUsuarioDto) {
    const { id_usuario, id_tratamiento } = createTratamientoUsuarioDto;

    // 1. Validar que el usuario (paciente) existe
    const paciente = await this.prisma.pacientes.findUnique({
      where: { id_usuario },
      select: { id_usuario: true },
    });
    if (!paciente) {
      throw new NotFoundException('El paciente no existe');
    }

    // 2. Validar que el tratamiento existe
    const tratamiento = await this.prisma.tratamientos.findFirst({
      where: { id_tratamiento, eliminado: -1 },
      select: { id_tratamiento: true },
    });
    if (!tratamiento) {
      throw new NotFoundException('El tratamiento no existe');
    }

    // 3. Validar que la relación no exista previamente
    const relacionExistente = await this.prisma.tratamientos_usuarios.findFirst({
      where: {
        id_usuario,
        id_tratamiento,
        eliminado: -1,
      },
    });
    if (relacionExistente) {
      throw new BadRequestException('El paciente ya tiene asignado este tratamiento');
    }

    // 4. Obtener el estado "Activo" para el tratamiento del usuario
    const parametroEstado = await this.prisma.parametros.findFirst({
      where: {
        nombre: 'En progreso',
        tipos_parametros: {
          nombre: 'estado_de_tratamiento',
        },
      },
      select: { id_parametro: true },
    });

    if (!parametroEstado) {
      throw new Error('No se encontró el parámetro de estado para "Activo"');
    }

    // 5. Crear la relación
    const nuevaRelacion = await this.prisma.tratamientos_usuarios.create({
      data: {
        id_usuario,
        id_tratamiento,
        id_parametro_estado_tratamiento: parametroEstado.id_parametro,
      },
      include: {
        usuario: {
          select: {
            nombres: true,
            apellidos: true,
          },
        },
        tratamiento: {
          select: {
            nombre_tratamiento: true,
          },
        },
        parametros: {
          select: {
            nombre: true,
          },
        },
      },
    });

    return buildResponse(true, 'Tratamiento asignado al usuario exitosamente', {
      id_tratamiento_usuario: nuevaRelacion.id_tratamiento_usuario,
      paciente: `${nuevaRelacion.usuario.nombres} ${nuevaRelacion.usuario.apellidos}`,
      tratamiento: nuevaRelacion.tratamiento.nombre_tratamiento,
      estado: nuevaRelacion.parametros?.nombre || 'No definido',
    });
  }

  async findAllByPaciente(id_paciente: string, query: FindTratamientosUsuariosDto) {
    const { pagina = 1, cantidad_por_pagina = 10 } = query;

    // Validar que el paciente existe
    const paciente = await this.prisma.pacientes.findUnique({
      where: { id_usuario: id_paciente },
      select: { id_usuario: true },
    });
    if (!paciente) {
      throw new NotFoundException('El paciente no existe');
    }

    const pageSize = Math.min(cantidad_por_pagina, PAGINATION_MAX_PAGE_SIZE);
    const skip = (pagina - 1) * pageSize;

    const whereClause = {
      id_usuario: id_paciente,
      eliminado: -1,
    };

    const [tratamientosUsuario, total] = await this.prisma.$transaction([
      this.prisma.tratamientos_usuarios.findMany({
        where: whereClause,
        select: {
          id_tratamiento_usuario: true,
          tratamiento: {
            select: {
              id_tratamiento: true,
              nombre_tratamiento: true,
              descripcion: true,
              imagen_url: true,
            },
          },
          parametros: {
            select: {
              nombre: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: {
          fecha_creacion: 'desc',
        },
      }),
      this.prisma.tratamientos_usuarios.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return buildResponse(true, 'Operación exitosa', {
      tratamientos: tratamientosUsuario.map(tu => ({
        id_asignacion: tu.id_tratamiento_usuario,
        id_tratamiento: tu.tratamiento.id_tratamiento,
        nombre: tu.tratamiento.nombre_tratamiento,
        descripcion: tu.tratamiento.descripcion,
        imagen_url: tu.tratamiento.imagen_url,
        estado: tu.parametros?.nombre || 'No definido',
      })),
      ...renamePagination({
        total,
        totalPages,
        pageSize,
        currentPage: pagina,
      }),
    });
  }

  async findMyTratamientos(id_usuario: string, query: FindTratamientosUsuariosDto) {
    // Este método es para que el paciente consulte sus propios tratamientos
    return this.findAllByPaciente(id_usuario, query);
  }
}
