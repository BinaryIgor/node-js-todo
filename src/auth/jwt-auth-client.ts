import { UUID } from "../common/types";
import * as time from "../common/time";
import { AuthClient, AuthToken,AuthTokens, UserContext } from "./auth-api";
import jwt, { JwtPayload } from 'jsonwebtoken';
// import { promisify } from "util";
import { InvalidAuthTokenError, UnauthenticatedError } from "../common/errors";

const ALGORITHM = "HS512";
// const signJwtAsync = promisify(jwt.sign);

enum TokenType {
    ACCESS = "ACCESS",
    REFRESH = "REFRESH"
};

//TODO: proper impl
export class JwtAuthClient implements AuthClient {

    constructor(private readonly clock: time.Clock,
        private readonly accessTokenDuration: number,
        private readonly refreshTokenDuration: number, 
        private readonly secret: string,
        private readonly issuer: string) { }

    ofUser(id: UUID): AuthTokens {
        const access = this.tokenOfUser(id, TokenType.ACCESS);
        const refresh  = this.tokenOfUser(id, TokenType.REFRESH);
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

        return new AuthToken(signed, new Date(expiresAt * 1000));
    }

    authenticate(accessToken: string): UserContext {
        try {
            const decoded = jwt.verify(accessToken, this.secret, {
                clockTimestamp: time.toSecondsTimestamp(this.clock.now())
            }) as JwtPayload;

            if (decoded.issuer != this.issuer) {
                throw new InvalidAuthTokenError();
            }
            if (decoded.typ != TokenType.ACCESS) {
                throw new InvalidAuthTokenError();
            }

            console.log("Decoded...", decoded);

            return new UserContext(decoded.sub as UUID);
        } catch (e) {
            //TODO: another exception?
            console.error("Problem while authenticating token", e);
            throw new InvalidAuthTokenError();
        }
    }


    refresh(refreshToken: string): AuthTokens {
        throw new Error("Method not implemented.");
    }
}