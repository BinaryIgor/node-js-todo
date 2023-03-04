import { AuthClient, AuthToken } from "./auth-api";

export class JwtAuthClient implements AuthClient {

    //TODO: proper impl
    ofUser(id: string): AuthToken {
        return new AuthToken(id);
    }
}