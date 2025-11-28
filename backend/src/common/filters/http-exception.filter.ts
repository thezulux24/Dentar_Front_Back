import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { buildResponse } from '../utils/response.util';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // console.error('Exception caught by filter:', exception);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let data: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: any = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object') {
        message = res.message || res.error || message;

        // Si la excepción trae campos adicionales, los pasamos como data
        const { message: _msg, error, statusCode, ...rest } = res;
        if (Object.keys(rest).length > 0) {
          data = rest;
        }
      }
    }

    response.status(status).json(
      buildResponse(false, message, data),
    );
  }
}
