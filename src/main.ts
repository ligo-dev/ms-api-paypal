import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { config } from './config';

async function bootstrap() {
  const { swagger, server, proyect } = config();
  
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log'],
  });

  // Configuración del path context a nivel global
  app.setGlobalPrefix(server.context);

  // Habilita la validación global
  app.useGlobalPipes(new ValidationPipe());

  // Configuración de Swagger
  if (swagger.enabled) {
    const config = new DocumentBuilder()
      .setTitle(`${proyect.name}`)
      .setDescription(`Swagger - ${proyect.description}`)
      .setVersion(`${proyect.version}`)
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      })
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${swagger.path}`, app, document);
  }

  await app.listen(server.port);
}
bootstrap();
