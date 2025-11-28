import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTratamientoDto } from './dto/create-tratamiento.dto';
import { UpdateTratamientoDto } from './dto/update-tratamiento.dto';
import { FindTratamientosDto } from './dto/find-tratamientos.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PAGINATION_MAX_PAGE_SIZE } from 'src/common/config/constants';
import { buildResponse } from 'src/common/utils/response.util';
import { renamePagination } from 'src/common/utils/rename-pagination.util';
import { DateHelper } from 'src/common/utils/date.helper';

@Injectable()
export class TratamientosService {
  constructor(private prisma: PrismaService) {}

    async create(createTratamientoDto: CreateTratamientoDto) {
        // Validar que no exista un tratamiento con el mismo nombre
        const tratamientoExistente = await this.prisma.tratamientos.findFirst({
            where: {
                nombre_tratamiento: createTratamientoDto.nombre_tratamiento,
                eliminado: -1,
            },
            select: { id_tratamiento: true },
        });

        if (tratamientoExistente) {
            throw new BadRequestException('Ya existe un tratamiento con este nombre');
        }

        const tratamiento = await this.prisma.tratamientos.create({
        data: {
            nombre_tratamiento: createTratamientoDto.nombre_tratamiento,
            descripcion: createTratamientoDto.descripcion,
            precio_estimado: createTratamientoDto.precio_estimado,
            duracion: createTratamientoDto.duracion,
            ar_model_url: createTratamientoDto.ar_model_url,
            imagen_url: createTratamientoDto.imagen_url,
        },
        });

        return buildResponse(true, 'Tratamiento creado exitosamente', {
            id_tratamiento: tratamiento.id_tratamiento,
        });
    }

    async findAll(query: FindTratamientosDto) {
        const {
        nombre,
        precio_minimo,
        precio_maximo,
        duracion_minima,
        duracion_maxima,
        pagina = 1,
        cantidad_por_pagina = 10,
        } = query;

        const pageSize = Math.min(cantidad_por_pagina, PAGINATION_MAX_PAGE_SIZE);
        const skip = (pagina - 1) * pageSize;

        const whereClause: any = {
        eliminado: -1,
        };

        // Filtro por nombre (búsqueda parcial)
        if (nombre) {
        whereClause.nombre_tratamiento = {
            contains: nombre,
            mode: 'insensitive',
        };
        }

        // Filtros de precio
        if (precio_minimo !== undefined || precio_maximo !== undefined) {
        whereClause.precio_estimado = {};
        if (precio_minimo !== undefined) {
            whereClause.precio_estimado.gte = precio_minimo;
        }
        if (precio_maximo !== undefined) {
            whereClause.precio_estimado.lte = precio_maximo;
        }
        }

        // Validar que precio_maximo sea mayor que precio_minimo
        if (precio_minimo !== undefined && precio_maximo !== undefined && precio_maximo <= precio_minimo) {
        throw new BadRequestException('El precio máximo debe ser mayor que el precio mínimo');
        }

        // Filtros de duración
        if (duracion_minima !== undefined || duracion_maxima !== undefined) {
        whereClause.duracion = {};
        if (duracion_minima !== undefined) {
            whereClause.duracion.gte = duracion_minima;
        }
        if (duracion_maxima !== undefined) {
            whereClause.duracion.lte = duracion_maxima;
        }
        }

        // Validar que duracion_maxima sea mayor que duracion_minima
        if (duracion_minima !== undefined && duracion_maxima !== undefined && duracion_maxima <= duracion_minima) {
        throw new BadRequestException('La duración máxima debe ser mayor que la duración mínima');
        }

        const [tratamientos, total] = await this.prisma.$transaction([
        this.prisma.tratamientos.findMany({
            where: whereClause,
            select: {
                id_tratamiento: true,
                nombre_tratamiento: true,
                descripcion: true,
                precio_estimado: true,
                duracion: true,
                ar_model_url: true,
                imagen_url: true,
                fecha_creacion: true,
            },
            skip: skip,
            take: pageSize,
            orderBy: {
                nombre_tratamiento: 'asc',
            },
        }),
        this.prisma.tratamientos.count({ where: whereClause }),
        ]);

        const totalPages = Math.ceil(total / pageSize);

        return {
            tratamientos: tratamientos.map(t => ({
                id_tratamiento: t.id_tratamiento,
                nombre_tratamiento: t.nombre_tratamiento,
                descripcion: t.descripcion,
                precio_estimado: t.precio_estimado ? Number(t.precio_estimado) : null,
                duracion: t.duracion,
                // ar_model_url: t.ar_model_url,
                imagen_url: t.imagen_url,
                // fecha_creacion: t.fecha_creacion ? DateHelper.toTimezone(t.fecha_creacion).toISODate() : null,
            })),
            ...renamePagination({
                total,
                totalPages,
                pageSize,
                currentPage: pagina,
            }),
        };
    }

    async findAllPublic(query: FindTratamientosDto) {
        // Endpoint público que excluye registros eliminados automáticamente
        return this.findAll(query);
    }

