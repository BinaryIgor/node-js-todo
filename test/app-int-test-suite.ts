import { CustomPostgreSqlContainer } from "./custom-postgresql-container";
import { startApp } from "../src/app";
import request from 'supertest';

const APP_PORT = 3000;

export const appIntTestSuite = (testsDescription: any, testsCallback: Function) => {
    describe(testsDescription, () => {
        before(async function () {
            //possible container download, then docker needs to start. It does take time!
            this.timeout(120_000);

            await CustomPostgreSqlContainer.startAndInit();

            startApp({
                port: APP_PORT,
                db: CustomPostgreSqlContainer.dbAccess
            });
        });

        afterEach(async () => {
            await CustomPostgreSqlContainer.clearDb();
        });

        testsCallback();
    });
};

export function appRequest() {
    return request(`http://localhost:${APP_PORT}`);
}