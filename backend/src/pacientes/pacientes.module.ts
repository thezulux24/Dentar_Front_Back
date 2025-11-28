import { Module } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilesModule } from 'src/files/files.module';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [UsersModule, FilesModule],
  controllers: [PacientesController],
  providers: [PacientesService, PrismaService, FilesService],
  exports: [PacientesService],
})
export class PacientesModule {}
