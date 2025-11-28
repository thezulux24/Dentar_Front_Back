import { Module } from '@nestjs/common';
import { DiagnosticosService } from './diagnosticos.service';
import { DiagnosticosController } from './diagnosticos.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DiagnosticosController],
  providers: [DiagnosticosService, PrismaService],
})
export class DiagnosticosModule {}
