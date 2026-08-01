import {
    FilterableUserData,
    UserEntity,
} from "../../entities/auth/user.entity";
import { UserModel } from "../../models/auth/user.model";
import { WhereInput } from "../../utils/QueryBuilder";

export class UserService {
    static async getUsers(
        options: {
            where?: WhereInput<FilterableUserData>;
            orderBy?: {
                column: keyof FilterableUserData & string;
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

    static async deleteUsers(
        where: WhereInput<FilterableUserData>,
    ): Promise<UserEntity[]> {
        return UserModel.deleteUsers(where);
    }
}
