import { expect } from "chai";
import request from 'supertest';
import { app } from '../src/app';

describe("Users endpoints tests", () => {

    it('should allow to sign-up', async () => {
        const response = await request(app)
            .post("/users/sign-up")
            .send({
                "name": "some-name",
                "password": "complex password"
            });

        expect(response.statusCode).to.be.eq(201);
    });
})