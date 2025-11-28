import { Module } from '@nestjs/common';
import { TratamientosUsuariosService } from './tratamientos_usuarios.service';
import { TratamientosUsuariosController } from './tratamientos_usuarios.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TratamientosUsuariosController],
  providers: [TratamientosUsuariosService, PrismaService],
})
export class TratamientosUsuariosModule {}
