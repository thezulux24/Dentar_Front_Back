import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdministradoresDto } from './dto/create-administradores.dto';
import { UpdateAdministradoresDto } from './dto/update-administradores.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { buildResponse } from 'src/common/utils/response.util';
import { DateHelper } from 'src/common/utils/date.helper';

@Injectable()
export class AdministradoresService {
  constructor(private prisma: PrismaService) {}
  
  async create(data: CreateAdministradoresDto) {
    const email = data.email.toLowerCase().replace(/\s/g, '');
    const existe = await this.prisma.usuarios.findUnique({
      where: { email_: email },
      select: { id_usuario: true }
    });

    if (existe) throw new ConflictException('El correo ya está registrado');

    // 1. Obtener id del parámetro "Paciente" dentro del tipo "Rol de Usuario"
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

    // 3. Crear usuario y administrador en transacción
    const fechaCreacion = DateHelper.nowUTC(); // Fecha única para ambas tablas
    const [usuario, administrador] = await this.prisma.$transaction(async (tx) => {
      const usuario = await tx.usuarios.create({
        data: {
          email_: email,
          usuario: email,
          clave: hashed,
          id_parametro_rol: parametroRol.id_parametro,
          fecha_creacion: fechaCreacion,
        },
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
  
  async findOne(email: string) {
    const admin = await this.prisma.usuarios.findUnique({
      where: { email_: email },
      // include: {
      //   parametros: {
      //     select: {
      //       nombre: true, // Seleccionar solo el nombre del parámetro
      //     },
      //   } // Incluir rol del usuario
      // }
    });

    if (!admin) {
      throw new Error('Paciente no encontrado');
    }

    // Busco el nombre del rol del adminstrador
    const rol = await this.prisma.parametros.findUnique({
      where: { id_parametro: admin.id_parametro_rol || '' },
      select: { nombre: true } // Seleccionar solo el nombre del parámetro  
    })

    // Agrego el nombre del rol al paciente
    const admin_data = {
      ...admin,  
      nombre_rol: rol?.nombre || 'Desconocido' // Asignar nombre del rol o 'Desconocido' si no se encuentra
    };

    return admin_data;
  }
  
  async update(id: string, updateAdministradoresDto: UpdateAdministradoresDto) {

    // console.log('Actualizando paciente> ', id, updatePacienteDto);

    // 1. Verificar existencia del paciente/usuario
    const usuarioExistente = await this.prisma.usuarios.findUnique({
      where: { id_usuario: id },
      select: { id_usuario: true, email_: true }
      // include: { pacientes: true }  // Incluir relación con paciente
    });

    if (!usuarioExistente) {
      throw new NotFoundException('Administrador no encontrado');
    }

    // 2. Verificar email si se está actualizando
    if (updateAdministradoresDto.email && updateAdministradoresDto.email !== usuarioExistente.email_) {
      const emailExistente = await this.prisma.usuarios.findUnique({
        where: { email_: updateAdministradoresDto.email },
        select: { id_usuario: true, email_: true }
      });
      
      if (emailExistente) {
        throw new ConflictException('El correo ya está registrado');
      }
    }

    // 3. Encriptar clave si se proporciona
    // let hashedPassword = usuarioExistente.clave;
    // if (updateAdministradoresDto.clave) {
    //   hashedPassword = await bcrypt.hash(updateAdministradoresDto.clave, 10);
    // }

    // Desestructurar campos del DTO para evitar repetición
    const { 
      nombres, 
      apellidos,  
      telefono, 
      direccion,
      email 
    } = updateAdministradoresDto;
    
    const fechaActualizacion = DateHelper.nowUTC();

    const data: any = {
      fecha_actualizacion: fechaActualizacion,
    };

    if (nombres !== undefined) data.nombres = nombres;
    if (apellidos !== undefined) data.apellidos = apellidos;
    if (telefono !== undefined) data.telefono = telefono.toString();
    if (direccion !== undefined) data.direccion = direccion;
    if (email !== undefined) data.email_ = email;

    // 4. Actualizar usuario y administrador en transacción
    const [usuarioActualizado] = await this.prisma.$transaction([
      this.prisma.usuarios.update({
        where: { id_usuario: id },
        data
      }),
      
      // Actualizar datos específicos de administrador si existen en el DTO
      this.prisma.administradores.update({
        where: { id_usuario: id },
        data: {
          // Agregar aquí campos específicos de administradores si existen
          fecha_actualizacion: fechaActualizacion,
        }
      })
    ]);

    return { 
      correo: usuarioActualizado.email_, 
      message: 'Actualización exitosa' 
    };
  }

  remove(id: number) {
    return `This action removes a #${id} administradore`;
  }
}
