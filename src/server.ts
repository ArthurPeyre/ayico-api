import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { config } from "./config";
import { healthRoutes } from "./routes/health.routes";
import { userRoutes } from "./routes/auth/user.routes";
import { authRoutes } from "./routes/auth/auth.routes";
import { registerErrorHandling } from "./utils/ControllerError";
import { HttpStatusCode as HSC } from "./utils/HttpStatusCode";

const app = Fastify({
    logger:
        process.env.NODE_ENV === "production"
            ? true
            : {
                  transport: {
                      target: "pino-pretty",
                      options: {
                          translateTime: "HH:MM:ss",
                          ignore: "pid,hostname,reqId",
                          colorize: true,
                      },
                  },
              },
    disableRequestLogging: true,
});

const SENSITIVE_BODY_KEYS = ["password", "password_hash"];

function redactBody(body: unknown): unknown {
    if (!body || typeof body !== "object") return body;
    return Object.fromEntries(
        Object.entries(body).map(([key, value]) =>
            SENSITIVE_BODY_KEYS.includes(key) ? [key, "[REDACTED]"] : [key, value],
        ),
    );
}

app.addHook("preHandler", (request, reply, done) => {
    const payload = request.body ? ` ${JSON.stringify(redactBody(request.body))}` : "";
    request.log.info(`${request.method} ${request.url}${payload}`);
    done();
});

registerErrorHandling(app);

app.setErrorHandler((error, request, reply) => {
    reply.sendInternalError(error);
});

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
