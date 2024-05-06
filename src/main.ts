import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { exit } from 'process';
import * as express from 'express';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.use(express.json());
  const configService = app.get(ConfigService);

  const host: string = configService.get<string>('app.http.host');
  const port: number = configService.get<number>('app.http.port');

  const serverEndpoint = `http://${host}:${port}`;
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  try {
    await app.listen(port);
    logger.log(`==========================================================`);
    logger.log(`Server running on ${serverEndpoint}`, 'NestApplication');
    logger.log(`==========================================================`);
  } catch (err) {
    logger.log("there was some error");
    logger.log(err);
    exit(-1);
  };
}

bootstrap();





// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();
