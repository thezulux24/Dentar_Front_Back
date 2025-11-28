import { Module } from '@nestjs/common';
import { ParametrosService } from './parametros.service';
import { ParametrosController } from './parametros.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ParametrosController],
  providers: [ParametrosService, PrismaService],
})
export class ParametrosModule {}
