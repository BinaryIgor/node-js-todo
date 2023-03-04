import { expect, assert } from "chai";
import request from 'supertest';
import { app } from '../../src/app';
import { ErrorResponse, BodyRequiredError } from "../../src/common/web";

describe("Users endpoints tests", () => {

    it('should return error while trying to sign-up without required body', async () => {
        const response = await request(app)
            .post("/users/sign-up")
            .send();

        assert.equal(response.statusCode, 400);
        assert.deepEqual(response.body, ErrorResponse.ofError(new BodyRequiredError()));
    });
})