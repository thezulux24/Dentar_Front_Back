import { Module } from '@nestjs/common';
import { AdministradoresService } from './administradores.service';
import { AdministradoresController } from './administradores.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [UsersModule, FilesModule],
  controllers: [AdministradoresController],
  providers: [AdministradoresService, PrismaService],
  exports: [AdministradoresService]
})
export class AdministradoresModule {}
