"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestException = void 0;
const common_1 = require("@nestjs/common");
const application_exception_1 = require("../base/application.exception");
class BadRequestException extends application_exception_1.ApplicationException {
    constructor(message) {
        super(message, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.BadRequestException = BadRequestException;
