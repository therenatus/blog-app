import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ErrorExceptionFilter, HttpExceptionFilter } from './exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (err) => {
        const errorResponse: any[] = [];
        err.forEach((error: any) => {
          const zeroKey = Object.keys(error.constraints)[0];
          errorResponse.push({
            message: error.constraints[zeroKey],
            field: error.property,
          });
        });
        throw new BadRequestException(errorResponse);
      },
    }),
  );
  app.useGlobalFilters(new ErrorExceptionFilter(), new HttpExceptionFilter());
  app.setGlobalPrefix('/api');
  await app.listen(3000);
}
bootstrap();
