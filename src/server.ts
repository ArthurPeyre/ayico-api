import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { config } from "./config";
import { healthRoutes } from "./routes/health.routes";
import { userRoutes } from "./routes/auth/user.routes";

const app = Fastify({ logger: true });

app.register(fastifyJwt, {
    secret: config.jwtSecret,
    sign: { expiresIn: "2h" },
});

app.decorate("authenticate", async (req, reply) => {
    try {
        await req.jwtVerify();
    } catch (error) {
        req.log.error(error);
        reply.code(401).send({ error: "Unauthorized" });
    }
});

app.register(healthRoutes);
app.register(userRoutes);

app.listen({ port: config.port, host: "0.0.0.0" }).catch((err) => {
    app.log.error(err);
    process.exit(1);
});
