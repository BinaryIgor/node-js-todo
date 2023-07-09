import { UserContext } from "./auth-api";
import { AuthMiddleware } from "./auth-middleware";
import { JwtAuthClient } from "./jwt-auth-client";
import {Clock} from "../common/time";

export const authClient = (clock: Clock, 
    accessTokenDuration: number, 
    refreshTokenDuration: number,
    secret: string, 
    issuer: string) => new JwtAuthClient(clock, accessTokenDuration, refreshTokenDuration, secret, issuer);

export const authMiddleware = (isPublicEndpoint: (endpoint: string) => boolean,
    authenticate: (token: string) => UserContext) =>
    new AuthMiddleware(isPublicEndpoint, authenticate);