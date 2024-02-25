import { NestFactory } from '@nestjs/core';
import express from 'express';
import { AppModule } from './app.module';
import { appSettings } from './app.settings';
import { ExpressAdapter } from '@nestjs/platform-express';

const server = express();
export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appSettings(app);
  await app.listen(3000);
  new ExpressAdapter(server);
}
bootstrap();
export default server;
