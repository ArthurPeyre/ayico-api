import { pool } from "../../db";
import {
    FILTERABLE_USER_COLUMNS,
    FilterableUserData,
    UserEntity,
} from "../../entities/auth/user.entity";
import {
    buildDeleteQuery,
    buildSelectQuery,
    WhereInput,
} from "../../utils/QueryBuilder";

export class UserModel {
    // Création d'un User
    static async createUser(user: UserEntity): Promise<UserEntity> {
        const query = `
            INSERT INTO authentication.users (email, name, password_hash)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        const result = await pool.query(query, [
            user.email,
            user.name,
            user.password_hash,
        ]);

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
