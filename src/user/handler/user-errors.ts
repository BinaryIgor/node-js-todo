import { AppError } from "../../common/errors";

export class InvalidUserPassword extends AppError {
    constructor() {
        super("User password is not valid");
    }
}