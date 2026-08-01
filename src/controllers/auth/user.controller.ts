import type { FastifyReply, FastifyRequest } from "fastify";
import { UserEntity } from "../../entities/auth/user.entity";
import { NotFoundError } from "../../errors/AppError";
import { UserService } from "../../services/auth/user.service";
import { HttpStatusCode as HSC } from "../../utils/HttpStatusCode";

interface CreateUserBody {
    email: string;
    name: string;
    password: string;
}

export class UserController {
    static async getMe(req: FastifyRequest, reply: FastifyReply) {
        try {
            const [user] = await UserService.getUsers({
                where: { email: req.user.email },
                limit: 1,
            });

            if (!user) throw new NotFoundError("User not found");

            return user;
        } catch (error) {
            return reply.sendInternalError(error);
        }
    }

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
            return reply.sendInternalError(error, {
                message: "User creation failed",
            });
        }
    }

    static async getAllUsers(req: FastifyRequest, reply: FastifyReply) {
        try {
            return await UserService.getAllUsers();
        } catch (error) {
            return reply.sendInternalError(error, {
                message: "Failed to retrieve users",
            });
        }
    }
}
