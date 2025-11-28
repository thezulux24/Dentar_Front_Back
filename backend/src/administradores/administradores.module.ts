import { Module } from '@nestjs/common';
import { AdministradoresService } from './administradores.service';
import { AdministradoresController } from './administradores.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AdministradoresController],
  providers: [AdministradoresService, PrismaService],
  exports: [AdministradoresService]
})
export class AdministradoresModule {}
