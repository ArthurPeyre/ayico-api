import "dotenv/config";

export const config = {
    port: Number(process.env.PORT ?? 3000),
    db: {
        host: process.env.PGHOST ?? "infra_postgres",
        port: Number(process.env.PGPORT ?? 5432),
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
    },
};
