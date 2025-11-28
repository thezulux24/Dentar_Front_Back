import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuxiliareDto } from './dto/create-auxiliare.dto';
import { UpdateAuxiliareDto } from './dto/update-auxiliare.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildResponse } from 'src/common/utils/response.util';
import { DateHelper } from 'src/common/utils/date.helper';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuxiliaresService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
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
    const users = await this.prisma.auxiliares.findMany({
      select: {
        usuarios: {
          select: {
            nombres: true,
            apellidos: true,
            avatar_url: true,
          }
        },
        id_usuario: true,
      }
    });

    const odontologos = users.map(user => ({
      id: user.id_usuario,
      nombres: user.usuarios.nombres,
      apellidos: user.usuarios.apellidos,
      avatar_url: user.usuarios.avatar_url,
    }));

    return buildResponse(true, 'Lista de auxiliares', { odontologos });
  }

  async findOne(id: string) {
    const auxiliar = await this.prisma.auxiliares.findUnique({
      where: { id_usuario: id },
      include: {
        usuarios: true,
      },
    });

    if (!auxiliar) {
      throw new NotFoundException('Auxiliar no encontrado');
    }

    return auxiliar;
  }

  async update(id: string, updateAuxiliareDto: UpdateAuxiliareDto) {
    const [usuarioActualizado] = await this.prisma.$transaction(async (tx) => {
      const usuario = await this.usersService.updateUser(
        id,
        updateAuxiliareDto,
        tx,
      );

      const auxiliar = await tx.auxiliares.update({
        where: { id_usuario: id },
        data: {
          fecha_actualizacion: usuario.fecha_actualizacion,
        },
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
