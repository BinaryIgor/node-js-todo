import { User } from "./user";
import { UserRepository } from "./user-repository";
import { newId } from "../ids";
import { PasswordHasher } from "./password-hasher";
import * as UserValidation from "./user-validation";

export class SignUpUserHandler {

    constructor(private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher) { }


    async handle(command: SignUpUserCommand) {
        this.validateCommand(command)
        
        const hashedPassword = await this.passwordHasher.hash(command.password);
        
        const newUser = new User(newId(), command.name, hashedPassword);

        await this.userRepository.create(newUser);
    }

    private validateCommand(command: SignUpUserCommand) {
        UserValidation.validateName(command.name);
        UserValidation.validatePassword(command.password);
    }

}

export class SignUpUserCommand {
    constructor(readonly name: string, readonly password: string) { }
}