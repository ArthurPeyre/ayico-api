import type { FastifyReply, FastifyRequest } from "fastify";
import { FamilyEntity } from "../../entities/auth/family.entity";
import { NotFoundError } from "../../errors/AppError";
import { FamilyService } from "../../services/auth/family.service";
import { HttpStatusCode as HSC } from "../../utils/HttpStatusCode";

export interface CreateFamilyBody {
    name?: string;
}

export class FamilyController {
    static async getFamilies(req: FastifyRequest, reply: FastifyReply) {
        try {
            return await FamilyService.getFamilies();
        } catch (error) {
            return reply.sendInternalError(error, {
                message: "Failed to retrieve families",
            });
        }
    }

    static async getFamily(
        req: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply,
    ) {
        try {
            const [family] = await FamilyService.getFamilies({
                where: { id: Number(req.params.id) },
                limit: 1,
            });

            if (!family) throw new NotFoundError("Family not found");

            return family;
        } catch (error) {
            return reply.sendInternalError(error, {
                message: "Failed to retrieve family",
            });
        }
    }

    static async createFamily(
        req: FastifyRequest<{ Body: CreateFamilyBody }>,
        reply: FastifyReply,
    ) {
        try {
            const family = new FamilyEntity({ name: req.body.name ?? null });
            const createdFamily = await FamilyService.createFamily(family);
            reply.code(HSC.CREATED);
            return createdFamily;
        } catch (error) {
            return reply.sendInternalError(error, {
                message: "Family creation failed",
            });
        }
    }

    static async deleteFamily(
        req: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply,
    ) {
        try {
            const [deletedFamily] = await FamilyService.deleteFamilies({
                id: Number(req.params.id),
            });

            if (!deletedFamily) throw new NotFoundError("Family not found");

            reply.code(HSC.NO_CONTENT);
        } catch (error) {
            return reply.sendInternalError(error, {
                message: "Failed to delete family",
            });
        }
    }
}
