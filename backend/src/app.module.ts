import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PacientesModule } from './pacientes/pacientes.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CitasModule } from './citas/citas.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { AdministradoresModule } from './administradores/administradores.module';
import { OdontologosModule } from './odontologos/odontologos.module';
import { ParametrosModule } from './parametros/parametros.module';
import { AuxiliaresModule } from './auxiliares/auxiliares.module';
import { TratamientosModule } from './tratamientos/tratamientos.module';
import { TratamientosUsuariosModule } from './tratamientos_usuarios/tratamientos_usuarios.module';
import { FilesModule } from './files/files.module';
import { DiagnosticosModule } from './diagnosticos/diagnosticos.module';
import { SoporteModule } from './soporte/soporte.module';
import { FacturacionModule } from './facturacion/facturacion.module';

@Module({
  imports: [
    AuthModule,
    AdministradoresModule,
    OdontologosModule,
    AuxiliaresModule,
    PacientesModule,
    CitasModule,
    ParametrosModule,
    TratamientosModule,
    TratamientosUsuariosModule,
    DiagnosticosModule,
    FilesModule,
    SoporteModule,
    FacturacionModule,
    ConfigModule.forRoot({
      isGlobal: true, // Hace que esté disponible en toda la app sin tener que importarlo cada vez
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
