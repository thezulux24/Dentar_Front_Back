import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { DateHelper } from 'src/common/utils/date.helper';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.usuarios.findUnique({
        where: { email_: email.toLowerCase().replace(/\s/g, '') },
    });
  }

  async getRoleId(roleName: string): Promise<string> {
    const parametroRol = await this.prisma.parametros.findFirst({
        where: {
            nombre: roleName,
            tipos_parametros: {
                nombre: 'rol_de_usuario',
            },
        },
        select: { id_parametro: true },
    });

    if (!parametroRol) {
      throw new Error(`No se encontró el rol para "${roleName}"`);
    }
    return parametroRol.id_parametro;
  }

  async createUser(data: any, roleName: string, tx: any) {
    const email = data.email.toLowerCase().replace(/\s/g, '');

    // Validar existencia de usuario
    const existe = await this.findByEmail(email);
    if (existe) {
        throw new ConflictException('El correo ya está registrado');
    }

    // Obtener id de rol de usuario
    const roleId = await this.getRoleId(roleName);

    // Encriptar clave
    const hashedPassword = await bcrypt.hash(data.clave, 10);

    return tx.usuarios.create({
        data: {
            email_: email,
            usuario: email,
            clave: hashedPassword,
            id_parametro_rol: roleId,
            fecha_creacion: DateHelper.nowUTC(),
            nombres: data.nombres,
            apellidos: data.apellidos,
            telefono: data.telefono ? data.telefono.toString() : undefined,
            direccion: data.direccion,
            informacion_personal: data.informacion_personal,
            fecha_de_nacimiento: data.fecha_de_nacimiento ? new Date(data.fecha_de_nacimiento) : null,
            identificacion: data.identificacion,
        },
    });
  }

  async updateUser(id: string, data: any, tx: any) {

    // 1. Verificar existencia del usuario
    const usuarioExistente = await tx.usuarios.findUnique({
        where: { id_usuario: id },
        select: { id_usuario: true, email_: true },
    });

    if (!usuarioExistente) {
        throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar email si se está actualizando
    if (data.email && data.email !== usuarioExistente.email_) {
        const emailExistente = await this.findByEmail(data.email);
        if (emailExistente) {
            throw new ConflictException('El correo ya está registrado');
        }
    }
    
    const updateData: any = {
        fecha_actualizacion: DateHelper.nowUTC(),
    };

    if (data.nombres) updateData.nombres = data.nombres;
    if (data.apellidos) updateData.apellidos = data.apellidos;
    if (data.informacion_personal) updateData.informacion_personal = data.informacion_personal;
    if (data.fecha_de_nacimiento) updateData.fecha_de_nacimiento = new Date(data.fecha_de_nacimiento);
    if (data.telefono) updateData.telefono = data.telefono.toString();
    if (data.direccion) updateData.direccion = data.direccion;
    if (data.identificacion) updateData.identificacion = data.identificacion;
    if (data.email) updateData.email_ = data.email;
    if (data.avatar_url) updateData.avatar_url = data.avatar_url;


    return tx.usuarios.update({
        where: { id_usuario: id },
        data: updateData,
    });
  }

  async removeUser(id: string, tx: any) {
    // Verificar existencia del odontólogo/usuario
    const usuarioExistente = await tx.usuarios.findUnique({
      where: { id_usuario: id },
    });

    if (!usuarioExistente) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Actualizar usuario en transacción
    return tx.usuarios.update({
      where: { id_usuario: id },
      data: {
        fecha_actualizacion: DateHelper.nowUTC(),
        eliminado: 1,
      },
    });
  }
}
