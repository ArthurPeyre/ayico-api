import { Pool, PoolClient } from "pg";
import { FamilyData, FamilyEntity } from "../../entities/auth/family.entity";
import { FamilyModel } from "../../models/auth/family.model";
import { WhereInput } from "../../utils/QueryBuilder";

export class FamilyService {
    static async getFamilies(
        options: {
            where?: WhereInput<FamilyData>;
            orderBy?: {
                column: keyof FamilyData & string;
                direction?: "ASC" | "DESC";
            };
            limit?: number;
            offset?: number;
        } = {},
    ): Promise<FamilyEntity[]> {
        return FamilyModel.getFamilies(options);
    }

    static async createFamily(
        family: FamilyEntity,
        db?: Pool | PoolClient,
    ): Promise<FamilyEntity> {
        return FamilyModel.createFamily(family, db);
    }

    static async deleteFamilies(
        where: WhereInput<FamilyData>,
    ): Promise<FamilyEntity[]> {
        return FamilyModel.deleteFamilies(where);
    }
}
