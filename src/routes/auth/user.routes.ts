import { FastifyInstance } from "fastify";
import { UserController } from "../../controllers/auth/user.controller";

export async function userRoutes(app: FastifyInstance) {
    app.post("/user", UserController.createUser);
    app.get(
        "/users",
        { preHandler: [app.authenticate] },
        UserController.getAllUsers,
    );
}
