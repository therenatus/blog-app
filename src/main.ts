import { NestFactory } from '@nestjs/core';
import express from 'express';
import { AppModule } from './app.module';
import { appSettings } from './app.settings';
import { ExpressAdapter } from '@nestjs/platform-express';

const server = express();
export async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  appSettings(app);
  await app.listen(3000);
}
bootstrap();
export default server;
