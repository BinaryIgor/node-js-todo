import { User } from "../user";
import { UserRepository } from "../repository/user-repository";
import { newId } from "../../common/ids";
import { PasswordHasher } from "../password-hasher";
import * as UserValidator from "../user-validator";

export class UserSignUpHandler {

    constructor(private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher) { }


    async handle(command: UserSignUpCommand) {
        this.validateCommand(command)
        
        const hashedPassword = await this.passwordHasher.hash(command.password);
        
        const newUser = new User(newId(), command.name, hashedPassword);

        await this.userRepository.create(newUser);
    }

    private validateCommand(command: UserSignUpCommand) {
        UserValidator.validateName(command.name);
        UserValidator.validatePassword(command.password);
    }

}

export class UserSignUpCommand {
    constructor(readonly name: string, readonly password: string) { }
}