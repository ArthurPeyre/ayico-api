import type { FastifyInstance, FastifyReply } from "fastify";
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

declare module "fastify" {
    interface FastifyReply {
        sendInternalError(
            error: unknown,
            message?: string,
            statusCode?: HSC,
        ): { message?: string; error: string; statusCode: HSC };
    }
}

export function registerErrorHandling(app: FastifyInstance) {
    app.decorateReply(
        "sendInternalError",
        function (
            this: FastifyReply,
            error: unknown,
            message?: string,
            statusCode?: HSC,
        ) {
            const code = statusCode || HSC.INTERNAL_SERVER_ERROR;
            const label = ERROR_LABELS[code] ?? "Internal Server Error";
            const msg = message || label;

            this.request.log.error(error);
            this.code(code);

            return {
                error: label,
                statusCode: code,
                ...(msg && { message: msg }),
            };
        },
    );
}
