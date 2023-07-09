import { UUID } from "../common/types";

export class AuthToken {
    constructor(readonly token: string, readonly expiresAt: Date) { }
}

export class AuthTokens {
    constructor(readonly access: AuthToken, readonly refresh: AuthToken) { }
}

export class RefreshTokenRequest {
    constructor(readonly token: string) { }
}

export interface AuthClient {

    ofUser(id: UUID): AuthTokens

    authenticate(accessToken: string): UserContext

    refresh(refreshToken: string): AuthTokens
}

export class UserContext {
    constructor(readonly id: UUID) { }
}