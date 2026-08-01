import type { FastifyInstance, FastifyReply } from "fastify";
import { AppError } from "../errors/AppError";
import { HttpStatusCode as HSC } from "./HttpStatusCode";

const ERROR_LABELS: Partial<Record<HSC, string>> = {
    [HSC.BAD_REQUEST]: "Bad Request",
    [HSC.UNAUTHORIZED]: "Unauthorized",
    [HSC.FORBIDDEN]: "Forbidden",
    [HSC.NOT_FOUND]: "Not Found",
    [HSC.CONFLICT]: "Conflict",
    [HSC.UNPROCESSABLE_ENTITY]: "Unprocessable Entity",
    [HSC.INTERNAL_SERVER_ERROR]: "Internal Server Error",
    [HSC.SERVICE_UNAVAILABLE]: "Service Unavailable",
};

interface SendErrorOptions {
    message?: string;
    statusCode?: HSC;
}

declare module "fastify" {
    interface FastifyReply {
        sendInternalError(
            error: unknown,
            options?: SendErrorOptions,
        ): { message?: string; error: string; statusCode: HSC };
    }
}

export function registerErrorHandling(app: FastifyInstance) {
    app.decorateReply(
        "sendInternalError",
        function (
            this: FastifyReply,
            error: unknown,
            options: SendErrorOptions = {},
        ) {
            const isAppError = error instanceof AppError;
            const code =
                (isAppError ? error.statusCode : undefined) ||
                options.statusCode ||
                HSC.INTERNAL_SERVER_ERROR;
            const label = ERROR_LABELS[code] ?? "Internal Server Error";
            const msg =
                (isAppError ? error.message : undefined) ||
                options.message ||
                label;

            this.request.log.error(error);

            const payload = {
                error: label,
                statusCode: code,
                ...(msg && { message: msg }),
            };

            this.code(code).send(payload);

            return payload;
        },
    );
}
