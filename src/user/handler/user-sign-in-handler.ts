import { UserRepository } from "../repository/user-repository";
import { PasswordHasher } from "../password-hasher";
import { validateName, validatePassword } from "../user-validator";
import { NotFoundError } from "../../common/errors";
import { IncorrectUserPasswordError } from "../user-errors";
import { AuthClient, AuthToken } from "../../auth/auth-api";
import { UUID } from "../../common/types";

export class UserSignInHandler {

    constructor(private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly authClient: AuthClient) { }

    async handle(command: UserSignInCommand): Promise<UserSignInResponse> {
        this.validateCommand(command);

        const user = await this.userRepository.ofName(command.name);
        if (!user) {
            throw new NotFoundError(`User of ${command.name} name doesn't exist`);
        }

        const validPassword = await this.passwordHasher.verify(command.password, user.password);
        if (!validPassword) {
            throw new IncorrectUserPasswordError();
        }

        const token = this.authClient.ofUser(user.id)
        
        return new UserSignInResponse(user.id, token);
    }

    private validateCommand(command: UserSignInCommand) {
        validateName(command.name);
        validatePassword(command.password);
    }
}

export class UserSignInCommand {
    constructor(readonly name: string, readonly password: string) { }
}

export class UserSignInResponse {
    constructor(readonly userId: UUID, readonly token: AuthToken) {}
}