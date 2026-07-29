import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is required");
}

export const config = {
    port: Number(process.env.PORT ?? 3000),
    jwtSecret,
    db: {
        host: process.env.PGHOST ?? "infra_postgres",
        port: Number(process.env.PGPORT ?? 5432),
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
    },
};
