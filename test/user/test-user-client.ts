import request from 'supertest';
import { UUID } from '../../src/common/types';
import { randomString } from '../test-utils';
import { AuthClient } from '../../src/auth/auth-api';

export class TestUserClient {

    constructor(readonly appUrl: string,
        readonly authClient: AuthClient) {

    }

    async createUser({ name = "user-" + randomString(3), password = randomString() + "a1Z" } = {}): Promise<UUID> {
        return this.appRequest().post("/users/sign-up")
            .send({ name, password })
            .then(r => r.body.id);
    }

    async createUserWithToken({ name = "user-" + randomString(3), password = randomString() + "a1Z" } = {}):
        Promise<{ id: UUID, token: string }> {
        const id = await this.createUser({ name, password });
        const token = this.accessTokenForUser(id);
        return { id, token };
    }

    accessTokenForUser(id: UUID): string {
        return this.authClient.ofUser(id).access.token;
    }

    private appRequest() {
        return request(this.appUrl);
    }
}