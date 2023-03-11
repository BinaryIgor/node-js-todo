export class AuthToken {
    constructor(readonly token: string) { }
}

export interface AuthClient {
    ofUser(id: string): AuthToken
}