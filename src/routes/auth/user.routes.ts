import { FastifyInstance } from "fastify";
import { UserController } from "../../controllers/auth/user.controller";

export async function userRoutes(app: FastifyInstance) {
    // ===========================
    // =========== GET ===========
    // ===========================

    app.get("/me", { preHandler: [app.authenticate] }, UserController.getMe);

    // ===========================
    // ========== POST ===========
    // ===========================

    // Création d'un utilisateur
    app.post("/user", UserController.createUser);

    // ===========================
    // ========= DELETE ==========
    // ===========================

    // Suppression de son propre compte
    app.delete(
        "/me",
        { preHandler: [app.authenticate] },
        UserController.deleteMe,
    );
}
