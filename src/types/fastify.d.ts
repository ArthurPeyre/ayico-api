import "fastify";
import "@fastify/jwt";

declare module "fastify" {
    interface FastifyInstance {
        authenticate: (
            req: FastifyRequest,
            reply: FastifyReply,
        ) => Promise<void>;
    }
}

declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: { id: number | null; email: string };
        user: { id: number | null; email: string };
    }
}
