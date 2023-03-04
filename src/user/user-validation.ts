import { ValidationError } from "../common/errors";

export const MIN_NAME_LENGTH = 3;
export const MAX_NAME_LENGTH = 20;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 50;

//TODO: better!

export function validateName(name: string) {
    let valid: boolean;
    try {
        valid = name.length >= MIN_NAME_LENGTH && name.length <= MAX_NAME_LENGTH;
    } catch (e) {
        valid = false;
    }
    if (!valid) {
        throw new ValidationError("Name is not valid")
    }
}

export function validatePassword(password: string) {
    let valid: boolean;
    try {
        valid = password.length >= MIN_PASSWORD_LENGTH && password.length <= MAX_PASSWORD_LENGTH;
    } catch (e) {
        valid = false;
    }
    if (!valid) {
        throw new ValidationError("Password is not valid");
    }
}