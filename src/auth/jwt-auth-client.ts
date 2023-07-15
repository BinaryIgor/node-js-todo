import { UUID } from "../common/types";
import * as time from "../common/date";
import { AuthClient, AuthToken, AuthTokens, UserContext } from "./auth-api";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { InvalidAuthTokenError } from "../common/errors";

const ALGORITHM = "HS512";

enum TokenType {
    ACCESS = "ACCESS",
    REFRESH = "REFRESH"
};

export class JwtAuthClient implements AuthClient {

    constructor(private readonly clock: time.Clock,
        private readonly accessTokenDuration: number,
        private readonly refreshTokenDuration: number,
        private readonly secret: string,
        private readonly issuer: string) { }

    ofUser(id: UUID): AuthTokens {
        const access = this.tokenOfUser(id, TokenType.ACCESS);
        const refresh = this.tokenOfUser(id, TokenType.REFRESH);
        return new AuthTokens(access, refresh);
    }

    tokenOfUser(id: UUID, type: TokenType): AuthToken {
        const nowSeconds = time.toSecondsTimestamp(this.clock.now());
        const expiresAt = nowSeconds + (type == TokenType.ACCESS ? this.accessTokenDuration : this.refreshTokenDuration);

        const signed = jwt.sign({
            sub: id,
            issuer: this.issuer,
            typ: type,
            iss: nowSeconds,
            exp: expiresAt,
        }, this.secret, { algorithm: ALGORITHM });

        return new AuthToken(signed, time.dateFromSecondsTimestamp(expiresAt));
    }

    authenticate(accessToken: string): UserContext {
        return this._authenticate(accessToken, TokenType.ACCESS);
    }

    private _authenticate(token: string, type: TokenType): UserContext {
        try {
            const decoded = jwt.verify(token, this.secret, {
                clockTimestamp: time.toSecondsTimestamp(this.clock.now())
            }) as JwtPayload;

            if (decoded.issuer != this.issuer) {
                throw new InvalidAuthTokenError();
            }
            if (decoded.typ != type) {
                throw new InvalidAuthTokenError();
            }

            return new UserContext(decoded.sub as UUID);
        } catch (e) {
            throw new InvalidAuthTokenError();
        }
    }

    refresh(refreshToken: string): AuthTokens {
        const decoded = this._authenticate(refreshToken, TokenType.REFRESH);
        return this.ofUser(decoded.id);
    }
}