import type { FastifyInstance } from "fastify";
import { getDbHealth, getHealth } from "../controllers/health.controller";

export async function healthRoutes(app: FastifyInstance) {
    app.get("/health", getHealth);
    app.get("/health/db", getDbHealth);
}
