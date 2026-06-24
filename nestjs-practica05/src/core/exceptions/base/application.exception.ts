import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class ApplicationException extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
}
