import { CustomPostgreSqlContainer } from "./custom-postgresql-container";

export const dbTestSuite = (testsDescription: any, testsCallback: Function) => {
    describe(testsDescription, () => {
        before(async function () {
            //possible container download, then docker needs to start. It does take time!
            this.timeout(120_000);
            await CustomPostgreSqlContainer.startAndInit();
        });

        afterEach(async () => {
            await CustomPostgreSqlContainer.clearDb();
        });

        testsCallback();
    });
};