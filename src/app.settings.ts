import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ErrorExceptionFilter, HttpExceptionFilter } from './exceptions.filter';

export const appSettings = (app: INestApplication) => {
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
};
