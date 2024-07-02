// Packages
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Tasker Example')
    .setDescription('The Tasker API description')
    .setVersion('1.0')
    .addTag('task')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  const cors = {
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS'
  };

  SwaggerModule.setup('api', app, document);
  app.enableCors(cors);
  await app.listen(3000);
}
bootstrap();
