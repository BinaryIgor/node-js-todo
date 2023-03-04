import { InvalidNameError, InvalidPasswordError } from "./handler/user-errors";

export const MIN_NAME_LENGTH = 3;
export const MAX_NAME_LENGTH = 20;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 50;

export function validateName(name: string) {
    let valid: boolean;
    try {
        valid = name.length >= MIN_NAME_LENGTH && name.length <= MAX_NAME_LENGTH
            && isLetter(name.charAt(0));
    } catch (e) {
        valid = false;
    }
    if (!valid) {
        throw new InvalidNameError(name);
    }
}

function isLetter(char: string): boolean {
    return char.toUpperCase() != char.toLowerCase();
}

function isUpperCaseLetter(char: string): boolean {
    return isLetter(char) && char == char.toUpperCase();
}

function isLowerCaseLetter(char: string): boolean {
    return isLetter(char) && char == char.toLowerCase();
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
    let hasRequiredCharacters =  false;

    for (const c of password) {
        if (!hasLowerCaseLetter && isLowerCaseLetter(c)) {
            hasLowerCaseLetter = true;
        }
        if (!hasUpperCaseLetter && isUpperCaseLetter(c)) {
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