import { Module } from '@nestjs/common';
import { OdontologosService } from './odontologos.service';
import { OdontologosController } from './odontologos.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilesService } from 'src/files/files.service';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [UsersModule, FilesModule],
  controllers: [OdontologosController],
  providers: [OdontologosService, PrismaService, FilesService],
  exports: [OdontologosService],
})
export class OdontologosModule {}
