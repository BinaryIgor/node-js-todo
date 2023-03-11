import { JwtAuthClient } from "./jwt-auth-client";

//TODO: secret!
export const authClient = () => new JwtAuthClient();