import { PostgreSqlContainer, StartedPostgreSqlContainer } from "testcontainers";
import { postgresDb } from "../src/common/postgres-db";
import { pathUpFromCurrentDir } from "../src/common/files";
import { Knex } from "knex";
import path from "path";

const POSTGRES_IMAGE = "postgres:14";

class _CustomPostgreSqlContainer extends PostgreSqlContainer {

    constructor() {
        super(POSTGRES_IMAGE);
    }

    private startedContainer?: StartedPostgreSqlContainer;
    private _db?: Knex;
    get db(): Knex {
        if (this._db) {
            return this._db
        }
        throw new Error("Db hasn't been set yet");
    }

    get dbAccess(): DbAccess {
        if (!this.startedContainer) {
            throw new Error("Container hasn't been started!");
        }
        return new DbAccess(this.startedContainer.getHost(), this.startedContainer.getPort(), this.startedContainer.getDatabase(),
            this.startedContainer.getUsername(), this.startedContainer.getPassword());
    }



    async startAndInit(): Promise<_CustomPostgreSqlContainer> {
        if (!this.startedContainer) {
            this.startedContainer = await super.start()

            const migrationsDir = path.join(await pathUpFromCurrentDir("db"), "migrations");

            this._db = postgresDb({
                host: this.dbAccess.host,
                port: this.dbAccess.port,
                databse: this.dbAccess.database,
                user: this.dbAccess.user,
                password: this.dbAccess.password,
                migrationsDir: migrationsDir
            });

            await this._db.migrate.latest();
        }
        return this;
    }

    async clearDb() {
        if (this._db) {
            //TODO: clear
        }
    }
}

export const CustomPostgreSqlContainer = new _CustomPostgreSqlContainer();

export class DbAccess {
    constructor(readonly host: string, readonly port: number, readonly database: string,
        readonly user: string, readonly password: string) { }
}
