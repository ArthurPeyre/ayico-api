import { pool } from "../../db";
import { UserEntity } from "../../entities/auth/user.entity";

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

    // Récupération de tous les utilisateurs
    static async getAllUsers(): Promise<UserEntity[]> {
        const query = `
            SELECT * FROM authentication.users;
        `;

        const results = await pool.query(query);

        return results.rows.map((row) => new UserEntity(row));
    }

    // Recherche d'un User par email (pour le login)
    static async findByEmail(email: string): Promise<UserEntity | null> {
        const query = `
            SELECT * FROM authentication.users WHERE email = $1;
        `;

        const result = await pool.query(query, [email]);

        return result.rows[0] ? new UserEntity(result.rows[0]) : null;
    }
}
