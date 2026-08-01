import { FastifyInstance } from "fastify";
import { UserController } from "../../controllers/auth/user.controller";

export async function userRoutes(app: FastifyInstance) {
    // ===========================
    // =========== GET ===========
    // ===========================

    app.get("/me", { preHandler: [app.authenticate] }, UserController.getMe);
    app.get(
        "/users",
        { preHandler: [app.authenticate] },
        UserController.getAllUsers,
    );

    // ===========================
    // ========== POST ===========
    // ===========================

    // Création d'un utilisateur
    app.post("/user", UserController.createUser);
}
