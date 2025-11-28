import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Public } from 'src/common/public/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: LoginAuthDto) {
        return this.authService.signIn(signInDto);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Get('validar-token/:token')
    validateToken(@Param('token') token: string) {
        return this.authService.validateToken(token);
    }

    @UseGuards(AuthGuard)
    @Get('perfil')
    getProfile(@Request() req) {
        return req.user;
    }
}
