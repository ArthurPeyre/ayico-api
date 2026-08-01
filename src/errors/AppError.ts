import { HttpStatusCode as HSC } from "../utils/HttpStatusCode";

export class AppError extends Error {
    statusCode: HSC;

    constructor(message: string, statusCode: HSC = HSC.INTERNAL_SERVER_ERROR) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Not Found") {
        super(message, HSC.NOT_FOUND);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, HSC.UNAUTHORIZED);
    }
}
