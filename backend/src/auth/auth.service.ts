
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, JwtService, NotBeforeError, TokenExpiredError } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { jwtConstants } from '../common/config/constants';
import { buildResponse } from 'src/common/utils/response.util';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async signIn(data: LoginAuthDto): Promise<any> {

    try {
      // 1. Verificar si el usuario existe
      const user = await this.prisma.usuarios.findUnique({
        where: { email_: data.correo },
        select: {
          nombres: true, 
          apellidos: true, 
          avatar_url: true,
          email_: true, 
          id_parametro_rol: true,
          id_usuario: true,
          clave: true,
          rol: {
            select: { nombre: true }
          }
        }
      });

      // Si el usuario no existe, lanzamos una excepción
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // Si el usuario existe, verificamos la contraseña
      if (user?.clave) {
        const isMatch = await bcrypt.compare(data.clave, user.clave);
        // Si la contraseña no coincide, lanzamos una excepción
        if (!isMatch) {
          throw new UnauthorizedException('Credenciales incorrectas');
        }
      }

      // Genera el token JWT y lo devuelve
      const payload = { 
        nombres: user.nombres, 
        apellidos:user.apellidos, 
        foto_de_perfil: user.avatar_url,
        correo: user.email_, 
        rol: user.rol?.nombre || null,
        rol_id: user.id_parametro_rol,
        id: user.id_usuario
      };

      return buildResponse(true, 'Inicio de sesión exitoso', {
        token: await this.jwtService.signAsync(payload),
      });

      // return { token: await this.jwtService.signAsync(payload) };
      
    } catch (error) {
      // console.error('Error en el proceso de autenticación:', error);
      throw new UnauthorizedException(error.message || 'Error en el proceso de autenticación');
    }
    
  }

  /**
   * Valida un token JWT y devuelve el payload si es válido.
   * Si es inválido, lanza una excepción con un mensaje adecuado.
   */
  async validateToken(token: string): Promise<any> {
    try {

      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      return buildResponse(true, 'Token válido', payload);

    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('El token ha expirado');
      } else if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Token inválido');
      } else if (error instanceof NotBeforeError) {
        throw new UnauthorizedException('El token aún no es válido');
      } else {
        throw new UnauthorizedException('Error al validar el token');
      }
    }
  }
}
