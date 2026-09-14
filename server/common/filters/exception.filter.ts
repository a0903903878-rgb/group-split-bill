import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { API_RESPONSE_CODE } from '../constants/api_response_code';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse && typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).message
          : '服务器内部错误';

    const codeMap: Record<number, number> = {
      [HttpStatus.BAD_REQUEST]: API_RESPONSE_CODE.BAD_REQUEST,
      [HttpStatus.UNAUTHORIZED]: API_RESPONSE_CODE.UNAUTHORIZED,
      [HttpStatus.FORBIDDEN]: API_RESPONSE_CODE.FORBIDDEN,
      [HttpStatus.NOT_FOUND]: API_RESPONSE_CODE.NOT_FOUND,
    };

    response.status(status).json({
      code: codeMap[status] ?? API_RESPONSE_CODE.INTERNAL_ERROR,
      message: Array.isArray(message) ? message.join('; ') : message,
      data: null,
    });
  }
}
