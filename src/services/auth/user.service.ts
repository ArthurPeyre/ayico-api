import { UserEntity } from "../../entities/auth/user.entity";
import { UserModel } from "../../models/auth/user.model";

export class UserService {
    static async createUser(user: UserEntity): Promise<UserEntity> {
        return UserModel.createUser(user);
    }

    static async getAllUsers(): Promise<UserEntity[]> {
        return UserModel.getAllUsers();
    }
}
