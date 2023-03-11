import { AppError, ValidationError } from "../common/errors";

export class InvalidUserNameError extends ValidationError {
    constructor(name: string) {
        super(`${name} is not a valid name`);
    }
}

export class InvalidPasswordError extends ValidationError {
    constructor() {
        super(`Password is not a valid`);
    }
}

export class IncorrectUserPasswordError extends AppError {
    constructor() {
        super("User password is not correct");
    }
}