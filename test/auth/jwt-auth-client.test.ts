import { assert } from "chai";
import { TestClock, randomNumber, randomString } from "../test-utils";
import { JwtAuthClient } from "../../src/auth/jwt-auth-client";
import { newId } from "../../src/common/ids";
import * as Dates from "../../src/common/dates";
import { InvalidAuthTokenError } from "../../src/common/errors";
import { AuthTokens } from "../../src/auth/auth-api";
import { UUID } from "../../src/common/types";

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
        assertValidTokens(tokens, userId);
    });

    function assertValidTokens(tokens: AuthTokens, userId: UUID) {
        assert.notEqual(tokens.access.token, tokens.refresh.token);

        const expectedAccessTokenExpiresAt = Dates.dateFromSecondsTimestamp(clock.nowPlusSecondsTimestamp(accessTokenDuration));
        const expectedRefreshTokenExpiresAt = Dates.dateFromSecondsTimestamp(clock.nowPlusSecondsTimestamp(refreshTokenDuration));

        assert.deepEqual(tokens.access.expiresAt, expectedAccessTokenExpiresAt);
        assert.deepEqual(tokens.refresh.expiresAt, expectedRefreshTokenExpiresAt);

        const authenicatedUserId = client.authenticate(tokens.access.token).id;

        assert.equal(authenicatedUserId, userId);
    }

    invalidAuthTokens().forEach(t => {
        it(`should not authenticate invalid token: ${t}`, () => {
            assert.throw(() => client.authenticate(t!!), InvalidAuthTokenError);
        });
    });

    it('should not authenticate expired token', () => {
        const accessToken = client.ofUser(newId()).access;

        clock.setTime(accessToken.expiresAt);
        clock.moveTimeBy(1);

        assert.throw(() => client.authenticate(accessToken.token), InvalidAuthTokenError);
    });

    it('should not refresh tokens given expired refresh token', () => {
        const refreshToken = client.ofUser(newId()).refresh;

        clock.setTime(refreshToken.expiresAt);
        clock.moveTimeBy(1);

        assert.throw(() => client.refresh(refreshToken.token), InvalidAuthTokenError);
    });

    it('should refresh tokens', () => {
        const userId = newId();
        const refreshToken = client.ofUser(userId).refresh;

        clock.moveTimeBy(1);

        const tokens = client.refresh(refreshToken.token);

        assert.notDeepEqual(refreshToken, tokens.refresh);

        assertValidTokens(tokens, userId);
    });
});

function invalidAuthTokens(): (string | undefined | null)[] {
    const refreshToken = client.ofUser(newId()).refresh.token;
    return ["", undefined, null, refreshToken, randomString()];
}