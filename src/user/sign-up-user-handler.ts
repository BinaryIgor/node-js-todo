import { User } from "./user";
import { UserRepository } from "./user-repository";
import { newId } from "../ids";

export class SignUpUserHandler {

    constructor(private readonly userRepository: UserRepository) { }


    //TODO: validate, hash password etc.
    handle(command: SignUpUserCommand): Promise<void> {
        const newUser = new User(newId(), command.name, command.password)
        return this.userRepository.create(newUser);
    }
}

export class SignUpUserCommand {
    constructor(readonly name: string, readonly password: string) { }
}