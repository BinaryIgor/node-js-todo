import { CustomPostgreSqlContainer } from "./custom-postgresql-container";
import { startApp } from "../src/app";
import request from 'supertest';
import { AuthClient } from "../src/auth/auth-api";
import * as TestUtils from "./test-utils";

const APP_PORT = 10_000 + Math.ceil(Math.random() * 10_000);

export let authClient: AuthClient;

export const appIntTestSuite = (testsDescription: any, testsCallback: Function) => {
    describe(testsDescription, () => {
        before(async function () {
            //possible container download, then docker needs to start. It does take time!
            this.timeout(120_000);

            await CustomPostgreSqlContainer.startAndInit();

            const app = startApp({
                port: APP_PORT,
                db: CustomPostgreSqlContainer.dbAccess,
                jwt: {
                    accessTokenDuration: 100,
                    refreshTokenDuration: 1000,
                    secret: TestUtils.randomString(20),
                    issuer: "Todo App"
                }
            });

            authClient = app.authClient;
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