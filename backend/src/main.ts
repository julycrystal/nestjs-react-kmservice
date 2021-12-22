import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap () {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.useLogger(app.get(Logger));
  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'));
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }))
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
