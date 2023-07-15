import { AuthClient, AuthTokens } from "./auth-api";

export class RefreshTokenHandler {

    constructor(private readonly authClient: AuthClient) {}

    handle(refreshToken: string): AuthTokens {
        this.authClient.refresh()
    }
}