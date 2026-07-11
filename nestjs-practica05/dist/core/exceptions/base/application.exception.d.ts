import { HttpException, HttpStatus } from '@nestjs/common';
export declare abstract class ApplicationException extends HttpException {
    constructor(message: string, status: HttpStatus);
}
