import type { FastifyReply, FastifyRequest } from "fastify";
import { getApiHealth, getDatabaseHealth } from "../services/health.service";
import { HttpStatusCode as HSC } from "../utils/HttpStatusCode";

export async function getHealth(_req: FastifyRequest, _reply: FastifyReply) {
    return getApiHealth();
}

export async function getDbHealth(_req: FastifyRequest, reply: FastifyReply) {
    const result = await getDatabaseHealth();
    if (result.status !== "ok") reply.code(HSC.SERVICE_UNAVAILABLE);
    return result;
}
