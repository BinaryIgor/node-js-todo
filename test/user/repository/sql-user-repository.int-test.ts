import { assert } from "chai";
import { dbTestSuite } from "../../db-test-suite";
import { SqlUserRepository } from "../../../src/user/repository/sql-user-repository";
import { CustomPostgreSqlContainer } from "../../custom-postgresql-container";
import { TestUserObjects } from "../user-test-utils";

let repository: SqlUserRepository;

dbTestSuite("SqlUserRepository tests", () => {
    beforeEach(() => {
        repository = new SqlUserRepository(CustomPostgreSqlContainer.db);
    });

    it('should allow to query user by name', async () => {
        console.log("DB...", CustomPostgreSqlContainer.dbAccess);

        const user1Name = "user-1";
        const user2Name = "user-2";
        const user1 = TestUserObjects.aUser({ name: user1Name });
        const user2 = TestUserObjects.aUser({ name: user2Name });

        assert.isUndefined(await repository.ofName(user1Name));
        assert.isUndefined(await repository.ofName(user2Name));

        await repository.create(user1);
        await repository.create(user2);

        assert.deepEqual(await repository.ofName(user1Name), user1);
        assert.deepEqual(await repository.ofName(user2Name), user2);
    });
});