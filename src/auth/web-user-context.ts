import { UnauthenticatedError } from "../common/errors";
import { UserContext } from "./auth-api";

export function setUserContext(req: any, context: UserContext) {
    req.user = context;
}

export function getUserContext(req: any): UserContext | undefined {
    return req.user?.(req.user as UserContext)
}

export function getUserContextOrThrow(req: any): UserContext {
    const ctx = getUserContext(req);
    if (ctx) {
        return ctx;
    }
    throw new UnauthenticatedError();
}