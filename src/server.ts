import Fastify from "fastify";
import { config } from "./config";
import { healthRoutes } from "./routes/health.routes";
import { userRoutes } from "./routes/auth/user.routes";

const app = Fastify({ logger: true });

app.register(healthRoutes);
app.register(userRoutes);

app.listen({ port: config.port, host: "0.0.0.0" }).catch((err) => {
    app.log.error(err);
    process.exit(1);
});
