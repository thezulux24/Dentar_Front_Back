
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, JwtService, NotBeforeError, TokenExpiredError } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from 'src/common/public/public.decorator';
import { jwtConstants } from '../common/config/constants';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('No cuentas con los permisos necesarios');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            });
            // Aquí asignamos la carga útil al objeto de solicitud para que podamos acceder a ella en nuestros controladores de ruta.
            request['user'] = payload;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new UnauthorizedException('El token ha expirado');
            } else if (error instanceof JsonWebTokenError) {
                throw new UnauthorizedException('Token inválido');
            } else if (error instanceof NotBeforeError) {
                throw new UnauthorizedException('El token aún no es válido');
            } else {
                throw new UnauthorizedException('Error de autenticación');
            }
        }
        
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
