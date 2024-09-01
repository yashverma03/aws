import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const configService = new ConfigService();

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Setup CORS
  app.enableCors();

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true
    })
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('AWS API')
    .setDescription('AWS API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      operationsSorter: 'method',
      tagsSorter: 'alpha'
    }
  });

  const port = configService.getOrThrow('PORT');
  await app.listen(port);
};

bootstrap();
