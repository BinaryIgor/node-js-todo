import { assert } from "chai";
import { TestClock, randomNumber, randomString } from "../test-utils";
import { JwtAuthClient } from "../../src/auth/jwt-auth-client";
import { newId } from "../../src/common/ids";
import  * as Time from "../../src/common/time";
import { InvalidAuthTokenError } from "../../src/common/errors";

const clock = new TestClock();

const accessTokenDuration = randomNumber(100, 1000);
const refreshTokenDuration = randomNumber(1000, 10_000);

const secret = randomString();
const issuer = "Some issuer";

const client = new JwtAuthClient(clock, accessTokenDuration, refreshTokenDuration, secret, issuer);

describe("JwtAuthClient tests", () => {
    it('should generate tokens of an user', () => {
        const userId = newId();
        const tokens = client.ofUser(userId);

        assert.notEqual(tokens.access.token, tokens.refresh.token);

        const expectedAccessTokenExpiresAt = Time.dateFromSecondsTimestamp(clock.nowPlusSecondsTimestamp(accessTokenDuration));
        const expectedRefreshTokenExpiresAt = Time.dateFromSecondsTimestamp(clock.nowPlusSecondsTimestamp(refreshTokenDuration));

        assert.deepEqual(tokens.access.expiresAt, expectedAccessTokenExpiresAt);
        assert.deepEqual(tokens.refresh.expiresAt, expectedRefreshTokenExpiresAt);

        const authenicatedUserId = client.authenticate(tokens.access.token).id;

        assert.equal(authenicatedUserId, userId);
    });

    invalidAuthTokens().forEach(t => {
        it(`should not authenticate invalid token: ${t}`, () => {
            assert.throw(() => client.authenticate(t!!), InvalidAuthTokenError);
        });
    });
});


function invalidAuthTokens(): (string | undefined | null)[] {
    const refreshToken = client.ofUser(newId()).refresh.token;
    return ["", undefined, null, refreshToken, randomString()];
}