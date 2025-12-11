import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuxiliareDto } from './dto/create-auxiliare.dto';
import { UpdateAuxiliareDto } from './dto/update-auxiliare.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildResponse } from 'src/common/utils/response.util';
import { DateHelper } from 'src/common/utils/date.helper';
import { UsersService } from 'src/users/users.service';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class AuxiliaresService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private filesService: FilesService,
  ) {}

  async create(data: CreateAuxiliareDto) {
    const [usuario, auxiliar] = await this.prisma.$transaction(async (tx) => {
      const usuario = await this.usersService.createUser(data, 'Auxiliar', tx);

      const auxiliar = await tx.auxiliares.create({
        data: {
          id_usuario: usuario.id_usuario,
          fecha_creacion: usuario.fecha_creacion,
        },
      });

      return [usuario, auxiliar];
    });

    return buildResponse(true, 'Registro de auxiliar exitoso', {
      correo: usuario.email_,
    });
  }

  async findAll() {
    const auxiliares = await this.prisma.auxiliares.findMany({
      where: {
        eliminado: -1, // Solo activos
      },
      select: {
        id_usuario: true,
        eliminado: true,
        usuarios: {
          select: {
            nombres: true,
            apellidos: true,
            email_: true,
            identificacion: true,
            telefono: true,
            avatar_url: true,
          }
        },
      },
      orderBy: {
        fecha_creacion: 'desc',
      },
    });

    const auxiliaresList = auxiliares.map(aux => ({
      id_usuario: aux.id_usuario,
      nombres: aux.usuarios.nombres,
      apellidos: aux.usuarios.apellidos,
      email_: aux.usuarios.email_,
      identificacion: aux.usuarios.identificacion,
      telefono: aux.usuarios.telefono,
      avatar_url: aux.usuarios.avatar_url,
      eliminado: aux.eliminado,
    }));

    return buildResponse(true, 'Lista de auxiliares', auxiliaresList);
  }

  async findOne(id: string) {
    const auxiliar = await this.prisma.auxiliares.findUnique({
      where: { id_usuario: id },
      select: {
        id_parametro_tipo_auxiliar: true,
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
            informacion_personal: true,
          },
        },
      },
    });

    if (!auxiliar) {
      throw new NotFoundException('Auxiliar no encontrado');
    }

    // Aplana los campos del usuario en el objeto principal
    const { usuarios, ...rest } = auxiliar;
    return buildResponse(true, 'Datos obtenidos exitosamente', {
      ...rest,
      ...usuarios,
      correo: usuarios.email_,
    });
  }

  async update(
    id: string,
    updateAuxiliareDto: UpdateAuxiliareDto,
    foto?: Express.Multer.File,
  ) {
    const [usuarioActualizado] = await this.prisma.$transaction(async (tx) => {
      if (foto) {
        const avatarUrl = await this.filesService.uploadFile(
          foto,
          `imagenes/auxiliares/${id}`,
          `avatar_${id}`,
        );
        updateAuxiliareDto.avatar_url = avatarUrl;
      }

      const usuario = await this.usersService.updateUser(
        id,
        updateAuxiliareDto,
        tx,
      );

      const updateData: any = {
        fecha_actualizacion: usuario.fecha_actualizacion,
      };

      if (updateAuxiliareDto.sede !== undefined) updateData.sede = updateAuxiliareDto.sede;

      const auxiliar = await tx.auxiliares.update({
        where: { id_usuario: id },
        data: updateData,
      });

      return [usuario, auxiliar];
    });

    return buildResponse(true, 'Actualización exitosa', {
      correo: usuarioActualizado.email_,
    });
  }

  async remove(id: string) {
    await this.prisma.$transaction(async (tx) => {
      const usuario = await this.usersService.removeUser(id, tx);
      await tx.auxiliares.update({
        where: { id_usuario: id },
        data: {
          eliminado: 1,
          fecha_actualizacion: usuario.fecha_actualizacion,
        },
      });
    });

    return buildResponse(true, 'Auxiliar eliminado exitosamente');
  }
}
