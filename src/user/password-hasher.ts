export interface PasswordHasher {

    hash(password: string): Promise<string>

    compare(rawPassword: string, hashedPassword: string): Promise<boolean>
}

export class DummyPasswordHasher implements PasswordHasher {

    hash(password: string): Promise<string> {
        return Promise.resolve(password);
    }

    compare(rawPassword: string, hashedPassword: string): Promise<boolean> {
        return Promise.resolve(rawPassword == hashedPassword);
    }
}