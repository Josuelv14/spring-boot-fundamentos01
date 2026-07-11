"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Error interno del servidor';
        let error = 'Internal Server Error';
        let details;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'object' &&
                exceptionResponse !== null &&
                'message' in exceptionResponse) {
                const body = exceptionResponse;
                if (Array.isArray(body.message)) {
                    message = 'Datos de entrada inválidos';
                    details = this.extractValidationErrors(body.message);
                }
                else {
                    message = body.message ?? exception.message;
                }
                error = body.error ?? this.getErrorName(status);
            }
            else {
                message = exception.message;
                error = this.getErrorName(status);
            }
        }
        const errorResponse = {
            timestamp: new Date().toISOString(),
            status,
            error,
            message,
            path: request.url,
            ...(details && { details }),
        };
        response.status(status).json(errorResponse);
    }
    extractValidationErrors(messages) {
        const errors = {};
        messages.forEach((message) => {
            const field = this.extractFieldFromMessage(message);
            errors[field] = message;
        });
        return errors;
    }
    extractFieldFromMessage(message) {
        return message.split(' ')[0];
    }
    getErrorName(status) {
        return common_1.HttpStatus[status] ?? 'Internal Server Error';
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
