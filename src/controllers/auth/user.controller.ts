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
            return reply.sendInternalError(error, {
                message: "Failed to retrieve user",
            });
        }
    }

    static async deleteMe(req: FastifyRequest, reply: FastifyReply) {
        try {
            const [deletedUser] = await UserService.deleteUsers({
                email: req.user.email,
            });

            if (!deletedUser) throw new NotFoundError("User not found");

            reply.code(HSC.NO_CONTENT);
        } catch (error) {
            return reply.sendInternalError(error, {
                message: "Failed to delete user",
            });
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
}
