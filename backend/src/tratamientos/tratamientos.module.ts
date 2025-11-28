import { Module } from '@nestjs/common';
import { TratamientosService } from './tratamientos.service';
import { TratamientosController } from './tratamientos.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TratamientosController],
  providers: [TratamientosService, PrismaService],
})
export class TratamientosModule {}
