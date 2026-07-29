import { UserEntity } from "../../entities/auth/user.entity";
import { UserModel } from "../../models/auth/user.model";

export class AuthService {
    static async login(email: string, password: string): Promise<UserEntity> {
        const user = await UserModel.findByEmail(email);
        if (!user) throw new Error("Invalid credentials");

        const isValid = await user.verifyPassword(password);
        if (!isValid) throw new Error("Invalid credentials");

        return user;
    }
}