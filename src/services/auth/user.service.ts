import { withTransaction } from "../../db";
import { FamilyEntity } from "../../entities/auth/family.entity";
import {
    FilterableUserData,
    UserEntity,
} from "../../entities/auth/user.entity";
import { UserModel } from "../../models/auth/user.model";
import { WhereInput } from "../../utils/QueryBuilder";
import { FamilyService } from "./family.service";

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
        // Creation de famille + creation de user dans une seule transaction:
        // si l'insertion du user echoue, la famille creee juste avant est rollback avec,
        // pas de famille orpheline en base.
        return withTransaction(async (client) => {
            // Si l'utilisateur n'a pas de famille, la lui créer
            if (!user.family_id) {
                const createdFamily = await FamilyService.createFamily(
                    new FamilyEntity({ name: user.name }),
                    client,
                );
                user.family_id = createdFamily.id;
            }
            return UserModel.createUser(user, client);
        });
    }

    static async deleteUsers(
        where: WhereInput<FilterableUserData>,
    ): Promise<UserEntity[]> {
        return UserModel.deleteUsers(where);
    }
}
