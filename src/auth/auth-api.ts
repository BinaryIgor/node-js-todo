import { JwtAuthClient } from "./jwt-auth-client"

export class AuthToken {
    constructor(readonly token: string) { }
}

export interface AuthClient {
    ofUser(id: string): AuthToken
}

export const authClient = new JwtAuthClient();