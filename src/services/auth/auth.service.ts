import { UnauthorizedError } from "../../errors/AppError";
import { UserEntity } from "../../entities/auth/user.entity";
import { UserModel } from "../../models/auth/user.model";

export class AuthService {
    static async login(email: string, password: string): Promise<UserEntity> {
        const user = await UserModel.findByEmail(email);
        if (!user) throw new UnauthorizedError("Invalid credentials");

        const isValid = await user.verifyPassword(password);
        if (!isValid) throw new UnauthorizedError("Invalid credentials");

        return user;
    }
}
