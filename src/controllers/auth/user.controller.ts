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
        } catch (error: any) {
            req.log.error(error);
            reply.code(HSC.INTERNAL_SERVER_ERROR);
            return {
                error: "Internal server error",
                statusCode: HSC.INTERNAL_SERVER_ERROR,
            };
        }
    }

    static async getAllUsers(req: FastifyRequest, reply: FastifyReply) {
        try {
            const users = await UserService.getAllUsers();
            return users;
        } catch (error: any) {
            req.log.error(error);
            reply.code(HSC.INTERNAL_SERVER_ERROR);
            return {
                error: "Internal server error",
                statusCode: HSC.INTERNAL_SERVER_ERROR,
            }; 
        }
    }
}
