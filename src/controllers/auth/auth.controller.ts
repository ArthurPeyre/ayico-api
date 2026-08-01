import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "../../services/auth/auth.service";

interface LoginBody {
    email: string;
    password: string;
}

export class AuthController {
    static async login(
        req: FastifyRequest<{ Body: LoginBody }>,
        reply: FastifyReply,
    ) {
        try {
            const user = await AuthService.login(
                req.body.email,
                req.body.password,
            );
            const token = await reply.jwtSign({
                id: user.id,
                email: user.email,
            });
            return { token };
        } catch (error) {
            return reply.sendInternalError(error);
        }
    }
}
