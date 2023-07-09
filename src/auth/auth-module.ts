import { AuthClient } from "./auth-api";
import { AuthMiddleware } from "./auth-middleware";
import { JwtAuthClient } from "./jwt-auth-client";
import { Clock } from "../common/time";

export class AuthModule {

    readonly client: AuthClient
    readonly middleware: AuthMiddleware

    constructor(config: {
        clock: Clock,
        accessTokenDuration: number,
        refreshTokenDuration: number,
        secret: string,
        issuer: string,
        isPublicEndpoint: (endpoint: string) => boolean
    }) {
        this.client = new JwtAuthClient(config.clock, config.accessTokenDuration,
            config.refreshTokenDuration, config.secret, config.issuer);
        this.middleware = new AuthMiddleware(config.isPublicEndpoint, this.client.authenticate);
    }
}