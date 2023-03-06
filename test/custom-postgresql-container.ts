import { PostgreSqlContainer, StartedPostgreSqlContainer } from "testcontainers";
import { postgresDb } from "../src/common/postgres-db";
import { pathUpFromCurrentDir } from "../src/common/files";
import path from "path";

const POSTGRES_IMAGE = "postgres:14";

class _CustomPostgreSqlContainer extends PostgreSqlContainer {

    constructor() {
        super(POSTGRES_IMAGE);
    }

    private startedContainer?: StartedPostgreSqlContainer;

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
            console.log("Should set db!");

            const migrationsDir = path.join(await pathUpFromCurrentDir("db"), "migrations");

            const db = postgresDb({
                host: this.dbAccess.host,
                port: this.dbAccess.port,
                databse: this.dbAccess.database,
                user: this.dbAccess.user,
                password: this.dbAccess.password,
                migrationsDir: migrationsDir
            });

            await db.migrate.latest();
        }
        return this;
    }

    async clearDb() {
        console.log("Should clear db using...", this.dbAccess);
    }
}

export const CustomPostgreSqlContainer = new _CustomPostgreSqlContainer();

export class DbAccess {
    constructor(readonly host: string, readonly port: number, readonly database: string,
        readonly user: string, readonly password: string) { }
}
