import { UserContext } from "./auth-api";
import { AuthMiddleware } from "./auth-middleware";
import { JwtAuthClient } from "./jwt-auth-client";

//TODO: secret!
export const authClient = () => new JwtAuthClient();

export const authMiddleware = (isPublicEndpoint: (endpoint: string) => boolean,
    authenticate: (token: string) => UserContext) =>
    new AuthMiddleware(isPublicEndpoint, authenticate);