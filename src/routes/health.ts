import type { FastifyInstance } from "fastify";
import { pool } from "../db";

export async function healthRoutes(app: FastifyInstance) {
    app.get("/health", async () => ({ status: "ok" }));

    app.get("/health/db", async (_req, reply) => {
        try {
            await pool.query("SELECT 1");
            return { status: "ok" };
        } catch (err) {
            app.log.error(err);
            reply.code(503);
            return { status: "unreachable" };
        }
    });
}
