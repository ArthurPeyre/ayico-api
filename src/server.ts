import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { config } from "./config";
import { healthRoutes } from "./routes/health.routes";
import { userRoutes } from "./routes/auth/user.routes";
import { authRoutes } from "./routes/auth/auth.routes";
import { registerErrorHandling } from "./utils/ControllerError";
import { HttpStatusCode as HSC } from "./utils/HttpStatusCode";

const app = Fastify({ logger: true });

registerErrorHandling(app);

app.register(fastifyJwt, {
    secret: config.jwtSecret,
    sign: { expiresIn: "2h" },
});

app.decorate("authenticate", async (req, reply) => {
    try {
        await req.jwtVerify();
    } catch (error: any) {
        reply.sendInternalError(error, {
            message: "Invalid or missing authentication token",
            statusCode: HSC.UNAUTHORIZED,
        });
    }
});

app.register(healthRoutes);
app.register(userRoutes);
app.register(authRoutes);

app.listen({ port: config.port, host: "0.0.0.0" }).catch((err) => {
    app.log.error(err);
    process.exit(1);
});
