import { Router, Request, Response } from "express";
import { asyncHandler, requireBody } from "../common/web";
import { AuthClient, RefreshTokenRequest } from "./auth-api";
import { AuthMiddleware } from "./auth-middleware";
import { JwtAuthClient } from "./jwt-auth-client";
import { Clock } from "../common/dates";

export class AuthModule {

    readonly client: AuthClient
    readonly middleware: AuthMiddleware
    readonly router: Router

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
        this.middleware = new AuthMiddleware(config.isPublicEndpoint, this.client);

        this.router = Router();
        this.router.post("/refresh-tokens", asyncHandler(async (req: Request, res: Response) => {
            const request = requireBody<RefreshTokenRequest>(req);
            const tokens = this.client.refresh(request.token);
            res.send(tokens);
        }));
    }
}