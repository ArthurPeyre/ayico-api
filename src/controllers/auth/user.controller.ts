import type { FastifyReply, FastifyRequest } from "fastify";
import { UserEntity } from "../../entities/auth/user.entity";
import { UserService } from "../../services/auth/user.service";
import { HttpStatusCode as HSC } from "../../utils/HttpStatusCode";

interface CreateUserBody {
    email: string;
    name: string;
    password: string;
}

export class UserController {
    static async createUser(
        req: FastifyRequest<{ Body: CreateUserBody }>,
        reply: FastifyReply,
    ) {
        try {
            const user = await UserEntity.create(req.body);
            const createdUser = await UserService.createUser(user);
            reply.code(HSC.CREATED);
            return createdUser;
        } catch (error) {
            return reply.sendInternalError(error, "User creation failed");
        }
    }

    static async getAllUsers(req: FastifyRequest, reply: FastifyReply) {
        try {
            return await UserService.getAllUsers();
        } catch (error) {
            return reply.sendInternalError(error, "Failed to retrieve users");
        }
    }
}