    async findOne(id_tratamiento: string) {
        const tratamiento = await this.prisma.tratamientos.findFirst({
            where: {
                id_tratamiento,
                eliminado: -1,
            },
            select: {
                id_tratamiento: true,
                nombre_tratamiento: true,
                descripcion: true,
                precio_estimado: true,
                duracion: true,
                ar_model_url: true,
                imagen_url: true,
                fecha_creacion: true,
                fecha_actualizacion: true,
            },
        });

        if (!tratamiento) {
            throw new NotFoundException('El tratamiento no existe');
        }

        const data = {
            id_tratamiento: tratamiento.id_tratamiento,
            nombre_tratamiento: tratamiento.nombre_tratamiento,
            descripcion: tratamiento.descripcion,
            precio_estimado: tratamiento.precio_estimado ? Number(tratamiento.precio_estimado) : null,
            duracion: tratamiento.duracion,
            ar_model_url: tratamiento.ar_model_url,
            imagen_url: tratamiento.imagen_url,
            fecha_creacion: tratamiento.fecha_creacion ? DateHelper.toTimezone(tratamiento.fecha_creacion).toISODate() : null,
            fecha_actualizacion: tratamiento.fecha_actualizacion ? DateHelper.toTimezone(tratamiento.fecha_actualizacion).toISODate() : null,
        };

        return buildResponse(true, 'Tratamiento encontrado exitosamente', data);
    }

    async update(id_tratamiento: string, updateTratamientoDto: UpdateTratamientoDto) {
        // Verificar que el tratamiento existe y no está eliminado
        const tratamientoExistente = await this.prisma.tratamientos.findFirst({
        where: {
            id_tratamiento,
            eliminado: -1,
        },
        select: { id_tratamiento: true, nombre_tratamiento: true },
        });

        if (!tratamientoExistente) {
            throw new NotFoundException('El tratamiento no existe');
        }

        // Si se está actualizando el nombre, validar que no exista otro tratamiento con el mismo nombre
        if (updateTratamientoDto.nombre_tratamiento && 
            updateTratamientoDto.nombre_tratamiento !== tratamientoExistente.nombre_tratamiento) {
                const tratamientoConMismoNombre = await this.prisma.tratamientos.findFirst({
                where: {
                    nombre_tratamiento: updateTratamientoDto.nombre_tratamiento,
                    eliminado: -1,
                    id_tratamiento: { not: id_tratamiento },
                },
                select: { id_tratamiento: true },
            });

            if (tratamientoConMismoNombre) {
                throw new BadRequestException('Ya existe un tratamiento con este nombre');
            }
        }

        const dataToUpdate: any = {
            fecha_actualizacion: DateHelper.nowUTC(),
        };

        // Solo actualizar los campos que se enviaron
        if (updateTratamientoDto.nombre_tratamiento !== undefined) {
            dataToUpdate.nombre_tratamiento = updateTratamientoDto.nombre_tratamiento;
        }
        if (updateTratamientoDto.descripcion !== undefined) {
            dataToUpdate.descripcion = updateTratamientoDto.descripcion;
        }
        if (updateTratamientoDto.precio_estimado !== undefined) {
            dataToUpdate.precio_estimado = updateTratamientoDto.precio_estimado;
        }
        if (updateTratamientoDto.duracion !== undefined) {
            dataToUpdate.duracion = updateTratamientoDto.duracion;
        }
        if (updateTratamientoDto.ar_model_url !== undefined) {
            dataToUpdate.ar_model_url = updateTratamientoDto.ar_model_url;
        }
        if (updateTratamientoDto.imagen_url !== undefined) {
            dataToUpdate.imagen_url = updateTratamientoDto.imagen_url;
        }

        await this.prisma.tratamientos.update({
            where: { id_tratamiento },
            data: dataToUpdate,
        });

        return buildResponse(true, 'Tratamiento actualizado exitosamente', {
            id_tratamiento,
        });
    }

  async remove(id_tratamiento: string) {
    // Verificar que el tratamiento existe y no está eliminado
    const tratamientoExistente = await this.prisma.tratamientos.findFirst({
      where: {
        id_tratamiento,
        eliminado: -1,
      },
      select: { id_tratamiento: true },
    });

    if (!tratamientoExistente) {
      throw new NotFoundException('El tratamiento no existe');
    }

    // Verificar si el tratamiento está siendo usado en tratamientos_usuarios
    const tratamientoEnUso = await this.prisma.tratamientos_usuarios.findFirst({
      where: {
        id_tratamiento,
        eliminado: -1,
      },
      select: { id_tratamiento_usuario: true },
    });

    if (tratamientoEnUso) {
      throw new BadRequestException('No se puede eliminar el tratamiento porque está siendo utilizado por pacientes');
    }

    // Realizar borrado lógico
    await this.prisma.tratamientos.update({
      where: { id_tratamiento },
      data: {
        eliminado: 1,
        fecha_eliminacion: DateHelper.nowUTC(),
        fecha_actualizacion: DateHelper.nowUTC(),
      },
    });

    return buildResponse(true, 'Tratamiento eliminado exitosamente', {
      id_tratamiento,
    });
  }
}
