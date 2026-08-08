import { Pool, PoolClient } from "pg";
import { pool } from "../../db";
import {
    FAMILY_COLUMNS,
    FamilyData,
    FamilyEntity,
    INSERTABLE_FAMILY_COLUMNS,
} from "../../entities/auth/family.entity";
import {
    buildDeleteQuery,
    buildInsertQuery,
    buildSelectQuery,
    WhereInput,
} from "../../utils/QueryBuilder";
import { pick } from "../../utils/pick";

export class FamilyModel {
    // Création d'une Family
    // db: le pool par defaut, ou un client de transaction (voir withTransaction) pour lier
    // cette creation a d'autres requetes dans une meme transaction (ex: UserModel.createUser)
    static async createFamily(
        family: FamilyEntity,
        db: Pool | PoolClient = pool,
    ): Promise<FamilyEntity> {
        const { text, values } = buildInsertQuery(
            "authentication.families",
            INSERTABLE_FAMILY_COLUMNS,
            pick(family, INSERTABLE_FAMILY_COLUMNS),
        );

        const result = await db.query(text, values);

        return new FamilyEntity(result.rows[0]);
    }

    // Recherche flexible (filtres/tri dynamiques)
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
        const { text, values } = buildSelectQuery<FamilyData>(
            "authentication.families",
            FAMILY_COLUMNS,
            options,
        );

        const results = await pool.query(text, values);

        return results.rows.map((row) => new FamilyEntity(row));
    }

    // Suppression selon des criteres dynamiques (where obligatoire, jamais un DELETE sans condition)
    static async deleteFamilies(
        where: WhereInput<FamilyData>,
    ): Promise<FamilyEntity[]> {
        const { text, values } = buildDeleteQuery<FamilyData>(
            "authentication.families",
            FAMILY_COLUMNS,
            where,
        );

        const results = await pool.query(text, values);

        return results.rows.map((row) => new FamilyEntity(row));
    }
}
