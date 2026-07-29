import Fastify from "fastify";
import { config } from "./config";
import { healthRoutes } from "./routes/health";

const app = Fastify({ logger: true });

app.register(healthRoutes);

app.listen({ port: config.port, host: "0.0.0.0" }).catch((err) => {
    app.log.error(err);
    process.exit(1);
});
