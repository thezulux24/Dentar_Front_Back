import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdministradoresDto } from './dto/create-administradores.dto';
import { UpdateAdministradoresDto } from './dto/update-administradores.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { buildResponse } from 'src/common/utils/response.util';
import { DateHelper } from 'src/common/utils/date.helper';
import { UsersService } from 'src/users/users.service';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class AdministradoresService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private filesService: FilesService,
  ) {}
  
  async create(data: CreateAdministradoresDto) {
    const email = data.email.toLowerCase().replace(/\s/g, '');
    const existe = await this.prisma.usuarios.findUnique({
      where: { email_: email },
      select: { id_usuario: true }
    });

    if (existe) throw new ConflictException('El correo ya está registrado');

    // 1. Obtener id del parámetro "Administrador" dentro del tipo "Rol de Usuario"
    const parametroRol = await this.prisma.parametros.findFirst({
      where: {
        nombre: 'Administrador',
        tipos_parametros: {
          nombre: 'rol_de_usuario',
        },
      },
      select: { id_parametro: true }
    });

    if (!parametroRol) {
      throw new Error('No se encontró el rol para "Administrador"');
    }

    // 2. Encriptar clave
    const hashed = await bcrypt.hash(data.clave, 10);

    // 3. Preparar datos del usuario con campos opcionales
    const fechaCreacion = DateHelper.nowUTC();
    const usuarioData: any = {
      email_: email,
      usuario: email,
      clave: hashed,
      id_parametro_rol: parametroRol.id_parametro,
      fecha_creacion: fechaCreacion,
    };

    // Agregar campos opcionales solo si están presentes
    if (data.nombres) usuarioData.nombres = data.nombres;
    if (data.apellidos) usuarioData.apellidos = data.apellidos;
    if (data.telefono) usuarioData.telefono = data.telefono;
    if (data.direccion) usuarioData.direccion = data.direccion;
    if (data.fecha_de_nacimiento) usuarioData.fecha_de_nacimiento = new Date(data.fecha_de_nacimiento);
    if (data.identificacion) usuarioData.identificacion = data.identificacion;
    if (data.informacion_personal) usuarioData.informacion_personal = data.informacion_personal;

    // 4. Crear usuario y administrador en transacción
    const [usuario, administrador] = await this.prisma.$transaction(async (tx) => {
      const usuario = await tx.usuarios.create({
        data: usuarioData,
      });

      const administrador = await tx.administradores.create({
        data: {
          id_usuario: usuario.id_usuario,
          fecha_creacion: fechaCreacion,
        },
      });

      return [usuario, administrador];
    });

    return buildResponse(true, 'Registro de administrador exitoso', { correo: usuario.email_ });
  }

  findAll() {
    return this.prisma.administradores.findMany();
  }
  
  async findOne(id: string) {
    const admin = await this.prisma.administradores.findUnique({
      where: { id_usuario: id },
      select: {
        id_parametro_tipo_admin: true,
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
          },
        },
      },
    });

    if (!admin) {
      throw new NotFoundException('Administrador no encontrado');
    }

    // Aplanar estructura
    const { usuarios, ...rest } = admin;
    const result = {
      ...rest,
      ...usuarios,
      correo: usuarios.email_,
    };

    return buildResponse(true, 'Perfil de administrador obtenido exitosamente', result);
  }
  
  async update(
    id: string,
    updateAdministradoresDto: UpdateAdministradoresDto,
    foto?: Express.Multer.File,
  ) {
    const [usuarioActualizado] = await this.prisma.$transaction(async (tx) => {
      if (foto) {
        const avatarUrl = await this.filesService.uploadFile(
          foto,
          `imagenes/administradores/${id}`,
          `avatar_${id}`,
        );
        updateAdministradoresDto.avatar_url = avatarUrl;
      }

      const usuario = await this.usersService.updateUser(
        id,
        updateAdministradoresDto,
        tx,
      );

      const administrador = await tx.administradores.update({
        where: { id_usuario: id },
        data: {
          fecha_actualizacion: usuario.fecha_actualizacion,
        },
      });

      return [usuario, administrador];
    });

    return buildResponse(true, 'Actualización exitosa', {
      correo: usuarioActualizado.email_,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} administradore`;
  }
}
