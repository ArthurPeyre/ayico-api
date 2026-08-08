import { Pool, PoolClient } from "pg";
import { pool } from "../../db";
import {
    FILTERABLE_USER_COLUMNS,
    FilterableUserData,
    INSERTABLE_USER_COLUMNS,
    UserEntity,
} from "../../entities/auth/user.entity";
import {
    buildDeleteQuery,
    buildInsertQuery,
    buildSelectQuery,
    WhereInput,
} from "../../utils/QueryBuilder";
import { pick } from "../../utils/pick";

export class UserModel {
    // Création d'un User
    // db: le pool par defaut, ou un client de transaction (voir withTransaction) pour lier
    // cette creation a d'autres requetes dans une meme transaction (ex: FamilyModel.createFamily)
    static async createUser(
        user: UserEntity,
        db: Pool | PoolClient = pool,
    ): Promise<UserEntity> {
        const { text, values } = buildInsertQuery(
            "authentication.users",
            INSERTABLE_USER_COLUMNS,
            pick(user, INSERTABLE_USER_COLUMNS),
        );

        const result = await db.query(text, values);

        return new UserEntity(result.rows[0]);
    }

    // Recherche d'un User par email (pour le login)
    static async findByEmail(email: string): Promise<UserEntity | null> {
        const query = `
            SELECT * FROM authentication.users WHERE email = $1;
        `;

        const result = await pool.query(query, [email]);

        return result.rows[0] ? new UserEntity(result.rows[0]) : null;
    }

    // Recherche flexible (filtres/tri dynamiques)
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
        const { text, values } = buildSelectQuery<FilterableUserData>(
            "authentication.users",
            FILTERABLE_USER_COLUMNS,
            options,
        );

        const results = await pool.query(text, values);

        return results.rows.map((row) => new UserEntity(row));
    }

    // Suppression selon des criteres dynamiques (where obligatoire, jamais un DELETE sans condition)
    // Accepte des tableaux de valeurs (ex: { id: [1, 5, 9] }) pour supprimer plusieurs comptes cibles en une requete
    static async deleteUsers(
        where: WhereInput<FilterableUserData>,
    ): Promise<UserEntity[]> {
        const { text, values } = buildDeleteQuery<FilterableUserData>(
            "authentication.users",
            FILTERABLE_USER_COLUMNS,
            where,
        );

        const results = await pool.query(text, values);

        return results.rows.map((row) => new UserEntity(row));
    }
}
