import { InvalidUserNameError, InvalidPasswordError } from "./user-errors";
import * as Validator from "../common/validator";

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 50;

export function validateName(name: string) {
    if (!Validator.isNameValid(name)) {
        throw new InvalidUserNameError(name);
    }
}

export function validatePassword(password: string) {
    let valid: boolean;
    try {
        valid = password.length >= MIN_PASSWORD_LENGTH && password.length <= MAX_PASSWORD_LENGTH
            && hasPasswordRequiredCharacters(password);
    } catch (e) {
        valid = false;
    }
    if (!valid) {
        throw new InvalidPasswordError();
    }
}

function hasPasswordRequiredCharacters(password: string): boolean {
    if (!containsDigit(password)) {
        return false;
    }

    let hasLowerCaseLetter = false;
    let hasUpperCaseLetter = false;
    let hasRequiredCharacters = false;

    for (const c of password) {
        if (!hasLowerCaseLetter && Validator.isLowerCaseLetter(c)) {
            hasLowerCaseLetter = true;
        }
        if (!hasUpperCaseLetter && Validator.isUpperCaseLetter(c)) {
            hasUpperCaseLetter = true;
        }
        hasRequiredCharacters = hasLowerCaseLetter && hasUpperCaseLetter;
        if (hasRequiredCharacters) {
            break;
        }
    }

    return hasRequiredCharacters;
}

function containsDigit(string: string) {
    return /\d+/.test(string);
}