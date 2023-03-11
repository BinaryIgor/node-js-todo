
export const MIN_NAME_LENGTH = 3;
export const MAX_NAME_LENGTH = 20;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 50;

export function isNameValid(name: string): boolean {
    let valid: boolean;
    try {
        valid = name.length >= MIN_NAME_LENGTH && name.length <= MAX_NAME_LENGTH
            && isLetter(name.charAt(0));
    } catch (e) {
        valid = false;
    }
    return valid;
}

export function isLetter(char: string): boolean {
    return char.toUpperCase() != char.toLowerCase();
}

export function isUpperCaseLetter(char: string): boolean {
    return isLetter(char) && char == char.toUpperCase();
}

export function isLowerCaseLetter(char: string): boolean {
    return isLetter(char) && char == char.toLowerCase();
}