import { Pool, PoolClient } from "pg";
import { config } from "./config";

export const pool = new Pool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
});

// Execute plusieurs requetes sur le meme client dans une transaction:
// soit tout est commit, soit tout est rollback en cas d'erreur.
export async function withTransaction<T>(
    callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const result = await callback(client);
        await client.query("COMMIT");
        return result;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}
