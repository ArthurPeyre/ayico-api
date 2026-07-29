import type { FastifyInstance } from "fastify";
import { HealthController } from "../controllers/health.controller";

export async function healthRoutes(app: FastifyInstance) {
    app.get("/health", HealthController.getHealth);
    app.get("/health/db", HealthController.getDbHealth);
}
