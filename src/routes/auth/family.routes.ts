import { FastifyInstance } from "fastify";
import { CreateFamilyData } from "../../dto/auth/family.dto";
import { FamilyController } from "../../controllers/auth/family.controller";

export async function familyRoutes(app: FastifyInstance) {
    // ===========================
    // =========== GET ===========
    // ===========================

    app.get(
        "/families",
        { preHandler: [app.authenticate] },
        FamilyController.getFamilies,
    );
    app.get<{ Params: { id: string } }>(
        "/family/:id",
        { preHandler: [app.authenticate] },
        (req, reply) => FamilyController.getFamily(req, reply),
    );

    // ===========================
    // ========== POST ===========
    // ===========================

    // Création d'une famille
    app.post<{ Body: CreateFamilyData }>(
        "/family",
        { preHandler: [app.authenticate] },
        (req, reply) => FamilyController.createFamily(req, reply),
    );

    // ===========================
    // ========= DELETE ==========
    // ===========================

    app.delete<{ Params: { id: string } }>(
        "/family/:id",
        { preHandler: [app.authenticate] },
        (req, reply) => FamilyController.deleteFamily(req, reply),
    );
}
