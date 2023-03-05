import { AuthClient, AuthToken } from "../../src/auth/auth-api";
import { PasswordHasher } from "../../src/user/password-hasher";
import { User } from "../../src/user/user";
import { UserRepository } from "../../src/user/user-repository";
import { MAX_NAME_LENGTH, MAX_PASSWORD_LENGTH } from "../../src/user/user-validation";
import { randomString } from "../test-utils";

export class TestUserRepository implements UserRepository {

    private readonly users = new Map<string, User>();

    create(user: User): Promise<void> {
        this.users.set(user.id, user);
        return Promise.resolve();
    }

    ofName(name: string): Promise<User | null> {
        for (const u of this.users.values()) {
            if (u.name == name) {
                return Promise.resolve(u);
            }
        }

        return Promise.resolve(null);
    }
}

export class TestPasswordHasher implements PasswordHasher {

    private static readonly SALT = "test-salt";

    hash(password: string): Promise<string> {
        return Promise.resolve(`${TestPasswordHasher.SALT}:${password}`)
    }

    verify(rawPassword: string, hashedPassword: string): Promise<boolean> {
        const [salt, password] = hashedPassword.split(":");
        return Promise.resolve(salt == TestPasswordHasher.SALT && rawPassword == password);
    }
}

export class TestAuthClient implements AuthClient {

    private static readonly SECRET = "secret";

    ofUser(id: string): AuthToken {
        return new AuthToken(`${TestAuthClient.SECRET}:${id}`);
    }

}

export const TestUserObjects = {

    aUser({ id = randomString(), name = "User1", password = "complexPassword123" } = {}): User {
        return new User(id, name, password);
    },
    invalidNames(): (string | null | undefined)[] {
        return [
            "A",
            "",
            null,
            undefined,
            "8991",
            "9daad",
            "A" + "B".repeat(MAX_NAME_LENGTH)
        ];
    },
    invalidPasswords(): (string | null | undefined)[] {
        return [
            "",
            null,
            undefined,
            "89919001",
            "SomePasswordNodigits",
            "lowercase99",
            "1a" + "B".repeat(MAX_PASSWORD_LENGTH)
        ];
    },
};