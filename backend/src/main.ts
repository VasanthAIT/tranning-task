import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
 
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  app.enableCors({
  origin: 'http://localhost:3001',
});

  app.useGlobalPipes(new ValidationPipe());
  
 
  await app.listen(3000);
  console.log(`Backend server running at http://localhost:3000`);
}
bootstrap();
