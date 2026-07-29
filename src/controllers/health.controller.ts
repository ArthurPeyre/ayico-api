import type { FastifyReply, FastifyRequest } from "fastify";
import { getApiHealth, getDatabaseHealth } from "../services/health.service";
import { HttpStatusCode as HSC } from "../utils/HttpStatusCode";

export class HealthController {
    // État de l'API
    static async getHealth(_req: FastifyRequest, _reply: FastifyReply) {
        return getApiHealth();
    }

    // État de la connexion à la base de données
    static async getDbHealth(_req: FastifyRequest, reply: FastifyReply) {
        const result = await getDatabaseHealth();
        if (result.status !== "ok") reply.code(HSC.SERVICE_UNAVAILABLE);
        return result;
    }
}
