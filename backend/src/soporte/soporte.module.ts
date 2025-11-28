import { Module } from '@nestjs/common';
import { SoporteService } from './soporte.service';
import { SoporteController } from './soporte.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SoporteController],
  providers: [SoporteService],
  exports: [SoporteService],
})
export class SoporteModule {}
