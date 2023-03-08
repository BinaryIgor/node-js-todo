import { knex, Knex } from "knex";

type DbConfig = {
    host: string,
    port: number,
    databse: string,
    user: string,
    password: string,
    migrationsDir: string
};

export const postgresDb = (config: DbConfig): Knex => {
    return knex({
        client: "pg",
        connection: {
            host: config.host,
            port: config.port,
            database: config.databse,
            user: config.user,
            password: config.password,
        },
        migrations: {
            directory: config.migrationsDir
        },
        // seeds: {
        //     directory: __dirname + '/db/seeds',
        // },
        pool: {
            min: 2,
            max: 10
        },
        // Uncomment to show queries
        // debug: true
    });
}