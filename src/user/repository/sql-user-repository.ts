import { User } from "../models";
import { UserRepository } from "./user-repository";
import { Knex } from 'knex';
import { UUID, OptionalPromise } from "../../common/types";

interface UserTable {
    id: UUID,
    name: string,
    password: string
}

const USER_SCHEMA = "user";
const USER_TABLE = "user";

export class SqlUserRepository implements UserRepository {

    constructor(private readonly db: Knex) { }

    create(user: User): Promise<void> {
        return this.db<UserTable>(USER_TABLE)
            .withSchema(USER_SCHEMA)
            .insert(user);
    }

    ofName(name: string): OptionalPromise<User> {
        return this.db<UserTable>(USER_TABLE)
            .withSchema(USER_SCHEMA)
            .select("id", "name", "password")
            .where({ name: name })
            .first();
    }
}