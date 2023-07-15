import { Request, NextFunction } from "express";
import { UnauthenticatedError } from "../common/errors";
import { AuthClient, UserContext } from "./auth-api";
import { setUserContext } from "./web-user-context";

const TOKEN_PREFIX = "Bearer ";

//TODO: something more complicated probably
export class AuthMiddleware {

    constructor(readonly isPublicEndpoint: (endpoint: string) => boolean,
        readonly authClient: AuthClient) { }

    call(req: Request, next: NextFunction) {
        const context = this.authenticateOrUndefined(req);

        if (this.isPublicEndpoint(req.path)) {
            if (context) {
                setUserContext(req, context);
            }
            next();
        } else {
            if (context) {
                setUserContext(req, context);
                next();
            } else {
                throw new UnauthenticatedError();
            }
        }
    }

    private authenticateOrUndefined(req: Request): UserContext | undefined {
        const authorization = req.header("Authorization");

        if (authorization && authorization.startsWith(TOKEN_PREFIX)) {
            const token = authorization.replace(TOKEN_PREFIX, "");
            return this.authClient.authenticate(token);
        }

        return undefined;
    }
}