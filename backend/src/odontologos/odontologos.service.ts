import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOdontologoDto } from './dto/create-odontologo.dto';
import { UpdateOdontologoDto } from './dto/update-odontologo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildResponse } from 'src/common/utils/response.util';
import { DateHelper } from 'src/common/utils/date.helper';
import { UsersService } from 'src/users/users.service';
import { FilesService } from 'src/files/files.service';
import { FindOdontologosDto } from './dto/find-odontologos.dto';
import { PAGINATION_MAX_PAGE_SIZE } from 'src/common/config/constants';
import { renamePagination } from 'src/common/utils/rename-pagination.util';

@Injectable()
export class OdontologosService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private filesService: FilesService,
  ) {}

  async create(data: CreateOdontologoDto) {
    const [usuario, odontologo] = await this.prisma.$transaction(async (tx) => {
      const usuario = await this.usersService.createUser(
        data,
        'Odontólogo',
        tx,
      );

      const odontologo = await tx.odontologos.create({
        data: {
          id_usuario: usuario.id_usuario,
          especialidad: data.especialidad,
          fecha_creacion: usuario.fecha_creacion,
        },
      });

      return [usuario, odontologo];
    });

    return buildResponse(true, 'Registro de odontólogo exitoso', {
      correo: usuario.email_,
    });
  }

  async findAll(query: FindOdontologosDto) {
    const { buscar, pagina = 1, cantidad_por_pagina = 10 } = query;

    const pageSize = Math.min(cantidad_por_pagina, PAGINATION_MAX_PAGE_SIZE);
    const skip = (pagina - 1) * pageSize;

    const whereClause: any = {
      eliminado: -1,
    };

    if (buscar) {
      whereClause.OR = [
        { usuarios: { nombres: { contains: buscar, mode: 'insensitive' } } },
        { usuarios: { apellidos: { contains: buscar, mode: 'insensitive' } } },
        { usuarios: { identificacion: { contains: buscar, mode: 'insensitive' } } },
        { usuarios: { email_: { contains: buscar, mode: 'insensitive' } } },
        { especialidad: { contains: buscar, mode: 'insensitive' } },
      ];
    }

    const [odontologos, total] = await this.prisma.$transaction([
      this.prisma.odontologos.findMany({
        where: whereClause,
        select: {
          id_usuario: true,
          especialidad: true,
          sede: true,
          eliminado: true,
          usuarios: {
            select: {
              nombres: true,
              apellidos: true,
              email_: true,
              telefono: true,
              identificacion: true,
              avatar_url: true,
            },
          },
        },
        skip: skip,
        take: pageSize,
        orderBy: {
          fecha_creacion: 'desc',
        },
      }),
      this.prisma.odontologos.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      odontologos: odontologos.map((o) => ({
        id: o.id_usuario,
        nombres: o.usuarios.nombres,
        apellidos: o.usuarios.apellidos,
        correo: o.usuarios.email_,
        telefono: o.usuarios.telefono,
        identificacion: o.usuarios.identificacion,
        foto_de_perfil: o.usuarios.avatar_url,
        especialidad: o.especialidad,
        sede: o.sede,
        eliminado: o.eliminado,
      })),
      ...renamePagination({
        total,
        totalPages,
        pageSize,
        currentPage: pagina,
      }),
    };
  }
  
  async findOne(id: string) {
    const usuario = await this.prisma.odontologos.findUnique({
      where: { id_usuario: id },
      select: {
        especialidad:true,
        horario_trabajo:true,
        firma_digital: true,
        sede: true,
        usuarios: {
          select: {
            email_: true,
            nombres: true,
            apellidos: true,
            identificacion: true,
            direccion: true,
            telefono: true,
            avatar_url: true,
            fecha_de_nacimiento: true,
            informacion_personal:true
          }
        }
      },
    });

    if (!usuario) {
      throw new NotFoundException('Odontólogo no encontrado');
    }

    // Aplana los campos del usuario en el objeto principal
    const { usuarios, ...rest } = usuario;
    return buildResponse(true, 'Datos obtenidos exitosamente', {
      ...rest,
      ...usuarios,
      correo: usuarios.email_
    });
  }
  
  async update(
    id: string, 
    updateOdontologoDto: UpdateOdontologoDto,
    foto?: Express.Multer.File,
  ) {
    const [usuarioActualizado] = await this.prisma.$transaction(async (tx) => {
      if (foto) {
        const avatarUrl = await this.filesService.uploadFile(
          foto,
          `imagenes/odontologos/${id}`,
          `avatar_${id}`,
        );
        updateOdontologoDto.avatar_url = avatarUrl;
      }
      
      const usuario = await this.usersService.updateUser(id, updateOdontologoDto, tx);

      const updateData: any = {
        fecha_actualizacion: usuario.fecha_actualizacion,
      };
      
      if (updateOdontologoDto.especialidad) updateData.especialidad = updateOdontologoDto.especialidad;
      if (updateOdontologoDto.horario_trabajo) updateData.horario_trabajo = updateOdontologoDto.horario_trabajo;
      if (updateOdontologoDto.firma_digital) updateData.firma_digital = updateOdontologoDto.firma_digital;
      if (updateOdontologoDto.sede) updateData.sede = updateOdontologoDto.sede;

      const odontologo = await tx.odontologos.update({
        where: { id_usuario: id },
        data: updateData,
      });

      return [usuario, odontologo];
    });

    return buildResponse(true, 'Actualización exitosa', {
      correo: usuarioActualizado.email_,
    });
  }

  async remove(id: string) {
    await this.prisma.$transaction(async (tx) => {
      await this.usersService.removeUser(id, tx);
      await tx.odontologos.update({
        where: { id_usuario: id },
        data: {
          eliminado: 1,
          fecha_actualizacion: DateHelper.nowUTC(),
        },
      });
    });

    return buildResponse(true, 'Odontólogo eliminado exitosamente');
  }
}
