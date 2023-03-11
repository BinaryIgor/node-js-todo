import { knex, Knex } from "knex";

type DbConfig = {
    host: string,
    port: number,
    database: string,
    user: string,
    password: string,
    migrationsDir?: string
};

export const postgresDb = (config: DbConfig): Knex => {
    const knexConfig: any = {
        client: "pg",
        connection: {
            host: config.host,
            port: config.port,
            database: config.database,
            user: config.user,
            password: config.password,
        },
        pool: {
            min: 2,
            max: 10
        }
    };

    if (config.migrationsDir) {
        knexConfig.migrations = {
            directory: config.migrationsDir
        };
    }

    return knex(knexConfig);
}