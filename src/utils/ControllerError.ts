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

// Erreurs qu'on choisit de faire confiance (message + statusCode surs a exposer tels quels):
// nos AppError, ou une erreur externe (Fastify, etc.) qui porte deja un statusCode 4xx.
// Jamais un 5xx externe: on ne sait pas ce que son message peut reveler.
function resolveKnownError(
    error: unknown,
): { statusCode: HSC; message: string } | undefined {
    if (error instanceof AppError) {
        return { statusCode: error.statusCode, message: error.message };
    }

    if (
        error instanceof Error &&
        "statusCode" in error &&
        typeof error.statusCode === "number" &&
        error.statusCode >= 400 &&
        error.statusCode < 500
    ) {
        return { statusCode: error.statusCode as HSC, message: error.message };
    }

    return undefined;
}

declare module "fastify" {
    interface FastifyReply {
        sendInternalError(error: unknown, options?: SendErrorOptions): FastifyReply;
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
            const known = resolveKnownError(error);
            const code =
                known?.statusCode ||
                options.statusCode ||
                HSC.INTERNAL_SERVER_ERROR;
            const label = ERROR_LABELS[code] ?? "Internal Server Error";
            const msg = known?.message || options.message || label;
            const errorMessage = error instanceof Error ? error.message : String(error);

            this.request.log.error(`${code} > ${known?.message ?? errorMessage}`);

            const payload = {
                error: label,
                statusCode: code,
                ...(msg && { message: msg }),
            };

            this.code(code).send(payload);

            return this;
        },
    );
}
