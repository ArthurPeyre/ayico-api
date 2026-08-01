import { UserData, UserEntity } from "../../entities/auth/user.entity";
import { UserModel } from "../../models/auth/user.model";

export class UserService {
    static async getUsers(
        options: {
            where?: Partial<Omit<UserData, "password_hash">>;
            orderBy?: {
                column: keyof Omit<UserData, "password_hash"> & string;
                direction?: "ASC" | "DESC";
            };
            limit?: number;
            offset?: number;
        } = {},
    ): Promise<UserEntity[]> {
        return UserModel.getUsers(options);
    }

    static async createUser(user: UserEntity): Promise<UserEntity> {
        return UserModel.createUser(user);
    }

    static async getAllUsers(): Promise<UserEntity[]> {
        return UserModel.getAllUsers();
    }
}
