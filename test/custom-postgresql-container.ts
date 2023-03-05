import { PostgreSqlContainer, StartedPostgreSqlContainer } from "testcontainers";

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
