import type { FastifyReply, FastifyRequest } from "fastify";
import { getApiHealth, getDatabaseHealth } from "../services/health.service";

export async function getHealth(_req: FastifyRequest, _reply: FastifyReply) {
    return getApiHealth();
}

export async function getDbHealth(_req: FastifyRequest, reply: FastifyReply) {
    const result = await getDatabaseHealth();
    if (result.status !== "ok") reply.code(503);
    return result;
}
