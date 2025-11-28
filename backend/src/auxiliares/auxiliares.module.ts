import { Module } from '@nestjs/common';
import { AuxiliaresService } from './auxiliares.service';
import { AuxiliaresController } from './auxiliares.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [UsersModule],
  controllers: [AuxiliaresController],
  providers: [AuxiliaresService, PrismaService],
  exports: [AuxiliaresService],
})
export class AuxiliaresModule {}
