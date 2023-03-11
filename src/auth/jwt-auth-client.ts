import { AuthClient, AuthToken, UserContext } from "./auth-api";

//TODO: proper impl
export class JwtAuthClient implements AuthClient {

    ofUser(id: string): AuthToken {
        return new AuthToken(id);
    }

    authenticate(token: string): UserContext {
        return new UserContext(token);
    }
}