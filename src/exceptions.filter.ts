import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as process from 'process';

@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: any = ctx.getResponse<Response>();
    if (process.env.environment !== 'prod') {
      response
        .status(500)
        .json({ error: exception.toString(), stack: exception.stack });
    } else {
      response.status(500).send('Some occurred');
    }
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: any = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === 400) {
      const errorResponse = {
        errorsMessages: [] as string[],
      };
      const responseBody: any = exception.getResponse();
      if (Array.isArray(responseBody.message)) {
        responseBody.message.forEach((m) =>
          errorResponse.errorsMessages.push(m),
        );
        return response.status(status).json(errorResponse);
      } else if (typeof responseBody.message === 'string') {
        return response.status(status).json(responseBody.message);
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
