import { UserRepository } from "../user-repository";
import { PasswordHasher } from "../password-hasher";
import { validateName, validatePassword } from "../user-validation";
import { NotFoundError } from "../../common/errors";
import { InvalidUserPasswordError } from "./user-errors";
import { AuthClient, AuthToken } from "../../auth/auth-api";

export class UserSignInHandler {

    constructor(private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly authClient: AuthClient) { }

    async handle(command: UserSignInCommand): Promise<AuthToken> {
        this.validateCommand(command);

        const user = await this.userRepository.ofName(command.name);
        if (!user) {
            throw new NotFoundError(`User of ${command.name} name doesn't exist`);
        }

        const validPassword = await this.passwordHasher.verify(command.password, user.password);
        if (!validPassword) {
            throw new InvalidUserPasswordError();
        }

        return this.authClient.ofUser(user.name);
    }

    private validateCommand(command: UserSignInCommand) {
        validateName(command.name);
        validatePassword(command.password);
    }
}

export class UserSignInCommand {
    constructor(readonly name: string, readonly password: string) { }
}