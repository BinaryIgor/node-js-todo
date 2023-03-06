import { Knex } from "knex";

export async function up(knex: Knex) {
    return knex.raw(`
        CREATE SCHEMA "user";
        CREATE TABLE "user".user (
            id UUID PRIMARY KEY,
            name TEXT UNIQUE,
            password TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    `);
}

export async function down(knex: Knex) {
    return knex.raw(`DROP SCHEMA "user" CASCADE;`);
}