import { CustomPostgreSqlContainer } from "./custom-postgresql-container";
import { startApp } from "../src/app";
import request from 'supertest';
import { AuthClient } from "../src/auth/auth-api";
import * as TestUtils from "./test-utils";



let appPort: number;
export let authClient: AuthClient;
export const clock: TestUtils.TestClock = new TestUtils.TestClock();

export const appIntTestSuite = (testsDescription: any, testsCallback: Function) => {
    describe(testsDescription, () => {
        before(async function () {
            //possible container download, then docker needs to start. It does take time!
            this.timeout(120_000);

            await CustomPostgreSqlContainer.startAndInit();

            appPort = 10_000 + Math.ceil(Math.random() * 10_000);

            const app = startApp({
                port: appPort,
                db: CustomPostgreSqlContainer.dbAccess,
                jwt: {
                    accessTokenDuration: 100,
                    refreshTokenDuration: 1000,
                    secret: TestUtils.randomString(20),
                    issuer: "Todo App"
                }
            }, clock);

            authClient = app.authClient;
        });

        afterEach(async () => {
            await CustomPostgreSqlContainer.clearDb();
        });

        testsCallback();
    });
};

export function appRequest() {
    return request(appUrl());
}

export function appUrl() {
    return `http://localhost:${appPort}`;
}