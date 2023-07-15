import { Knex } from "knex";

export async function up(knex: Knex) {
    return knex.raw(`
        CREATE SCHEMA todo;
        
        CREATE TABLE todo.todo (
            id UUID PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES "user"."user"(id) ON DELETE CASCADE,

            name TEXT UNIQUE NOT NULL,
            deadline TIMESTAMP,
            priority TEXT NOT NULL,
            description TEXT,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        CREATE INDEX todo_user_id ON todo.todo(user_id);

        CREATE TABLE todo.step (
            todo_id UUID NOT NULL REFERENCES todo.todo(id) ON DELETE CASCADE,
            "order" INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT,

            PRIMARY KEY(todo_id, name)
        );
    `);
}

export async function down(knex: Knex) {
    return knex.raw(`DROP SCHEMA todo CASCADE;`);
}