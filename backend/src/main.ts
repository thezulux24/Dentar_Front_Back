import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //Pipes de validación
  // Se encarga de validar los DTOs (Data Transfer Objects) y lanzar errores si no son válidos
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades que no están en el DTO
    forbidNonWhitelisted: true, // Lanza un error si hay propiedades no permitidas
    transform: true, // Transforma las entradas al tipo esperado (por ejemplo, string a number)
    exceptionFactory: (errors) => {
      const mensajes = errors.map(err => {
        return {
          campo: err.property,
          errores: Object.values(err.constraints || {}),
        };
      });

      // En lugar de array plano, se devuelve un objeto claro
      return new BadRequestException({
        message: 'Error al validar los datos',
        errores: mensajes,
      });
    },
  }));
  app.enableCors();
  
  // Interceptor global para respuestas exitosas
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Filtro global para respuestas de error
  app.useGlobalFilters(new AllExceptionsFilter());

  //Documentación de la API
  const config = new DocumentBuilder()
    .setTitle('Documentación de la API DentAR')
    .setDescription('Esta es la documentación de la API DentAR')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Administradores')
    .addTag('Pacientes')
    .addTag('Odontólogos')
    .addTag('Auxiliares')
    .addTag('Citas')
    .addTag('Diagnósticos')
    .addTag('Parámetros')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
