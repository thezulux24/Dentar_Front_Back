import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildResponse } from 'src/common/utils/response.util';
import { DateHelper } from 'src/common/utils/date.helper';
import { UsersService } from 'src/users/users.service';
import { FilesService } from 'src/files/files.service';
import { FindPacientesDto } from './dto/find-pacientes.dto';
import { PAGINATION_MAX_PAGE_SIZE } from 'src/common/config/constants';
import { renamePagination } from 'src/common/utils/rename-pagination.util';

@Injectable()
export class PacientesService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private filesService: FilesService,
  ) {}

  async create(data: CreatePacienteDto) {
    const [usuario, paciente] = await this.prisma.$transaction(async (tx) => {
      const usuario = await this.usersService.createUser(data, 'Paciente', tx);

      const paciente = await tx.pacientes.create({
        data: {
          id_usuario: usuario.id_usuario,
          fecha_creacion: usuario.fecha_creacion,
        },
      });

      return [usuario, paciente];
    });

    return buildResponse(true, 'Registro de paciente exitoso', {
      correo: usuario.email_,
    });
  }

  async findAll(query: FindPacientesDto) {
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
      ];
    }

    const [pacientes, total] = await this.prisma.$transaction([
      this.prisma.pacientes.findMany({
        where: whereClause,
        select: {
          id_usuario: true,
          alergias: true,
          ocupacion: true,
          usuarios: {
            select: {
              nombres: true,
              apellidos: true,
              email_: true,
              fecha_de_nacimiento: true,
              avatar_url: true,
              identificacion: true,
              direccion: true,
            },
          },
          citas: {
            select: {
              fecha_cita: true,
              hora_inicio_cita: true,
            },
            orderBy: {
              fecha_cita: 'desc',
            },
            take: 1,
          },
        },
        skip: skip,
        take: pageSize,
        orderBy: {
          fecha_creacion: 'desc',
        },
      }),
      this.prisma.pacientes.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      pacientes: pacientes.map((p) => ({
        id: p.id_usuario,
        nombres: p.usuarios.nombres,
        apellidos: p.usuarios.apellidos,
        foto_de_perfil: p.usuarios.avatar_url,
        correo: p.usuarios.email_,
        fecha_nacimiento: p.usuarios.fecha_de_nacimiento,
        alergias: p.alergias,
        ocupacion: p.ocupacion,
        identificacion: p.usuarios.identificacion,
        direccion: p.usuarios.direccion,
        fecha_ultima_cita: p.citas.length > 0 && p.citas[0].fecha_cita ? DateHelper.toTimezone(p.citas[0].fecha_cita).toISODate() : null,
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
    const paciente = await this.prisma.pacientes.findUnique({
      where: { id_usuario: id },
      select: {
        configuracion_paciente:true,
        alergias:true,
        tolerante_anestesia: true,
        tratamientos_previos: true,
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

    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }

    // Aplana los campos del usuario en el objeto principal
    const { usuarios, ...rest } = paciente;
    return buildResponse(true, 'Datos obtenidos exitosamente', {
      ...rest,
      ...usuarios,
      correo: usuarios.email_
    });
  }

  async update(
    id: string,
    updatePacienteDto: UpdatePacienteDto,
    foto?: Express.Multer.File,
  ) {
    const [usuarioActualizado] = await this.prisma.$transaction(async (tx) => {
      if (foto) {
        const avatarUrl = await this.filesService.uploadFile(
          foto,
          `imagenes/pacientes/${id}`,
          `avatar_${id}`,
        );
        updatePacienteDto.avatar_url = avatarUrl;
      }

      const usuario = await this.usersService.updateUser(
        id,
        updatePacienteDto,
        tx,
      );

      const updateData: any = {
        fecha_actualizacion: usuario.fecha_actualizacion,
      };

      if (updatePacienteDto.alergias) updateData.alergias = updatePacienteDto.alergias;
      if (updatePacienteDto.tratamientos_previos) updateData.tratamientos_previos = updatePacienteDto.tratamientos_previos;
      if (updatePacienteDto.tolerante_anestesia) updateData.tolerante_anestesia = updatePacienteDto.tolerante_anestesia;

      const paciente = await tx.pacientes.update({
        where: { id_usuario: id },
        data: updateData,
      });

      return [usuario, paciente];
    });

    return buildResponse(true, 'Actualización exitosa', {
      correo: usuarioActualizado.email_,
    });
  }

  async remove(id: string) {
    await this.prisma.$transaction(async (tx) => {
      const usuario = await this.usersService.removeUser(id, tx);
      await tx.pacientes.update({
        where: { id_usuario: id },
        data: {
          eliminado: 1,
          fecha_actualizacion: usuario.fecha_actualizacion,
        },
      });
    });

    return buildResponse(true, 'Paciente eliminado exitosamente');
  }
}
