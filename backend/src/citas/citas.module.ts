import { Module } from '@nestjs/common';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CitasController],
  providers: [CitasService, PrismaService],
})
export class CitasModule {}
